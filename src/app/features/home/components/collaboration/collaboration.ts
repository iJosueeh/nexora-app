import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AVATARS_MOCK, FIGURES_MOCK } from './mocks/collaboration.mock';

@Component({
  selector: 'app-collaboration',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './collaboration.html',
  styleUrl: './collaboration.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Collaboration {
  readonly avatars = signal(AVATARS_MOCK);
  readonly figures = signal(FIGURES_MOCK);
}
