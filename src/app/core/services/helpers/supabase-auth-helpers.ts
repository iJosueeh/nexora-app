import { AuthError } from '@supabase/supabase-js';
import { AuthTokens, AuthUser } from '../../../interfaces/auth';

export interface SupabaseSignInResult {
  user: AuthUser;
  tokens: AuthTokens;
}

export function isEmailNotConfirmedError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const normalized = error.message.toLowerCase();
  return normalized.includes('email_not_confirmed')
    || normalized.includes('email not confirmed');
}

export function isResendRateLimitedError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const normalized = `${error.name} ${error.message}`.toLowerCase();
  return normalized.includes('rate limit')
    || normalized.includes('over_email_send_rate_limit')
    || normalized.includes('security purposes')
    || normalized.includes('too many requests');
}

export function isUserAlreadyConfirmedOrRegisteredError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const normalized = `${error.name} ${error.message}`.toLowerCase();
  return normalized.includes('email has already been registered')
    || normalized.includes('already registered')
    || normalized.includes('already confirmed')
    || normalized.includes('user already registered');
}

export function toHumanSupabaseErrorMessage(error: unknown): string {
  if (isEmailNotConfirmedError(error)) {
    return 'Tu correo aun no esta verificado. Revisa tu bandeja y confirma el enlace.';
  }

  if (isInvalidLoginCredentialsError(error)) {
    return 'El correo o la contraseña no coinciden.';
  }

  if (isOtpVerificationError(error)) {
    return 'El código es incorrecto o ya expiró. Solicita uno nuevo.';
  }

  if (isResendRateLimitedError(error)) {
    return 'Espera unos segundos antes de solicitar otro correo.';
  }

  if (isAuthError(error)) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'No se pudo completar la operacion con Supabase.';
}

export function buildSupabaseSessionResult(
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

function isAuthError(error: unknown): error is AuthError {
  return typeof error === 'object' && error !== null && 'name' in error && 'message' in error;
}

function isOtpVerificationError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const normalized = `${error.name} ${error.message}`.toLowerCase();
  return normalized.includes('otp')
    || normalized.includes('invalid token')
    || normalized.includes('token has expired')
    || normalized.includes('expired')
    || normalized.includes('verification failed');
}

function isInvalidLoginCredentialsError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const normalized = `${error.name} ${error.message}`.toLowerCase();
  return normalized.includes('invalid login credentials')
    || normalized.includes('invalid credentials')
    || normalized.includes('invalid_grant');
}
