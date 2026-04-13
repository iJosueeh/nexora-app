import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-register-email-check-step',
  imports: [],
  templateUrl: './register-email-check-step.html',
  styleUrl: './register-email-check-step.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterEmailCheckStep {
  readonly email = input.required<string>();
  readonly isResending = input(false);

  readonly continueStep = output<void>();
  readonly resendEmail = output<void>();
  readonly editEmail = output<void>();
}
