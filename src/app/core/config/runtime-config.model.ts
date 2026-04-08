export interface RuntimeConfig {
  apiBaseUrl: string;
  graphqlUrl: string;
  microsoftAuthStartUrl: string;
  microsoftAuthCallbackPath: string;
  microsoftAllowedDomain: string;
}

export const defaultRuntimeConfig: RuntimeConfig = {
  apiBaseUrl: '/api',
  graphqlUrl: '/graphql',
  microsoftAuthStartUrl: '/api/auth/microsoft/authorize',
  microsoftAuthCallbackPath: '/auth/microsoft/callback',
  microsoftAllowedDomain: 'utp.edu.pe',
};
