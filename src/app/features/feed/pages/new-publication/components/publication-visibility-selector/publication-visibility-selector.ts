import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

export type PublicationVisibility = 'public' | 'campus' | 'private';

interface VisibilityOption {
  id: PublicationVisibility;
  label: string;
  description: string;
}

@Component({
  selector: 'app-publication-visibility-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './publication-visibility-selector.html'
})
export class PublicationVisibilitySelectorComponent {
  readonly value = input<PublicationVisibility>('public');
  readonly visibilityChanged = output<PublicationVisibility>();

  readonly isOpen = signal(false);

  readonly options: VisibilityOption[] = [
    {
      id: 'public',
      label: 'Público',
      description: 'Visible para toda la comunidad'
    },
    {
      id: 'campus',
      label: 'Solo campus',
      description: 'Limitado a cuentas académicas'
    },
    {
      id: 'private',
      label: 'Privado',
      description: 'Solo tú puedes verlo'
    }
  ];

  readonly selectedOption = computed(() => {
    return this.options.find((option) => option.id === this.value()) ?? this.options[0];
  });

  toggleMenu(): void {
    this.isOpen.update((current) => !current);
  }

  selectVisibility(value: PublicationVisibility): void {
    this.visibilityChanged.emit(value);
    this.isOpen.set(false);
  }

  closeMenu(): void {
    this.isOpen.set(false);
  }
}
