import { Injectable } from '@angular/core';
import { AuthError, SupabaseClient, createClient } from '@supabase/supabase-js';

import { RuntimeConfigService } from '../config/runtime-config.service';
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

  async sendPasswordResetEmail(email: string): Promise<void> {
    const { error } = await this.getClient().auth.resetPasswordForEmail(email, {
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

    return buildSupabaseSessionResult(data.user.id, data.user.email ?? email, data.session);
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

    return buildSupabaseSessionResult(data.user.id, data.user.email ?? email, data.session);
  }

  async verifyRecoveryOtp(email: string, token: string): Promise<SupabaseSignInResult> {
    const { data, error } = await this.getClient().auth.verifyOtp({
      email,
      token,
      type: 'recovery',
    });

    if (error) {
      throw error;
    }

    if (!data.user || !data.session) {
      throw new Error('RECOVERY_OTP_VERIFICATION_FAILED');
    }

    return buildSupabaseSessionResult(data.user.id, data.user.email ?? email, data.session);
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

}
