import { Injectable } from '@angular/core';
import { AuthError, SupabaseClient, createClient } from '@supabase/supabase-js';

import { RuntimeConfigService } from '../config/runtime-config.service';
import { AuthTokens, AuthUser } from '../../interfaces/auth';

export interface SupabaseSignInResult {
  user: AuthUser;
  tokens: AuthTokens;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseAuthService {
  private client: SupabaseClient | null = null;

  constructor(private readonly runtimeConfig: RuntimeConfigService) {}

  async signUpWithEmail(email: string, password: string): Promise<void> {
    const { error } = await this.getClient().auth.signUp({
      email,
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
    const { error } = await this.getClient().auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      throw error;
    }
  }

  async signInWithEmail(email: string, password: string): Promise<SupabaseSignInResult> {
    const { data, error } = await this.getClient().auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (!data.user?.email_confirmed_at) {
      throw new Error('EMAIL_NOT_CONFIRMED');
    }

    return this.buildSessionResult(data.user.id, data.user.email ?? email, data.session);
  }

  async verifySignupOtp(email: string, token: string): Promise<SupabaseSignInResult> {
    const { data, error } = await this.getClient().auth.verifyOtp({
      email,
      token,
      type: 'signup',
    });

    if (error) {
      throw error;
    }

    if (!data.user || !data.session) {
      throw new Error('OTP_VERIFICATION_FAILED');
    }

    return this.buildSessionResult(data.user.id, data.user.email ?? email, data.session);
  }

  isEmailNotConfirmedError(error: unknown): boolean {
    if (!(error instanceof Error)) return false;

    const normalized = error.message.toLowerCase();
    return normalized.includes('email_not_confirmed')
      || normalized.includes('email not confirmed');
  }

  toHumanErrorMessage(error: unknown): string {
    if (this.isEmailNotConfirmedError(error)) {
      return 'Tu correo aun no esta verificado. Revisa tu bandeja y confirma el enlace.';
    }

    if (this.isOtpVerificationError(error)) {
      return 'El código es incorrecto o ya expiró. Solicita uno nuevo.';
    }

    if (this.isAuthError(error)) {
      return error.message;
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'No se pudo completar la operacion con Supabase.';
  }

  private getClient(): SupabaseClient {
    if (this.client) return this.client;

    const { supabaseUrl, supabaseAnonKey } = this.runtimeConfig.value;
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Falta configurar supabaseUrl o supabaseAnonKey en public/config/app-config.json');
    }

    this.client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });

    return this.client;
  }

  private buildSessionResult(
    userId: string,
    email: string,
    session: { access_token: string; refresh_token: string; expires_at?: number | null } | null | undefined
  ): SupabaseSignInResult {
    const expiresAt = session?.expires_at
      ? new Date(session.expires_at * 1000).toISOString()
      : undefined;

    return {
      user: {
        id: userId,
        email,
      },
      tokens: {
        accessToken: session?.access_token,
        refreshToken: session?.refresh_token,
        tokenType: 'Bearer',
        expiresAt,
      },
    };
  }

  private isAuthError(error: unknown): error is AuthError {
    return typeof error === 'object' && error !== null && 'name' in error && 'message' in error;
  }

  private isOtpVerificationError(error: unknown): boolean {
    if (!(error instanceof Error)) return false;

    const normalized = `${error.name} ${error.message}`.toLowerCase();
    return normalized.includes('otp')
      || normalized.includes('invalid token')
      || normalized.includes('token has expired')
      || normalized.includes('expired')
      || normalized.includes('verification failed');
  }
}
