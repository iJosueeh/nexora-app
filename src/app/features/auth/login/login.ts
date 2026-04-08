import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthSession } from '../../../core/services/auth-session';
import { Loading } from '../../../shared/components/loading/loading';
import { LOADING_MESSAGES } from '../../../shared/constants/loading-messages';
import { AuthApiService } from '../services/auth-api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, NgClass, Loading],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  activeTab: 'login' | 'signup' = 'login';

  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  isLoading = false;
  readonly loadingMessage = LOADING_MESSAGES.AUTH.LOGIN_VALIDATING;

  constructor(
    private router: Router,
    private readonly authApi: AuthApiService,
    private readonly toastr: ToastrService,
    private readonly authSession: AuthSession
  ) { }

  goToSignUp(): void {
    this.router.navigate(['/register']);
  }

  onLogin(): void {
    if (!this.email || !this.password) return;

    this.isLoading = true;

    this.authApi
      .login({
        email: this.email.trim(),
        password: this.password,
        rememberMe: this.rememberMe,
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          const fallbackEmail = this.email.trim();
          this.authSession.start(
            {
              user: response.user ?? { email: response.email ?? fallbackEmail },
              tokens: response.tokens,
            },
            this.rememberMe
          );

          this.toastr.success('Inicio de sesión exitoso.', 'Bienvenido');
          this.router.navigate(['/home']);
        },
        error: () => {
          this.toastr.error('No se pudo iniciar sesión. Verifica tus credenciales.', 'Error');
        },
      });
  }

  onUtpLogin(): void {
    try {
      this.isLoading = true;
      const redirectUri = `${window.location.origin}/auth/microsoft/callback`;
      const authStartUrl = this.authApi.getMicrosoftAuthStartUrl(redirectUri);
      window.location.assign(authStartUrl);
    } catch {
      this.isLoading = false;
      this.toastr.error('No se pudo iniciar el login con Microsoft.', 'Error');
    }
  }
}
