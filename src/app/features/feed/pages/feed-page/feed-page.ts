import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeedContainerComponent } from '../../components/feed-container/feed-container';
import { FeedSidebar } from '../../components/feed-sidebar/feed-sidebar';
import { FeedTrends } from '../../components/feed-trends/feed-trends';
import { ShellLayout } from '../../../../shared/components/shell-layout/shell-layout';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [FeedContainerComponent, FeedSidebar, FeedTrends, ShellLayout],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './feed-page.html',
  styleUrl: './feed-page.css'
})
export class FeedPage {}
