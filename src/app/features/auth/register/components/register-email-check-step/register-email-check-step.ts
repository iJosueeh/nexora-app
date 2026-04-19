import { ChangeDetectionStrategy, Component, ElementRef, QueryList, ViewChildren, computed, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-register-email-check-step',
  imports: [],
  templateUrl: './register-email-check-step.html',
  styleUrl: './register-email-check-step.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterEmailCheckStep {
  readonly email = input.required<string>();
  readonly isVerifying = input(false);
  readonly isResending = input(false);
  readonly resendCooldownSeconds = input(0);
  readonly errorMessage = input('');
  readonly resetNonce = input(0);

  readonly codeChange = output<string>();
  readonly resendEmail = output<void>();
  readonly editEmail = output<void>();

  readonly otpDigits = signal(['', '', '', '', '', '', '', '']);
  private hasInitializedResetEffect = false;

  @ViewChildren('otpInput') private otpInputRefs!: QueryList<ElementRef<HTMLInputElement>>;

  readonly otpCode = computed(() => this.otpDigits().join(''));
  readonly isComplete = computed(() => /^\d{8}$/.test(this.otpCode()));
  readonly isResendDisabled = computed(() => this.isResending() || this.resendCooldownSeconds() > 0);

  constructor() {
    effect(() => {
      const nonce = this.resetNonce();
      if (!this.hasInitializedResetEffect) {
        this.hasInitializedResetEffect = true;
        return;
      }

      nonce;
      this.clearDigits();
      this.focusDigit(0);
    });
  }

  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const digit = input.value.replace(/\D/g, '').slice(0, 1);

    this.updateDigit(index, digit);

    if (digit) {
      this.focusDigit(index + 1);
    }
  }

  onDigitKeydown(event: KeyboardEvent, index: number): void {
    if (event.key !== 'Backspace') {
      return;
    }

    const digits = [...this.otpDigits()];
    if (digits[index]) {
      digits[index] = '';
      this.otpDigits.set(digits);
      this.codeChange.emit(this.otpCode());
      event.preventDefault();
      return;
    }

    this.focusDigit(index - 1);
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const pastedDigits = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 8) ?? '';
    if (!pastedDigits) return;

    const nextDigits = ['', '', '', '', '', '', '', ''];
    Array.from(pastedDigits).forEach((digit, index) => {
      nextDigits[index] = digit;
    });

    this.otpDigits.set(nextDigits);
    this.codeChange.emit(this.otpCode());
    this.focusDigit(Math.min(pastedDigits.length, 5));
  }

  private updateDigit(index: number, value: string): void {
    const digits = [...this.otpDigits()];
    digits[index] = value;
    this.otpDigits.set(digits);
    this.codeChange.emit(this.otpCode());
  }

  private clearDigits(): void {
    this.otpDigits.set(['', '', '', '', '', '', '', '']);
    this.codeChange.emit('');
  }

  private focusDigit(index: number): void {
    const targetIndex = Math.max(0, Math.min(index, 7));
    queueMicrotask(() => this.otpInputRefs?.get(targetIndex)?.nativeElement.focus());
  }
}
