import { ApplicationConfig, provideAppInitializer, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client';
import { RuntimeConfigService } from './core/config/runtime-config.service';
import { API_BASE_URL, GRAPHQL_URL } from './core/tokens/api-endpoints.token';
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

      return {
        link: httpLink.create({
          uri: graphqlUrl,
        }),
        cache: new InMemoryCache(),
      };
    }),
  ],
};
