import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface DraftItem {
  title: string;
  time: string;
}

@Component({
  selector: 'app-publication-drafts-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './publication-drafts-card.html'
})
export class PublicationDraftsCardComponent {
  readonly drafts = signal<DraftItem[]>([
    {
      title: 'AI Research Notes 2024...',
      time: '2H AGO'
    },
    {
      title: 'Campus Event Feedback...',
      time: '5H AGO'
    }
  ]);
}
