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
import { Post } from '../../../../interfaces/feed';
import { FeedService } from '../../services/feed.service';
import { PostCardComponent } from '../post-card/post-card';
import { PostCreatorComponent } from '../post-creator/post-creator';

@Component({
	selector: 'app-feed-container',
	standalone: true,
	imports: [PostCardComponent, PostCreatorComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './feed-container.html',
	styleUrl: './feed-container.css'
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
