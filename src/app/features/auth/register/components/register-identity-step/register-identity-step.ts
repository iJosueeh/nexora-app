import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register-identity-step',
  imports: [ReactiveFormsModule],
  templateUrl: './register-identity-step.html',
  styleUrl: './register-identity-step.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterIdentityStep {
  readonly form = input.required<FormGroup>();
  readonly careerOptions = input.required<string[]>();

  get usernameControl() {
    return this.form().get('username');
  }

  get fullNameControl() {
    return this.form().get('fullName');
  }

  get careerControl() {
    return this.form().get('career');
  }

  isInvalid(control: AbstractControl | null): boolean {
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
