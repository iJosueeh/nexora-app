import { Injectable } from '@angular/core';

import { defaultRuntimeConfig, type RuntimeConfig } from './runtime-config.model';

@Injectable({
  providedIn: 'root',
})
export class RuntimeConfigService {
  private config: RuntimeConfig = defaultRuntimeConfig;

  get value(): RuntimeConfig {
    return this.config;
  }

  async load(): Promise<void> {
    try {
      const response = await fetch('/config/app-config.json', { cache: 'no-store' });
      if (!response.ok) {
        this.config = defaultRuntimeConfig;
        return;
      }

      const incoming: unknown = await response.json();
      this.config = this.mergeConfig(incoming);
    } catch {
      this.config = defaultRuntimeConfig;
    }
  }

  private mergeConfig(incoming: unknown): RuntimeConfig {
    if (typeof incoming !== 'object' || incoming === null || Array.isArray(incoming)) {
      return defaultRuntimeConfig;
    }

    const record = incoming as Record<string, unknown>;

    const apiBaseUrl = typeof record['apiBaseUrl'] === 'string'
      ? record['apiBaseUrl']
      : defaultRuntimeConfig.apiBaseUrl;

    const graphqlUrl = typeof record['graphqlUrl'] === 'string'
      ? record['graphqlUrl']
      : defaultRuntimeConfig.graphqlUrl;

    const supabaseUrl = typeof record['supabaseUrl'] === 'string'
      ? record['supabaseUrl']
      : defaultRuntimeConfig.supabaseUrl;

    const supabaseAnonKey = typeof record['supabaseAnonKey'] === 'string'
      ? record['supabaseAnonKey']
      : defaultRuntimeConfig.supabaseAnonKey;

    return {
      apiBaseUrl,
      graphqlUrl,
      supabaseUrl,
      supabaseAnonKey,
    };
  }
}
