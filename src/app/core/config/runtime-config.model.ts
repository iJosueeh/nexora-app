export interface RuntimeConfig {
  apiBaseUrl: string;
  graphqlUrl: string;
}

export const defaultRuntimeConfig: RuntimeConfig = {
  apiBaseUrl: '/api',
  graphqlUrl: '/graphql',
};
