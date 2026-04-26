import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { STATS_MOCK } from './mocks/stats.mock';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Stats {
  readonly stats = signal(STATS_MOCK);
}
