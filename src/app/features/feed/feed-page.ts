import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeedContainerComponent } from './components/feed-container';
import { FeedSidebar } from './components/feed-sidebar';
import { FeedTrends } from './components/feed-trends';

@Component({
	selector: 'app-feed',
	imports: [FeedContainerComponent, FeedSidebar, FeedTrends],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex min-h-screen w-full bg-[var(--brand-black)]" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
			<!-- Sidebar Navigation (Left) - Fixed 64 (256px) -->
			<app-feed-sidebar />

			<!-- Main Feed (Center) -->
			<!-- We use ml-64 to clear the left sidebar and mr-80 to clear the right trends sidebar -->
			<main class="ml-64 mr-80 flex-1 min-h-screen border-x border-[var(--brand-border)]">
				<div class="mx-auto max-w-4xl">
					<!-- Feed Header -->
					<div class="sticky top-0 z-40 border-b border-[var(--brand-border)] bg-[color-mix(in_srgb,var(--brand-black)_92%,transparent)] px-6 py-4 backdrop-blur">
						<h1 class="text-base font-bold text-[var(--brand-text)]">Campus Feed</h1>
					</div>

					<app-feed-container />
				</div>
			</main>

			<!-- Trends Sidebar (Right) - Fixed 80 (320px) -->
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
