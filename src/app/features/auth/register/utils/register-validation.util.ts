import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface RegisterValidationSnapshot {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  career: string;
  bio: string;
  acceptedTerms: boolean;
  selectedInterests: string[];
}

const UTP_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@utp\.edu\.pe$/i;

export function isUtpEmail(email: string): boolean {
  return UTP_EMAIL_REGEX.test(email.trim());
}

export function utpEmailValidator(control: AbstractControl): ValidationErrors | null {
  const value = typeof control.value === 'string' ? control.value.trim() : '';
  if (!value) return null;

  return isUtpEmail(value) ? null : { utpEmail: true };
}

export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const passwordControl = control.get('password');
  const confirmPasswordControl = control.get('confirmPassword');
  const password = typeof passwordControl?.value === 'string' ? passwordControl.value : '';
  const confirmPassword = typeof confirmPasswordControl?.value === 'string' ? confirmPasswordControl.value : '';

  if (!password || !confirmPassword) return null;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

export function minSelectedInterestsValidator(minimum = 1): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = Array.isArray(control.value) ? control.value.filter((entry) => typeof entry === 'string') : [];
    return value.length >= minimum ? null : { minSelectedInterests: { required: minimum, actual: value.length } };
  };
}

export function buildFullName(firstName: string, lastName: string): string {
  return `${firstName.trim()} ${lastName.trim()}`.trim();
}

export function buildUsername(firstName: string, lastName: string, email: string): string {
  const normalizedName = [firstName, lastName]
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
    .join('.');

  if (normalizedName) return normalizedName.replace(/[^a-z0-9.]+/g, '.').replace(/\.+/g, '.').replace(/^\.|\.$/g, '');

  const emailPrefix = email.trim().split('@')[0] ?? '';
  return emailPrefix.toLowerCase().replace(/[^a-z0-9.]+/g, '.').replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
}
