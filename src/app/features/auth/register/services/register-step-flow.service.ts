import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RegisterStepFlowService {
  nextStep(currentStep: number, maxSteps: number, isCurrentStepValid: boolean): number {
    if (!isCurrentStepValid || currentStep >= maxSteps) return currentStep;
    return currentStep + 1;
  }

  prevStep(currentStep: number): number {
    if (currentStep <= 1) return currentStep;
    return currentStep - 1;
  }

  resolveStep(
    targetStep: number,
    currentStep: number,
    maxSteps: number,
    step1Valid: boolean,
    step2Valid: boolean
  ): number {
    if (targetStep < 1 || targetStep > maxSteps) return currentStep;
    if (targetStep <= currentStep) return targetStep;
    if (targetStep === 2 && step1Valid) return targetStep;
    if (targetStep === 3 && step1Valid && step2Valid) return targetStep;

    return currentStep;
  }
}
