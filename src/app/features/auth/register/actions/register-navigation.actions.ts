export function nextStep(ctx: any): void {
  switch (ctx.currentStep()) {
    case 1:
      if (ctx.showEmailInboxGuide()) {
        if (!/^\d{8}$/.test(ctx.verificationCode())) {
          ctx.emailVerificationError.set('Completa los 8 dígitos antes de verificar.');
          return;
        }

        void ctx.onVerifyEmailCode();
        return;
      }

      void ctx.submitAccountStep();
      return;
    case 2:
      ctx.submitIdentityStep();
      return;
    default:
      ctx.submitPreferencesStep();
  }
}

export function onVerificationCodeChange(ctx: any, value: string): void {
  ctx.verificationCode.set(value);
  if (ctx.emailVerificationError()) {
    ctx.emailVerificationError.set('');
  }
}

export function prevStep(ctx: any): void {
  if (ctx.currentStep() === 1 && ctx.showEmailInboxGuide()) {
    ctx.showEmailInboxGuide.set(false);
    ctx.queueDraftSave();
    return;
  }

  const previousStep = ctx.registerStepFlow.prevStep(ctx.currentStep());
  if (previousStep === ctx.currentStep()) return;

  ctx.currentStep.set(previousStep);
  ctx.queueDraftSave();
}

export function goToStep(ctx: any, step: number): void {
  if (ctx.currentStep() === 1 && ctx.showEmailInboxGuide() && step > 1) {
    return;
  }

  const resolvedStep = ctx.registerStepFlow.resolveStep(
    step,
    ctx.currentStep(),
    ctx.stepLabels.length,
    ctx.accountForm.valid,
    ctx.identityForm.valid
  );

  if (resolvedStep === ctx.currentStep()) return;
  ctx.currentStep.set(resolvedStep);
  ctx.queueDraftSave();
}

export function isCurrentStepValid(ctx: any): boolean {
  switch (ctx.currentStep()) {
    case 1:
      return ctx.showEmailInboxGuide() || ctx.accountForm.valid;
    case 2:
      return ctx.identityForm.valid;
    default:
      return ctx.preferencesForm.valid;
  }
}

export function goToLogin(ctx: any): void {
  ctx.router.navigate(['/login']);
}
