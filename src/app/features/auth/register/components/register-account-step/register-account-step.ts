import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register-account-step',
  imports: [ReactiveFormsModule],
  templateUrl: './register-account-step.html',
  styleUrl: './register-account-step.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterAccountStep {
  readonly form = input.required<FormGroup>();
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);

  get emailControl() {
    return this.form().get('email');
  }

  get passwordControl() {
    return this.form().get('password');
  }

  get confirmPasswordControl() {
    return this.form().get('confirmPassword');
  }

  get passwordMismatch(): boolean {
    return !!this.form().errors?.['passwordMismatch'];
  }

  isInvalid(control: AbstractControl | null): boolean {
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
