import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	ElementRef,
	inject,
	signal,
	viewChild
} from '@angular/core';
import { Post } from '../../../interfaces/feed';
import { FeedService } from '../services/feed.service';
import { PostCardComponent } from './post-card';
import { PostCreatorComponent } from './post-creator';

@Component({
	selector: 'app-feed-container',
	imports: [PostCardComponent, PostCreatorComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<section class="space-y-4 px-6 py-4">
			<app-post-creator (created)="prependPost($event)" />

			@if (isInitialLoading()) {
				<div class="space-y-4">
					@for (item of skeletonRows; track item) {
						<article
							class="animate-pulse rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-5"
							aria-hidden="true"
						>
							<div class="mb-4 h-4 w-40 rounded bg-[var(--brand-border)]"></div>
							<div class="mb-2 h-3 w-full rounded bg-[var(--brand-border)]"></div>
							<div class="mb-4 h-3 w-4/5 rounded bg-[var(--brand-border)]"></div>
							<div class="h-52 rounded-2xl bg-[var(--brand-border)]"></div>
						</article>
					}
				</div>
			} @else if (!visiblePosts().length) {
				<div class="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-12 text-center">
					<p class="text-sm text-[var(--brand-muted)] italic">No hay publicaciones disponibles en este momento.</p>
				</div>
			} @else {
				@for (post of visiblePosts(); track post.id) {
					@defer (on viewport) {
						<app-post-card [post]="post" />
					} @placeholder {
						<article class="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-5">
							<div class="h-24 animate-pulse rounded bg-[var(--brand-border)]"></div>
						</article>
					}
				}
			}

			@if (isLoadingMore()) {
				<div class="py-6 text-center">
					<span class="text-xs font-medium text-[var(--brand-muted)] animate-pulse">Cargando más publicaciones...</span>
				</div>
			}

			<div #sentinel class="h-4 w-full" aria-hidden="true"></div>
		</section>
	`
})
export class FeedContainerComponent implements AfterViewInit {
	private readonly feedService = inject(FeedService);
	private readonly destroyRef = inject(DestroyRef);

	readonly sentinel = viewChild<ElementRef<HTMLElement>>('sentinel');
	readonly visiblePosts = signal<Post[]>([]);
	readonly isInitialLoading = signal(true);
	readonly isLoadingMore = signal(false);

	readonly blockSize = 5;
	readonly skeletonRows = [1, 2, 3];

	private offset = 0;
	private reachedEnd = false;

	constructor() {
		this.loadNextBlock();
	}

	ngAfterViewInit(): void {
		if (typeof IntersectionObserver === 'undefined') {
			return;
		}

		const target = this.sentinel()?.nativeElement;
		if (!target) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					this.loadNextBlock();
				}
			},
			{ rootMargin: '280px 0px' }
		);

		observer.observe(target);
		this.destroyRef.onDestroy(() => observer.disconnect());
	}

	private loadNextBlock(): void {
		if (this.isLoadingMore() || this.reachedEnd) {
			return;
		}

		if (this.visiblePosts().length === 0) {
			this.isInitialLoading.set(true);
		} else {
			this.isLoadingMore.set(true);
		}

		this.feedService.getPosts(this.blockSize, this.offset).subscribe({
			next: (posts) => {
				if (posts.length === 0) {
					this.reachedEnd = true;
				}

				this.visiblePosts.update((current) => [...current, ...posts]);
				this.offset += posts.length;
				this.isInitialLoading.set(false);
				this.isLoadingMore.set(false);
			},
			error: () => {
				this.isInitialLoading.set(false);
				this.isLoadingMore.set(false);
			}
		});
	}

	prependPost(post: Post): void {
		this.visiblePosts.update((current) => [post, ...current]);
	}
}
