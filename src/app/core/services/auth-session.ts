import { Injectable } from '@angular/core';

import { AuthTokens, AuthUser, SessionPayload } from '../../interfaces/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthSession {
  private readonly sessionStorageKey = 'nexora.auth.session';
  private readonly rememberStorageKey = 'nexora.auth.remember';

  private session: SessionPayload | null;

  constructor() {
    this.session = this.loadFromStorage(this.rememberStorageKey)
      ?? this.loadFromStorage(this.sessionStorageKey);
  }

  start(payload: SessionPayload, rememberMe = false): void {
    this.session = payload;
    const serialized = JSON.stringify(payload);

    if (rememberMe) {
      localStorage.setItem(this.rememberStorageKey, serialized);
      sessionStorage.removeItem(this.sessionStorageKey);
      return;
    }

    sessionStorage.setItem(this.sessionStorageKey, serialized);
    localStorage.removeItem(this.rememberStorageKey);
  }

  clear(): void {
    this.session = null;
    sessionStorage.removeItem(this.sessionStorageKey);
    localStorage.removeItem(this.rememberStorageKey);
  }

  isAuthenticated(): boolean {
    return !!this.session?.user?.email;
  }

  getUser(): AuthUser | null {
    return this.session?.user ?? null;
  }

  getTokens(): AuthTokens | null {
    return this.session?.tokens ?? null;
  }

  private loadFromStorage(storageKey: string): SessionPayload | null {
    try {
      const raw = storageKey === this.rememberStorageKey
        ? localStorage.getItem(storageKey)
        : sessionStorage.getItem(storageKey);

      if (!raw) return null;

      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        return null;
      }

      const record = parsed as Record<string, unknown>;
      const user = record['user'];
      if (typeof user !== 'object' || user === null || Array.isArray(user)) {
        return null;
      }

      const userRecord = user as Record<string, unknown>;
      const email = userRecord['email'];
      if (typeof email !== 'string' || !email.trim()) {
        return null;
      }

      return {
        user: {
          ...userRecord,
          email,
        } as AuthUser,
        tokens: (record['tokens'] as AuthTokens | undefined) ?? undefined,
      };
    } catch {
      return null;
    }
  }
}
