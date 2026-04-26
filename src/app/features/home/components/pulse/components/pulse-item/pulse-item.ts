import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pulse-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pulse-item.html',
  styleUrl: './pulse-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PulseItem {
  readonly item = input.required<any>();
}
