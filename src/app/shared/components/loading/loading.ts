import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading implements OnInit, OnDestroy {
  @Output() splashComplete = new EventEmitter<void>();

  progress = 0;
  statusMessage = 'Iniciando sistema...';
  isVisible = true;
  isFadingOut = false;

  private readonly loadingSteps = [
    { progress: 15, message: 'Verificando credenciales académicas...' },
    { progress: 35, message: 'Cargando módulos de aprendizaje...' },
    { progress: 55, message: 'Sincronizando datos del perfil...' },
    {
      progress: 75,
      message: 'Garantizar la seguridad de los protocolos académicos cifrados...',
    },
    { progress: 90, message: 'Preparando entorno personalizado...' },
    { progress: 100, message: 'Listo.' },
  ];

  private timeouts: ReturnType<typeof setTimeout>[] = [];

  private runLoadingSequence(): void {
    let delay = 400;

    this.loadingSteps.forEach((step, index) => {
      const t = setTimeout(() => {
        this.progress = step.progress;
        this.statusMessage = step.message;

        if (step.progress === 100) {
          const fadeTimeout = setTimeout(() => {
            this.isFadingOut = true;
            const removeTimeout = setTimeout(() => {
              this.isVisible = false;
              this.splashComplete.emit();
            }, 600);
            this.timeouts.push(removeTimeout);
          }, 600);
          this.timeouts.push(fadeTimeout);
        }
      }, delay);

      this.timeouts.push(t);
      delay += index < 2 ? 500 : 700;
    });
  }

  ngOnInit(): void {
    this.runLoadingSequence();
  }
  ngOnDestroy(): void {
    this.timeouts.forEach((t) => clearTimeout(t));
  }

}
