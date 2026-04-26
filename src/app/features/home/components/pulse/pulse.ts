import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PulseItem } from './components/pulse-item/pulse-item';
import { PulseEntry } from './interfaces/pulse-entry.model';

import { PULSE_ITEMS_MOCK } from './mocks/pulse.mock';

@Component({
  selector: 'app-pulse-page',
  standalone: true,
  imports: [CommonModule, PulseItem],
  templateUrl: './pulse.html',
  styleUrl: './pulse.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PulsePage {
  readonly pulseItems = signal<PulseEntry[]>(PULSE_ITEMS_MOCK);
}
