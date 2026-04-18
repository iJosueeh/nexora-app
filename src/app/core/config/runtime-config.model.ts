export interface RuntimeConfig {
  apiBaseUrl: string;
  graphqlUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export const defaultRuntimeConfig: RuntimeConfig = {
  apiBaseUrl: '/api',
  graphqlUrl: '/graphql',
  supabaseUrl: '',
  supabaseAnonKey: '',
};
