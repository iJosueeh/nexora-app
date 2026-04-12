import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register-preferences-step',
  imports: [ReactiveFormsModule],
  templateUrl: './register-preferences-step.html',
  styleUrl: './register-preferences-step.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPreferencesStep {
  readonly form = input.required<FormGroup>();
  readonly interestOptions = input.required<string[]>();

  get selectedInterestsControl() {
    return this.form().get('selectedInterests');
  }

  get bioControl() {
    return this.form().get('bio');
  }

  get isActiveControl() {
    return this.form().get('isActive');
  }

  get acceptedTermsControl() {
    return this.form().get('acceptedTerms');
  }

  isInvalid(control: AbstractControl | null): boolean {
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  isInterestSelected(interest: string): boolean {
    return (this.selectedInterestsControl?.value ?? []).includes(interest);
  }

  toggleInterest(interest: string): void {
    const control = this.selectedInterestsControl;
    if (!control) return;

    const current = control.value ?? [];
    const nextValue = current.includes(interest)
      ? current.filter((item: string) => item !== interest)
      : [...current, interest];

    control.setValue(nextValue);
    control.markAsTouched();
  }

  toggleIsActive(): void {
    const control = this.isActiveControl;
    if (!control) return;

    control.setValue(!control.value);
    control.markAsTouched();
  }

  toggleAcceptedTerms(): void {
    const control = this.acceptedTermsControl;
    if (!control) return;

    control.setValue(!control.value);
    control.markAsTouched();
  }
}
