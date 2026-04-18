import { ApplicationConfig, provideAppInitializer, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client';
import { from } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { RuntimeConfigService } from './core/config/runtime-config.service';
import { API_BASE_URL, GRAPHQL_URL } from './core/tokens/api-endpoints.token';
import { AuthSession } from './core/services/auth-session';
import { SupabaseAuthService } from './core/services/supabase-auth.service';
import { authTokenInterceptor } from './core/interceptors/auth-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimations(),
    provideToastr({
      timeOut: 3500,
      progressBar: true,
      closeButton: true,
      preventDuplicates: true,
      positionClass: 'toast-top-right',
    }),
    provideAppInitializer(() => inject(RuntimeConfigService).load()),
    {
      provide: API_BASE_URL,
      useFactory: () => inject(RuntimeConfigService).value.apiBaseUrl,
    },
    {
      provide: GRAPHQL_URL,
      useFactory: () => inject(RuntimeConfigService).value.graphqlUrl,
    },
    provideHttpClient(withInterceptors([authTokenInterceptor])),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const graphqlUrl = inject(GRAPHQL_URL);
      const authSession = inject(AuthSession);
      const supabaseAuth = inject(SupabaseAuthService);

      const authLink = setContext(async (operation, context) => {
        const operationName = operation.operationName ?? '';
        const isPublicOperation = operationName === 'FeedPosts' || operationName === 'AvailableTags';

        if (isPublicOperation) {
          return context;
        }

        const liveTokens = await supabaseAuth.getValidTokens();
        const accessToken = liveTokens?.accessToken ?? authSession.getTokens()?.accessToken;

        if (!accessToken) {
          if (authSession.isAuthenticated()) {
            await supabaseAuth.expireSessionAndRedirect();
          }

          return context;
        }

        return {
          headers: {
            ...(context.headers as Record<string, string> | undefined),
            Authorization: `${liveTokens?.tokenType ?? authSession.getTokens()?.tokenType ?? 'Bearer'} ${accessToken}`,
          },
        };
      });

      return {
        link: from([authLink, httpLink.create({ uri: graphqlUrl })]),
        cache: new InMemoryCache(),
      };
    }),
  ],
};
