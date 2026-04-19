import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-publication-guidelines-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './publication-guidelines-card.html'
})
export class PublicationGuidelinesCardComponent {
  readonly guidelines = signal([
    'Ensure all technical publications include relevant DOI links or university repository references for archival purposes.',
    'Keep media assets clear, high-contrast, and under the university integrity policy.',
    'Use descriptive hashtags when the post is research, event or lab related.'
  ]);
}
