import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { AuthSession } from '../../../core/services/auth-session';
import { Loading } from '../../../shared/components/loading/loading';
import { LOADING_MESSAGES } from '../../../shared/constants/loading-messages';
import { AuthApiService } from '../services/auth-api.service';

@Component({
  selector: 'app-microsoft-callback',
  standalone: true,
  imports: [Loading],
  templateUrl: './microsoft-callback.html',
  styleUrl: './microsoft-callback.css',
})
export class MicrosoftCallback {
  isLoading = true;
  readonly loadingMessage = LOADING_MESSAGES.AUTH.MICROSOFT_VERIFYING;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly authApi = inject(AuthApiService);
  private readonly authSession = inject(AuthSession);

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;

    const authError = params.get('error') || params.get('error_description');
    if (authError) {
      this.failLogin('Microsoft devolvió un error de autenticación.');
      return;
    }

    const code = params.get('code');
    if (!code) {
      this.failLogin('No se recibió el código de autorización de Microsoft.');
      return;
    }

    const state = params.get('state') ?? undefined;
    const redirectUri = `${window.location.origin}/auth/microsoft/callback`;

    this.authApi
      .completeMicrosoftLogin({ code, state, redirectUri })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          const email = response.email?.trim() ?? '';
          if (!this.authApi.isAllowedMicrosoftDomain(email)) {
            this.toastr.error('Solo se permite iniciar sesión con cuentas @utp.edu.pe.', 'Dominio no permitido');
            this.router.navigate(['/login']);
            return;
          }

          this.authSession.start({
            user: response.user ?? { email },
            tokens: response.tokens,
          });

          this.toastr.success('Inicio de sesión con Microsoft completado.', 'Bienvenido');
          this.router.navigate(['/home']);
        },
        error: () => {
          this.failLogin('No se pudo completar el login con Microsoft.');
        },
      });
  }

  private failLogin(message: string): void {
    this.isLoading = false;
    this.toastr.error(message, 'Error de autenticación');
    this.router.navigate(['/login']);
  }
}
