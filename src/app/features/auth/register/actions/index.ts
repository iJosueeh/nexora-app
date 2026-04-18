export { nextStep, onVerificationCodeChange, prevStep, goToStep, isCurrentStepValid, goToLogin } from './register-navigation.actions';
export { submitAccountStep, onVerifyEmailCode, onResendValidationEmail, submitIdentityStep } from './register-auth.actions';
export {
  submitPreferencesStep,
  loadRegistrationCatalogs,
  restoreDraft,
  persistDraft,
  startDraftCountdown,
  queueDraftSave,
  markGroupTouched,
  showStepValidationToast,
} from './register-profile-draft.actions';
