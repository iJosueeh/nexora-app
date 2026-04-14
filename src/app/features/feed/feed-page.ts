import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeedContainerComponent } from './components/feed-container';
import { FeedSidebar } from './components/feed-sidebar';
import { FeedTrends } from './components/feed-trends';

@Component({
	selector: 'app-feed',
	imports: [FeedContainerComponent, FeedSidebar, FeedTrends],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex w-full min-h-screen bg-[var(--brand-black)]" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
			<!-- Sidebar Navigation (Left) -->
			<app-feed-sidebar />

			<!-- Main Feed (Center) -->
			<main class="ml-64 mr-80 min-h-screen w-full max-w-3xl flex-1 border-x border-[var(--brand-border)]">
				<!-- Feed Header -->
				<div class="sticky top-0 z-40 border-b border-[var(--brand-border)] bg-[color-mix(in_srgb,var(--brand-black)_92%,transparent)] px-6 py-4 backdrop-blur">
					<h1 class="text-base font-bold text-[var(--brand-text)]">Campus Feed</h1>
				</div>

				<app-feed-container />
			</main>

			<!-- Trends Sidebar (Right) -->
			<app-feed-trends />
		</div>
	`,
	styles: [`
		:host {
			display: block;
			width: 100%;
		}
	`]
})
export class FeedPage {}
