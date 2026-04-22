import { computed, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LOADING_MESSAGES } from '../../../../shared/constants/loading-messages';
import {
  minSelectedInterestsValidator,
  passwordsMatchValidator,
  utpEmailValidator,
} from '../utils/register-validation.util';

export type RegisterStep = 1 | 2 | 3;

export interface RegisterState {
  stepLabels: readonly ['Cuenta', 'Identidad', 'Preferencias'];
  careerOptions: ReturnType<typeof signal<string[]>>;
  interestOptions: ReturnType<typeof signal<string[]>>;
  currentStep: ReturnType<typeof signal<RegisterStep>>;
  isLoading: ReturnType<typeof signal<boolean>>;
  isResendingEmail: ReturnType<typeof signal<boolean>>;
  isVerifyingEmailOtp: ReturnType<typeof signal<boolean>>;
  showEmailInboxGuide: ReturnType<typeof signal<boolean>>;
  emailVerificationError: ReturnType<typeof signal<string>>;
  verificationCode: ReturnType<typeof signal<string>>;
  otpResetNonce: ReturnType<typeof signal<number>>;
  resendCooldownSeconds: ReturnType<typeof signal<number>>;
  form: ReturnType<FormBuilder['group']>;
  draftExpiresAt: ReturnType<typeof signal<number>>;
  draftRemainingMs: ReturnType<typeof signal<number>>;
  loadingMessage: ReturnType<typeof computed<string>>;
  hasActiveDraft: ReturnType<typeof computed<boolean>>;
  draftTimeLeftLabel: ReturnType<typeof computed<string>>;
  primaryActionLabel: ReturnType<typeof computed<string>>;
  backDisabled: ReturnType<typeof computed<boolean>>;
}

export function createRegisterState(fb: FormBuilder): RegisterState {
  const stepLabels = ['Cuenta', 'Identidad', 'Preferencias'] as const;
  const currentStep = signal<RegisterStep>(1);
  const isLoading = signal(false);

  const showEmailInboxGuide = signal(false);
  const isResendingEmail = signal(false);
  const isVerifyingEmailOtp = signal(false);
  const emailVerificationError = signal('');
  const verificationCode = signal('');
  const otpResetNonce = signal(0);
  const resendCooldownSeconds = signal(0);

  const careerOptions = signal([
    'Ingeniería de Sistemas e Informática',
    'Ingeniería de Software',
    'Ingeniería Industrial',
    'Arquitectura',
    'Administración y Negocios Internacionales',
    'Comunicación y Marketing',
  ]);

  const interestOptions = signal([
    'IA',
    'Ciberseguridad',
    'Data Science',
    'Cloud',
    'Robótica',
    'Matemática Aplicada',
  ]);

  const form = fb.group({
    account: fb.group(
      {
        email: fb.nonNullable.control('', {
          validators: [Validators.required, Validators.email, utpEmailValidator],
        }),
        password: fb.nonNullable.control('', {
          validators: [Validators.required, Validators.minLength(8)],
        }),
        confirmPassword: fb.nonNullable.control('', {
          validators: [Validators.required],
        }),
      },
      { validators: [passwordsMatchValidator] }
    ),
    identity: fb.group({
      username: fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9._-]+$/),
      ]),
      fullName: fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
      career: fb.nonNullable.control('', [Validators.required]),
    }),
    preferences: fb.group({
      bio: fb.nonNullable.control('', [Validators.maxLength(280)]),
      selectedInterests: fb.nonNullable.control<string[]>([], {
        validators: [minSelectedInterestsValidator(1)],
      }),
      isActive: fb.nonNullable.control(true),
      acceptedTerms: fb.nonNullable.control(false, [Validators.requiredTrue]),
    }),
  });

  const draftExpiresAt = signal(0);
  const draftRemainingMs = signal(0);

  const loadingMessage = computed(() => {
    switch (currentStep()) {
      case 1:
        return LOADING_MESSAGES.AUTH.REGISTER_STARTING;
      case 2:
        return LOADING_MESSAGES.AUTH.REGISTER_PROFILE;
      default:
        return LOADING_MESSAGES.AUTH.REGISTER_COMPLETING;
    }
  });

  const hasActiveDraft = computed(() => draftRemainingMs() > 0);

  const draftTimeLeftLabel = computed(() => {
    if (!hasActiveDraft()) return '00:00';
    const totalSeconds = Math.floor(draftRemainingMs() / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  });

  const primaryActionLabel = computed(() => {
    switch (currentStep()) {
      case 1:
        return 'Validar correo';
      case 2:
        return 'Guardar identidad';
      default:
        return 'Finalizar registro';
    }
  });

  const backDisabled = computed(() => currentStep() === 1 || isLoading());

  return {
    stepLabels,
    careerOptions,
    interestOptions,
    currentStep,
    isLoading,
    isResendingEmail,
    isVerifyingEmailOtp,
    showEmailInboxGuide,
    emailVerificationError,
    verificationCode,
    otpResetNonce,
    resendCooldownSeconds,
    form,
    draftExpiresAt,
    draftRemainingMs,
    loadingMessage,
    hasActiveDraft,
    draftTimeLeftLabel,
    primaryActionLabel,
    backDisabled,
  };
}
