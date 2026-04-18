import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthSession } from '../services/auth-session';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authSession = inject(AuthSession);
  const tokens = authSession.getTokens();
  const accessToken = tokens?.accessToken;

  if (!accessToken) {
    return next(req);
  }

  const tokenType = tokens?.tokenType ?? 'Bearer';
  const authorizedRequest = req.clone({
    setHeaders: {
      Authorization: `${tokenType} ${accessToken}`,
    },
  });

  return next(authorizedRequest);
};
