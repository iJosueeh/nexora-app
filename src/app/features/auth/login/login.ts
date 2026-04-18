import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { catchError, firstValueFrom, of, timeout } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthSession } from '../../../core/services/auth-session';
import { SupabaseAuthService } from '../../../core/services/supabase-auth.service';
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
    private readonly supabaseAuth: SupabaseAuthService,
    private readonly toastr: ToastrService,
    private readonly authSession: AuthSession
  ) { }

  goToSignUp(): void {
    this.router.navigate(['/register']);
  }

  async onLogin(): Promise<void> {
    if (!this.email || !this.password || this.isLoading) return;

    const email = this.email.trim();
    const password = this.password;

    this.isLoading = true;
    let sessionStarted = false;
    try {
      const supabaseSession = await this.supabaseAuth.signInWithEmail(email, password);

      this.authSession.start(
        {
          user: supabaseSession.user,
          tokens: supabaseSession.tokens,
        },
        this.rememberMe
      );
      sessionStarted = true;

      const response = await firstValueFrom(
        this.authApi.getSessionProfile().pipe(
          timeout(8000),
          catchError(() => of(null))
        )
      );

      if (!response) {
        if (sessionStarted) {
          this.authSession.clear();
          await this.supabaseAuth.signOut().catch(() => undefined);
          sessionStarted = false;
        }

        this.toastr.error(
          'No se pudo validar tu perfil con el servidor. Intenta nuevamente en unos segundos.',
          'Acceso denegado temporalmente'
        );
        return;
      }

      this.authSession.start(
        {
          user: {
            ...supabaseSession.user,
            ...(response.user ?? { email: response.email ?? email }),
          },
          tokens: supabaseSession.tokens,
        },
        this.rememberMe
      );

      if (response.user?.profileComplete === false) {
        this.toastr.info('Completa tu perfil academico para continuar.', 'Perfil incompleto');
        this.router.navigate(['/register']);
        return;
      }

      this.toastr.success('Inicio de sesión exitoso.', 'Bienvenido');
      this.router.navigate(['/feed']);
    } catch (error) {
      if (sessionStarted) {
        this.authSession.clear();
      }

      const message = this.supabaseAuth.isEmailNotConfirmedError(error)
        ? 'Debes confirmar tu correo institucional antes de iniciar sesión.'
        : 'No se pudo iniciar sesión. Verifica tus credenciales.';

      this.toastr.error(message, 'Error');
    } finally {
      this.isLoading = false;
    }
  }
}
