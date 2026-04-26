import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TESTIMONIALS_MOCK } from './mocks/testimonials.mock';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Testimonials {
  readonly testimonials = signal(TESTIMONIALS_MOCK);
}
