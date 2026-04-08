import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading implements OnInit, OnDestroy {
  @Output() splashComplete = new EventEmitter<void>();

  @Input() mode: 'splash' | 'spinner' = 'splash';
  @Input() message = 'Cargando...';
  @Input() fullscreen = true;

  progress = 0;
  statusMessage = 'Inicializando núcleo editorial...';
  isVisible = true;
  isFadingOut = false;

  private readonly loadingSteps = [
    { progress: 14, message: 'Verificando credenciales académicas...', delay: 360, duration: 480 },
    { progress: 33, message: 'Cargando capas de colaboración...', delay: 520, duration: 560 },
    { progress: 52, message: 'Sincronizando canales de investigación...', delay: 620, duration: 620 },
    {
      progress: 72,
      message: 'Garantizar la seguridad de los protocolos académicos cifrados...',
      delay: 760,
      duration: 760,
    },
    { progress: 89, message: 'Preparando entorno...', delay: 600, duration: 620 },
    { progress: 100, message: 'Listo.', delay: 480, duration: 440 },
  ];

  private timeouts: ReturnType<typeof setTimeout>[] = [];
  private intervals: ReturnType<typeof setInterval>[] = [];
  private readonly MIN_DISPLAY_DURATION = 400; // Minimum ms to display spinner to prevent flicker
  private spinnerStartedAt = 0;

  private animateProgress(target: number, duration: number): void {
    const start = this.progress;
    const startedAt = Date.now();

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);

      this.progress = Number((start + (target - start) * eased).toFixed(1));

      if (t >= 1) {
        this.progress = target;
        clearInterval(intervalId);
      }
    }, 16);

    this.intervals.push(intervalId);
  }

  private runLoadingSequence(): void {
    let accumulatedDelay = 220;

    this.loadingSteps.forEach((step) => {
      const t = setTimeout(() => {
        this.statusMessage = step.message;
        this.animateProgress(step.progress, step.duration);

        if (step.progress === 100) {
          const fadeTimeout = setTimeout(() => {
            this.isFadingOut = true;
            const removeTimeout = setTimeout(() => {
              this.isVisible = false;
              this.splashComplete.emit();
            }, 600);
            this.timeouts.push(removeTimeout);
          }, 520);
          this.timeouts.push(fadeTimeout);
        }
      }, accumulatedDelay);

      this.timeouts.push(t);
      accumulatedDelay += step.delay;
    });
  }

  ngOnInit(): void {
    if (this.mode === 'spinner') {
      this.spinnerStartedAt = Date.now();
      this.isVisible = true;
      return;
    }

    this.runLoadingSequence();
  }

  ngOnDestroy(): void {
    // For spinner mode, ensure minimum display time of 400ms to prevent flicker
    if (this.mode === 'spinner' && this.spinnerStartedAt > 0) {
      const elapsed = Date.now() - this.spinnerStartedAt;
      const remainingDelay = this.MIN_DISPLAY_DURATION - elapsed;
      if (remainingDelay > 0) {
        setTimeout(() => {
          this.cleanup();
        }, remainingDelay);
        return;
      }
    }
    this.cleanup();
  }

  private cleanup(): void {
    this.timeouts.forEach((t) => clearTimeout(t));
    this.intervals.forEach((i) => clearInterval(i));
  }
}
