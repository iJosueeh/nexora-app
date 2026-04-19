import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';

import { AuthSession } from '../services/auth-session';
import { SupabaseAuthService } from '../services/supabase-auth.service';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/graphql')) {
    return next(req);
  }

  const authSession = inject(AuthSession);
  const supabaseAuth = inject(SupabaseAuthService);

  return from(supabaseAuth.getValidTokens()).pipe(
    switchMap((tokens) => {
      const accessToken = tokens?.accessToken ?? authSession.getTokens()?.accessToken;

      if (!accessToken) {
        return next(req);
      }

      const tokenType = tokens?.tokenType ?? authSession.getTokens()?.tokenType ?? 'Bearer';
      const authorizedRequest = req.clone({
        setHeaders: {
          Authorization: `${tokenType} ${accessToken}`,
        },
      });

      return next(authorizedRequest);
    })
  );
};
