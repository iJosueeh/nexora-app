import { Injectable, inject } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';

import { AuthSession } from './auth-session';
import { environment } from '../../../environments/environment';
import {
  buildSupabaseSessionResult,
  isEmailNotConfirmedError,
  isResendRateLimitedError,
  isUserAlreadyConfirmedOrRegisteredError,
  toHumanSupabaseErrorMessage,
  SupabaseSignInResult,
} from './helpers';

@Injectable({
  providedIn: 'root',
})
export class SupabaseAuthService {
  private client: SupabaseClient | null = null;
  private readonly authSession = inject(AuthSession);
  private readonly router = inject(Router);

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  async signUpWithEmail(email: string, password: string): Promise<void> {
    const normalizedEmail = this.normalizeEmail(email);
    const { error } = await this.getClient().auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      throw error;
    }
  }

  async resendSignupEmail(email: string): Promise<void> {
    const normalizedEmail = this.normalizeEmail(email);
    const { error } = await this.getClient().auth.resend({
      type: 'signup',
      email: normalizedEmail,
    });

    if (error) {
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const normalizedEmail = this.normalizeEmail(email);
    const { error } = await this.getClient().auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw error;
    }
  }

  async hasActiveSession(): Promise<boolean> {
    const { data, error } = await this.getClient().auth.getSession();
    if (error) {
      throw error;
    }

    return !!data.session;
  }

  async getCurrentTokens(): Promise<SupabaseSignInResult['tokens'] | null> {
    const { data, error } = await this.getClient().auth.getSession();

    if (error || !data.session) {
      return null;
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      tokenType: 'Bearer',
      expiresAt: data.session.expires_at ? new Date(data.session.expires_at * 1000).toISOString() : undefined,
    };
  }

  async getValidTokens(): Promise<SupabaseSignInResult['tokens'] | null> {
    const { data, error } = await this.getClient().auth.getSession();

    if (error || !data.session) {
      return null;
    }

    const session = data.session;
    const expiresAt = session.expires_at ? session.expires_at * 1000 : undefined;
    const isExpired = typeof expiresAt === 'number' ? Date.now() >= expiresAt - 30_000 : false;

    if (!isExpired) {
      return {
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        tokenType: 'Bearer',
        expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : undefined,
      };
    }

    const refreshed = await this.getClient().auth.refreshSession();
    if (refreshed.error || !refreshed.data.session) {
      await this.expireSessionAndRedirect();
      return null;
    }

    const refreshedSession = refreshed.data.session;
    const tokens = {
      accessToken: refreshedSession.access_token,
      refreshToken: refreshedSession.refresh_token,
      tokenType: 'Bearer',
      expiresAt: refreshedSession.expires_at ? new Date(refreshedSession.expires_at * 1000).toISOString() : undefined,
    };

    this.authSession.start(
      {
        user: this.authSession.getUser() ?? {
          id: refreshed.data.user?.id,
          email: refreshed.data.user?.email ?? '',
        },
        tokens,
      },
    );

    return tokens;
  }

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await this.getClient().auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }
  }

  async signOut(): Promise<void> {
    const { error } = await this.getClient().auth.signOut();
    if (error) {
      throw error;
    }
  }

  async expireSessionAndRedirect(): Promise<void> {
    this.authSession.clear();
    await this.getClient().auth.signOut().catch(() => undefined);

    if (this.router.url !== '/login') {
      await this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }

  async signInWithEmail(email: string, password: string): Promise<SupabaseSignInResult> {
    const normalizedEmail = this.normalizeEmail(email);
    const { data, error } = await this.getClient().auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      throw error;
    }

    if (!data.user?.email_confirmed_at) {
      throw new Error('EMAIL_NOT_CONFIRMED');
    }

    return buildSupabaseSessionResult(data.user.id, data.user.email ?? normalizedEmail, data.session);
  }

  async verifySignupOtp(email: string, token: string): Promise<SupabaseSignInResult> {
    const normalizedEmail = this.normalizeEmail(email);
    const { data, error } = await this.getClient().auth.verifyOtp({
      email: normalizedEmail,
      token,
      type: 'signup',
    });

    if (error) {
      throw error;
    }

    if (!data.user || !data.session) {
      throw new Error('OTP_VERIFICATION_FAILED');
    }

    return buildSupabaseSessionResult(data.user.id, data.user.email ?? normalizedEmail, data.session);
  }

  async verifyRecoveryOtp(email: string, token: string): Promise<SupabaseSignInResult> {
    const normalizedEmail = this.normalizeEmail(email);
    const { data, error } = await this.getClient().auth.verifyOtp({
      email: normalizedEmail,
      token,
      type: 'recovery',
    });

    if (error) {
      throw error;
    }

    if (!data.user || !data.session) {
      throw new Error('RECOVERY_OTP_VERIFICATION_FAILED');
    }

    return buildSupabaseSessionResult(data.user.id, data.user.email ?? normalizedEmail, data.session);
  }

  isEmailNotConfirmedError(error: unknown): boolean {
    return isEmailNotConfirmedError(error);
  }

  isResendRateLimitedError(error: unknown): boolean {
    return isResendRateLimitedError(error);
  }

  isUserAlreadyConfirmedOrRegisteredError(error: unknown): boolean {
    return isUserAlreadyConfirmedOrRegisteredError(error);
  }

  toHumanErrorMessage(error: unknown): string {
    return toHumanSupabaseErrorMessage(error);
  }

  public getClient(): SupabaseClient {
    if (this.client) return this.client;

    const { supabaseUrl, supabaseAnonKey } = environment;
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Falta configurar Supabase en src/environments/environment.generated.ts (o environment.generated.prod.ts). Ejecuta "npm run sync:environment" y valida SUPABASE_URL/SUPABASE_ANON_KEY en .env.');
    }

    // Inicializar una sola vez
    this.client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: `sb-${supabaseUrl.split('.')[0].split('//')[1]}-auth-token`
      },
    });

    return this.client;
  }

}
