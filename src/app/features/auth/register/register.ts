import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, finalize, interval } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { AuthSession } from '../../../core/services/auth-session';
import { RegisterIdentityRequest, RegisterPreferencesRequest, RegisterStartRequest } from '../../../interfaces/auth';
import { Loading } from '../../../shared/components/loading/loading';
import { LOADING_MESSAGES } from '../../../shared/constants/loading-messages';
import { AuthApiService } from '../services/auth-api.service';
import { RegisterAccountStep } from './components/register-account-step/register-account-step';
import { RegisterIdentityStep } from './components/register-identity-step/register-identity-step';
import { RegisterPreferencesStep } from './components/register-preferences-step/register-preferences-step';
import { RegisterDraftStorageService } from './services/register-draft-storage.service';
import { RegisterStepFlowService } from './services/register-step-flow.service';
import {
  buildFullName,
  buildUsername,
  minSelectedInterestsValidator,
  passwordsMatchValidator,
  utpEmailValidator,
} from './utils/register-validation.util';

type RegisterStep = 1 | 2 | 3;

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, Loading, RegisterAccountStep, RegisterIdentityStep, RegisterPreferencesStep],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly authApi = inject(AuthApiService);
  private readonly authSession = inject(AuthSession);
  private readonly registerDraftStorage = inject(RegisterDraftStorageService);
  private readonly registerStepFlow = inject(RegisterStepFlowService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly draftSave$ = new Subject<void>();

  readonly stepLabels = ['Cuenta', 'Identidad', 'Preferencias'] as const;
  readonly careerOptions = signal([
    'Ingeniería de Sistemas e Informática',
    'Ingeniería de Software',
    'Ingeniería Industrial',
    'Arquitectura',
    'Administración y Negocios Internacionales',
    'Comunicación y Marketing',
  ]);
  readonly interestOptions = signal([
    'IA',
    'Ciberseguridad',
    'Data Science',
    'Cloud',
    'Robótica',
    'Matemática Aplicada',
  ]);

  readonly currentStep = signal<RegisterStep>(1);
  readonly isLoading = signal(false);
  readonly loadingMessage = computed(() => {
    switch (this.currentStep()) {
      case 1:
        return LOADING_MESSAGES.AUTH.REGISTER_STARTING;
      case 2:
        return LOADING_MESSAGES.AUTH.REGISTER_PROFILE;
      default:
        return LOADING_MESSAGES.AUTH.REGISTER_COMPLETING;
    }
  });

  readonly form = this.fb.group({
    account: this.fb.group(
      {
        email: this.fb.nonNullable.control('', {
          validators: [Validators.required, Validators.email, utpEmailValidator],
        }),
        password: this.fb.nonNullable.control('', {
          validators: [Validators.required, Validators.minLength(8)],
        }),
        confirmPassword: this.fb.nonNullable.control('', {
          validators: [Validators.required],
        }),
      },
      { validators: [passwordsMatchValidator] }
    ),
    identity: this.fb.group({
      firstName: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
      lastName: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
      career: this.fb.nonNullable.control('', [Validators.required]),
    }),
    preferences: this.fb.group({
      bio: this.fb.nonNullable.control('', [Validators.maxLength(280)]),
      selectedInterests: this.fb.nonNullable.control<string[]>([], {
        validators: [minSelectedInterestsValidator(1)],
      }),
      isActive: this.fb.nonNullable.control(true),
      acceptedTerms: this.fb.nonNullable.control(false, [Validators.requiredTrue]),
    }),
  });

  readonly accountForm = this.form.controls.account;
  readonly identityForm = this.form.controls.identity;
  readonly preferencesForm = this.form.controls.preferences;

  readonly draftExpiresAt = signal(0);
  readonly draftRemainingMs = signal(0);
  readonly hasActiveDraft = computed(() => this.draftRemainingMs() > 0);
  readonly draftTimeLeftLabel = computed(() => {
    if (!this.hasActiveDraft()) return '00:00';

    const totalSeconds = Math.floor(this.draftRemainingMs() / 1000);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');

    return `${minutes}:${seconds}`;
  });

  readonly primaryActionLabel = computed(() => {
    switch (this.currentStep()) {
      case 1:
        return 'Validar correo';
      case 2:
        return 'Guardar identidad';
      default:
        return 'Finalizar registro';
    }
  });

  readonly backDisabled = computed(() => this.currentStep() === 1 || this.isLoading());

  ngOnInit(): void {
    this.restoreDraft();
    this.startDraftCountdown();

    this.form.valueChanges
      .pipe(debounceTime(250), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.persistDraft());

    this.draftSave$
      .pipe(debounceTime(250), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.persistDraft());
  }

  nextStep(): void {
    switch (this.currentStep()) {
      case 1:
        this.submitAccountStep();
        return;
      case 2:
        this.submitIdentityStep();
        return;
      default:
        this.submitPreferencesStep();
    }
  }

  prevStep(): void {
    const previousStep = this.registerStepFlow.prevStep(this.currentStep());
    if (previousStep === this.currentStep()) return;

    this.currentStep.set(previousStep as RegisterStep);
    this.queueDraftSave();
  }

  goToStep(step: number): void {
    const resolvedStep = this.registerStepFlow.resolveStep(
      step,
      this.currentStep(),
      this.stepLabels.length,
      this.accountForm.valid,
      this.identityForm.valid
    );

    if (resolvedStep === this.currentStep()) return;

    this.currentStep.set(resolvedStep as RegisterStep);
    this.queueDraftSave();
  }

  isCurrentStepValid(): boolean {
    switch (this.currentStep()) {
      case 1:
        return this.accountForm.valid;
      case 2:
        return this.identityForm.valid;
      default:
        return this.preferencesForm.valid;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private submitAccountStep(): void {
    if (this.accountForm.invalid) {
      this.markGroupTouched(this.accountForm);
      this.showStepValidationToast();
      return;
    }

    const payload: RegisterStartRequest = {
      email: this.accountForm.controls.email.value.trim(),
      password: this.accountForm.controls.password.value,
    };

    this.isLoading.set(true);
    this.authApi
      .startRegistration(payload)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.currentStep.set(2);
          this.queueDraftSave();
          this.toastr.success('Validamos tu correo institucional. Continúa con tu identidad.', 'Paso 1 completado');
        },
        error: () => {
          this.toastr.error('No se pudo validar el correo. Intenta nuevamente.', 'Registro detenido');
        },
      });
  }

  private submitIdentityStep(): void {
    if (this.identityForm.invalid) {
      this.markGroupTouched(this.identityForm);
      this.showStepValidationToast();
      return;
    }

    const payload: RegisterIdentityRequest = {
      email: this.accountForm.controls.email.value.trim(),
      firstName: this.identityForm.controls.firstName.value.trim(),
      lastName: this.identityForm.controls.lastName.value.trim(),
      career: this.identityForm.controls.career.value,
    };

    this.isLoading.set(true);
    this.authApi
      .completeRegistrationIdentity(payload)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.currentStep.set(3);
          this.queueDraftSave();
          this.toastr.success('Tu identidad académica fue guardada.', 'Paso 2 completado');
        },
        error: () => {
          this.toastr.error('No se pudo guardar tu identidad. Intenta nuevamente.', 'Error');
        },
      });
  }

  private submitPreferencesStep(): void {
    if (this.preferencesForm.invalid) {
      this.markGroupTouched(this.preferencesForm);
      this.showStepValidationToast();
      return;
    }

    const payload: RegisterPreferencesRequest = {
      email: this.accountForm.controls.email.value.trim(),
      bio: this.preferencesForm.controls.bio.value.trim(),
      selectedInterests: [...this.preferencesForm.controls.selectedInterests.value],
      isActive: this.preferencesForm.controls.isActive.value,
      acceptedTerms: this.preferencesForm.controls.acceptedTerms.value,
    };

    const fullName = buildFullName(
      this.identityForm.controls.firstName.value,
      this.identityForm.controls.lastName.value
    );
    const username = buildUsername(
      this.identityForm.controls.firstName.value,
      this.identityForm.controls.lastName.value,
      this.accountForm.controls.email.value
    );

    this.isLoading.set(true);
    this.authApi
      .completeRegistrationPreferences(payload)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          const email = this.accountForm.controls.email.value.trim();
          const user = response.user ?? { email, fullName, username };

          this.authSession.start(
            {
              user,
              tokens: response.tokens,
            },
            false
          );

          this.registerDraftStorage.clear();
          this.draftExpiresAt.set(0);
          this.draftRemainingMs.set(0);
          this.resetFormState();
          this.toastr.success('Tu perfil académico quedó listo.', 'Registro completado');
          this.router.navigate(['/home']);
        },
        error: () => {
          this.toastr.error('No se pudo completar el perfil. Intenta nuevamente.', 'Error');
        },
      });
  }

  private restoreDraft(): void {
    const draft = this.registerDraftStorage.load();
    if (!draft) return;

    this.form.patchValue(
      {
        account: {
          email: draft.email,
          password: draft.password,
          confirmPassword: draft.confirmPassword,
        },
        identity: {
          firstName: draft.firstName,
          lastName: draft.lastName,
          career: draft.career,
        },
        preferences: {
          bio: draft.bio,
          selectedInterests: draft.selectedInterests,
          isActive: draft.isActive,
          acceptedTerms: draft.acceptedTerms,
        },
      },
      { emitEvent: false }
    );

    const maxStep = this.stepLabels.length;
    this.currentStep.set(Math.min(Math.max(draft.currentStep, 1), maxStep) as RegisterStep);
    this.draftExpiresAt.set(draft.expiresAt);
    this.updateDraftRemainingMs();

    if (this.hasActiveDraft()) {
      this.toastr.info('Se restauró tu borrador de registro.', 'Draft recuperado');
    }
  }

  private persistDraft(): void {
    const raw = this.form.getRawValue();
    this.draftExpiresAt.set(
      this.registerDraftStorage.save({
        email: raw.account.email,
        password: raw.account.password,
        confirmPassword: raw.account.confirmPassword,
        firstName: raw.identity.firstName,
        lastName: raw.identity.lastName,
        career: raw.identity.career,
        bio: raw.preferences.bio,
        selectedInterests: raw.preferences.selectedInterests,
        isActive: raw.preferences.isActive,
        acceptedTerms: raw.preferences.acceptedTerms,
        currentStep: this.currentStep(),
      })
    );

    this.updateDraftRemainingMs();
  }

  private startDraftCountdown(): void {
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.handleDraftTick());
  }

  private handleDraftTick(): void {
    if (!this.draftExpiresAt()) return;

    this.updateDraftRemainingMs();
    if (this.draftRemainingMs() > 0) return;

    this.registerDraftStorage.clear();
    this.draftExpiresAt.set(0);
    this.toastr.warning('El borrador del registro expiró tras 30 minutos.', 'Draft expirado');
  }

  private updateDraftRemainingMs(): void {
    this.draftRemainingMs.set(Math.max(this.draftExpiresAt() - Date.now(), 0));
  }

  private queueDraftSave(): void {
    this.draftSave$.next();
  }

  private resetFormState(): void {
    this.form.reset(
      {
        account: {
          email: '',
          password: '',
          confirmPassword: '',
        },
        identity: {
          firstName: '',
          lastName: '',
          career: '',
        },
        preferences: {
          bio: '',
          selectedInterests: [],
          isActive: true,
          acceptedTerms: false,
        },
      },
      { emitEvent: false }
    );

    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.currentStep.set(1);
  }

  private markGroupTouched(group: AbstractControl): void {
    group.markAllAsTouched();
  }

  private showStepValidationToast(): void {
    switch (this.currentStep()) {
      case 1:
        if (this.isControlInvalid(this.accountForm.controls.email)) {
          this.toastr.error('Usa un correo institucional válido con dominio @utp.edu.pe.', 'Correo inválido');
          return;
        }

        if (this.accountForm.errors?.['passwordMismatch']) {
          this.toastr.error('Las contraseñas no coinciden.', 'Contraseña inválida');
          return;
        }

        this.toastr.error('Completa el correo y la contraseña para continuar.', 'Faltan datos');
        return;
      case 2:
        this.toastr.error('Completa nombre, apellido y carrera para seguir.', 'Faltan datos');
        return;
      default:
        this.toastr.error('Selecciona tus intereses y acepta los términos para finalizar.', 'Faltan datos');
    }
  }

  private isControlInvalid(control: AbstractControl | null): boolean {
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
