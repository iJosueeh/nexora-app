export interface RegisterValidationSnapshot {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  fullName: string;
  acceptedTerms: boolean;
  selectedInterests: string[];
}

const UTP_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@utp\.edu\.pe$/i;

export function isUtpEmail(email: string): boolean {
  return UTP_EMAIL_REGEX.test(email.trim());
}

export function hasPasswordMismatch(password: string, confirmPassword: string): boolean {
  return confirmPassword.length > 0 && password !== confirmPassword;
}

export function isStep1Valid(snapshot: RegisterValidationSnapshot): boolean {
  return !!(
    snapshot.email.trim() &&
    isUtpEmail(snapshot.email) &&
    snapshot.password.trim() &&
    snapshot.confirmPassword.trim() &&
    !hasPasswordMismatch(snapshot.password, snapshot.confirmPassword)
  );
}

export function isStep2Valid(snapshot: RegisterValidationSnapshot): boolean {
  return !!(snapshot.username.trim() && snapshot.fullName.trim());
}

export function isStep3Valid(snapshot: RegisterValidationSnapshot): boolean {
  return !!(snapshot.acceptedTerms && snapshot.selectedInterests.length > 0);
}
