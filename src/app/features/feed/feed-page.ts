import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCard } from './components/post-card';
import { FeedSidebar } from './components/feed-sidebar';
import { FeedTrends } from './components/feed-trends';
import { FeedService } from './services/feed.service';
import { Post } from '../../interfaces/feed';

@Component({
	selector: 'app-feed',
	standalone: true,
	imports: [CommonModule, PostCard, FeedSidebar, FeedTrends],
	template: `
		<div class="flex w-full bg-[#06080d] min-h-screen" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
			<!-- Sidebar Navigation (Left) -->
			<app-feed-sidebar />

			<!-- Main Feed (Center) -->
			<main class="ml-64 mr-80 flex-1 max-w-3xl w-full border-l border-r border-[#161b25] min-h-screen">
				<!-- Feed Header -->
				<div class="sticky top-0 z-40 border-b border-[#161b25] bg-[#06080d]/95 backdrop-blur px-6 py-4">
					<h1 class="text-base font-bold text-[#f0f2f7]">Todo</h1>
				</div>

				<!-- Posts Stream -->
				<div class="divide-y divide-[#161b25]">
					@if (isLoading()) {
						<div class="flex items-center justify-center py-16">
							<div class="text-center">
								<div class="animate-pulse space-y-4">
									<div class="h-24 w-full bg-[#0d0d0d] rounded"></div>
									<div class="h-24 w-full bg-[#0d0d0d] rounded"></div>
								</div>
							</div>
						</div>
					} @else if (posts().length === 0) {
						<div class="flex items-center justify-center py-16">
							<div class="text-center">
								<p class="text-[#878d99] text-sm">No hay publicaciones disponibles</p>
							</div>
						</div>
					} @else {
						@for (post of posts(); track post.id) {
							<app-post-card [post]="post" />
						}
					}
				</div>
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
export class FeedPage implements OnInit {
	posts = signal<Post[]>([]);
	isLoading = signal(true);

	constructor(private readonly feedService: FeedService) {}

	ngOnInit() {
		this.loadPosts();
	}

	private loadPosts() {
		this.isLoading.set(true);
		this.feedService.getPosts().subscribe({
			next: (posts) => {
				this.posts.set(posts);
				this.isLoading.set(false);
			},
			error: () => {
				this.isLoading.set(false);
			}
		});
	}
}
