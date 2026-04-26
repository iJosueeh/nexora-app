import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-research-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './research-card.html',
  styleUrl: './research-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResearchCard {
  readonly paper = input.required<any>();
}
