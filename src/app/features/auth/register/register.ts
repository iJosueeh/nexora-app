import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, finalize, interval } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Loading } from '../../../shared/components/loading/loading';
import { LOADING_MESSAGES } from '../../../shared/constants/loading-messages';
import { RegisterDraftStorageService } from './services/register-draft-storage.service';
import {
  hasPasswordMismatch,
  isStep1Valid,
  isStep2Valid,
  isStep3Valid,
  isUtpEmail,
  type RegisterValidationSnapshot,
} from './utils/register-validation.util';
import { AutosaveTriggerDirective } from './directives/autosave-trigger.directive';
import { RegisterStepFlowService } from './services/register-step-flow.service';
import { AuthApiService } from '../services/auth-api.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, AutosaveTriggerDirective, Loading],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  readonly stepLabels = ['Cuenta', 'Perfil', 'Preferencias'];
  readonly interests = [
    'IA',
    'Ciberseguridad',
    'Data Science',
    'Cloud',
    'Robótica',
    'Matemática Aplicada',
  ];

  email = '';
  password = '';
  confirmPassword = '';
  username = '';
  fullName = '';
  bio = '';
  selectedInterests: string[] = [];
  isActive = true;
  acceptedTerms = false;

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  currentStep = 1;
  draftExpiresAt = signal(0);
  draftRemainingMs = signal(0);
  readonly hasActiveDraft = computed(() => this.draftRemainingMs() > 0);
  readonly triggerDraftSave = () => this.queueDraftSave();
  readonly draftTimeLeftLabel = computed(() => {
    if (!this.hasActiveDraft()) return '00:00';

    const totalSeconds = Math.floor(this.draftRemainingMs() / 1000);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');

    return `${minutes}:${seconds}`;
  });

  private readonly registerDraftStorage = inject(RegisterDraftStorageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastr = inject(ToastrService);
  private readonly registerStepFlow = inject(RegisterStepFlowService);
  private readonly authApi = inject(AuthApiService);
  private readonly draftSave$ = new Subject<void>();
  readonly loadingMessage = LOADING_MESSAGES.AUTH.REGISTER_CREATING;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.restoreDraft();
    this.startDraftCountdown();

    this.draftSave$
      .pipe(debounceTime(250), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.persistDraft());
  }

  get passwordsDoNotMatch(): boolean {
    return hasPasswordMismatch(this.password, this.confirmPassword);
  }

  get hasTypedEmail(): boolean {
    return this.email.trim().length > 0;
  }

  get isUtpEmailValid(): boolean {
    return isUtpEmail(this.email);
  }

  get step1Valid(): boolean {
    return isStep1Valid(this.validationSnapshot());
  }

  get step2Valid(): boolean {
    return isStep2Valid(this.validationSnapshot());
  }

  get step3Valid(): boolean {
    return isStep3Valid(this.validationSnapshot());
  }

  get isCurrentStepValid(): boolean {
    if (this.currentStep === 1) return this.step1Valid;
    if (this.currentStep === 2) return this.step2Valid;
    return this.step3Valid;
  }

  get isFormValid(): boolean {
    return this.step1Valid && this.step2Valid && this.step3Valid;
  }

  nextStep(): void {
    const nextStep = this.registerStepFlow.nextStep(
      this.currentStep,
      this.stepLabels.length,
      this.isCurrentStepValid
    );

    if (nextStep === this.currentStep) {
      this.showStepValidationToast();
      return;
    }

    this.currentStep = nextStep;
    this.queueDraftSave();
  }

  prevStep(): void {
    const previousStep = this.registerStepFlow.prevStep(this.currentStep);
    if (previousStep === this.currentStep) return;

    this.currentStep = previousStep;
    this.queueDraftSave();
  }

  goToStep(step: number): void {
    const resolvedStep = this.registerStepFlow.resolveStep(
      step,
      this.currentStep,
      this.stepLabels.length,
      this.step1Valid,
      this.step2Valid
    );
    if (resolvedStep === this.currentStep) return;

    this.currentStep = resolvedStep;
    this.queueDraftSave();
  }

  queueDraftSave(): void {
    this.draftSave$.next();
  }

  toggleInterest(interest: string): void {
    if (this.selectedInterests.includes(interest)) {
      this.selectedInterests = this.selectedInterests.filter((i) => i !== interest);
      this.queueDraftSave();
      return;
    }

    this.selectedInterests = [...this.selectedInterests, interest];
    this.queueDraftSave();
  }

  toggleIsActive(): void {
    this.isActive = !this.isActive;
    this.queueDraftSave();
  }

  toggleAcceptedTerms(): void {
    this.acceptedTerms = !this.acceptedTerms;
    this.queueDraftSave();
  }

  onRegister(): void {
    if (!this.isFormValid) return;

    this.isLoading = true;

    this.authApi
      .register({
        email: this.email.trim(),
        password: this.password,
        username: this.username.trim(),
        fullName: this.fullName.trim(),
        bio: this.bio.trim(),
        selectedInterests: this.selectedInterests,
        isActive: this.isActive,
        acceptedTerms: this.acceptedTerms,
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.registerDraftStorage.clear();
          this.draftExpiresAt.set(0);
          this.draftRemainingMs.set(0);
          this.toastr.success('Cuenta creada correctamente.', 'Registro completado');
          this.router.navigate(['/home']);
        },
        error: () => {
          this.toastr.error('No se pudo completar el registro. Intenta nuevamente.', 'Error');
        },
      });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private restoreDraft(): void {
    const draft = this.registerDraftStorage.load();
    if (!draft) return;

    this.email = draft.email;
    this.password = draft.password;
    this.confirmPassword = draft.confirmPassword;
    this.username = draft.username;
    this.fullName = draft.fullName;
    this.bio = draft.bio;
    this.selectedInterests = draft.selectedInterests;
    this.isActive = draft.isActive;
    this.acceptedTerms = draft.acceptedTerms;
    this.draftExpiresAt.set(draft.expiresAt);

    const maxStep = this.stepLabels.length;
    this.currentStep = Math.min(Math.max(draft.currentStep, 1), maxStep);
    this.updateDraftRemainingMs();

    if (this.hasActiveDraft()) {
      this.toastr.info('Se restauró tu borrador de registro.', 'Draft recuperado');
    }
  }

  private persistDraft(): void {
    this.draftExpiresAt.set(this.registerDraftStorage.save({
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      username: this.username,
      fullName: this.fullName,
      bio: this.bio,
      selectedInterests: this.selectedInterests,
      isActive: this.isActive,
      acceptedTerms: this.acceptedTerms,
      currentStep: this.currentStep,
    }));

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

  private showStepValidationToast(): void {
    if (this.currentStep !== 1) return;

    if (this.hasTypedEmail && !this.isUtpEmailValid) {
      this.toastr.error('Solo se permite correo institucional @utp.edu.pe.', 'Correo inválido');
      return;
    }

    this.toastr.error('Completa los campos requeridos para continuar.', 'Faltan datos');
  }

  private validationSnapshot(): RegisterValidationSnapshot {
    return {
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      username: this.username,
      fullName: this.fullName,
      acceptedTerms: this.acceptedTerms,
      selectedInterests: this.selectedInterests,
    };
  }
}
