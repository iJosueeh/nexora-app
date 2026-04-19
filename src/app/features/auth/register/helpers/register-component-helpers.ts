import { buildFullName, buildUsername } from '../utils/register-validation.util';

export function buildIdentityPayload(ctx: any): any {
  return {
    email: ctx.accountForm.controls.email.value.trim(),
    username: buildUsername(
      ctx.identityForm.controls.firstName.value,
      ctx.identityForm.controls.lastName.value,
      ctx.accountForm.controls.email.value
    ),
    fullName: buildFullName(
      ctx.identityForm.controls.firstName.value,
      ctx.identityForm.controls.lastName.value
    ),
    career: ctx.identityForm.controls.career.value,
  };
}

export function buildPreferencesPayload(ctx: any): any {
  return {
    email: ctx.accountForm.controls.email.value.trim(),
    bio: ctx.preferencesForm.controls.bio.value.trim(),
    academicInterests: [...ctx.preferencesForm.controls.selectedInterests.value],
    isActive: ctx.preferencesForm.controls.isActive.value,
    acceptedTerms: ctx.preferencesForm.controls.acceptedTerms.value,
  };
}

export function buildFallbackUser(ctx: any): { email: string; fullName: string; username: string } {
  return {
    email: ctx.accountForm.controls.email.value.trim(),
    fullName: buildFullName(ctx.identityForm.controls.firstName.value, ctx.identityForm.controls.lastName.value),
    username: buildUsername(
      ctx.identityForm.controls.firstName.value,
      ctx.identityForm.controls.lastName.value,
      ctx.accountForm.controls.email.value
    ),
  };
}

export function patchDraftToForm(ctx: any, draft: any): void {
  ctx.form.patchValue(
    {
      account: { email: draft.email, password: draft.password, confirmPassword: draft.confirmPassword },
      identity: { firstName: draft.firstName, lastName: draft.lastName, career: draft.career },
      preferences: {
        bio: draft.bio,
        selectedInterests: draft.selectedInterests,
        isActive: draft.isActive,
        acceptedTerms: draft.acceptedTerms,
      },
    },
    { emitEvent: false }
  );
}

export function buildDraftPayload(ctx: any, raw: any): any {
  return {
    email: raw.account.email,
    password: raw.account.password,
    confirmPassword: raw.account.confirmPassword,
    isEmailGuideVisible: ctx.showEmailInboxGuide(),
    firstName: raw.identity.firstName,
    lastName: raw.identity.lastName,
    career: raw.identity.career,
    bio: raw.preferences.bio,
    selectedInterests: raw.preferences.selectedInterests,
    isActive: raw.preferences.isActive,
    acceptedTerms: raw.preferences.acceptedTerms,
    currentStep: ctx.currentStep(),
  };
}

export function resetFormWithDefaults(ctx: any): void {
  ctx.form.reset(
    {
      account: { email: '', password: '', confirmPassword: '' },
      identity: { firstName: '', lastName: '', career: '' },
      preferences: { bio: '', selectedInterests: [], isActive: true, acceptedTerms: false },
    },
    { emitEvent: false }
  );

  ctx.form.markAsPristine();
  ctx.form.markAsUntouched();
}
