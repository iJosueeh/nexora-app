import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../../interfaces/feed';

@Component({
	selector: 'app-post-card',
	standalone: true,
	imports: [CommonModule],
	template: `
		<article 
			class="bg-[#121212] px-6 py-4 border-b border-[#1a1a1a] transition-colors duration-200 hover:bg-[#1a1a1a]"
			style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;"
		>
			<!-- Header: Avatar + Author Info + Menu -->
			<div class="flex items-start justify-between gap-3 mb-3">
				<div class="flex items-center gap-3 flex-1 min-w-0">
					<!-- Avatar -->
					<img 
						[src]="post.author.avatar" 
						[alt]="post.author.fullName || post.author.username"
						class="h-12 w-12 rounded-full object-cover flex-shrink-0"
					/>
					
					<!-- Author Info -->
					<div class="min-w-0 flex-1">
						<div class="flex items-center gap-1.5">
							<a 
								href="#"
								class="text-sm font-bold text-[#f0f2f7] hover:text-[#d6dae3] transition-colors"
							>
								{{ post.author.fullName || post.author.username }}
							</a>
							@if (post.author.verified) {
								<span class="text-[#df3432] text-xs">✓</span>
							}
						</div>
						<div class="text-xs text-[#999999] font-normal">
							{{ post.author.role }} • {{ formatDate(post.createdAt) }}
						</div>
					</div>
				</div>

				<!-- More Options -->
				<button 
					class="text-[#838383] hover:text-[#ffffff] transition-colors p-1 -mr-2"
					aria-label="Más opciones"
				>
					<span class="text-lg font-light">•••</span>
				</button>
			</div>

			<!-- Content Text -->
			<p class="text-sm text-[#e0e0e0] leading-normal ml-15 mb-3">
				{{ post.content }}
			</p>

			<!-- Tags -->
			@if (post.tags && post.tags.length > 0) {
				<div class="flex flex-wrap gap-2 mb-3 ml-15">
					@for (tag of post.tags; track tag) {
						<a 
							href="#"
							class="text-xs text-[#e63946] hover:text-[#f1454f] transition-colors"
						>
							{{ tag }}
						</a>
					}
				</div>
			}

			<!-- Image Preview -->
			@if (post.imageUrl) {
				<div class="mt-3 ml-15 rounded-xl overflow-hidden mb-3">
					<img 
						[src]="post.imageUrl"
						[alt]="post.content.substring(0, 50)"
						class="w-full object-cover max-h-96 hover:opacity-90 transition-opacity"
					/>
				</div>
			}

			<!-- Interactions Footer -->
			<div class="flex items-center justify-between text-xs text-[#999999] ml-15 -mx-6 px-6 pt-2.5 border-t border-[#1a1a1a]">
				<button 
					(click)="toggleLike()"
					class="
						flex items-center gap-1.5 px-3 py-2
						rounded transition-all duration-150
						hover:text-[#e63946] hover:bg-[#1a1a1a]/30
					"
					[class.text-[#e63946]]="isLiked()"
				>
					<span class="transition-transform duration-150" [class.scale-110]="isLiked()">
						{{ isLiked() ? '❤️' : '🤍' }}
					</span>
					<span class="text-xs font-normal">{{ likeCount() }}</span>
				</button>

				<button 
					class="
						flex items-center gap-1.5 px-3 py-2
						rounded transition-all duration-150
						hover:text-[#ffffff] hover:bg-[#1a1a1a]/30
					"
				>
					<span>💬</span>
					<span class="text-xs font-normal">{{ post.comments }}</span>
				</button>

				<button 
					class="
						flex items-center gap-1.5 px-3 py-2
						rounded transition-all duration-150
						hover:text-[#ffffff] hover:bg-[#1a1a1a]/30
					"
				>
					<span>📤</span>
					<span class="text-xs font-normal">{{ post.shares }}</span>
				</button>

				<button 
					class="
						flex items-center gap-1.5 px-3 py-2 ml-auto
						rounded transition-all duration-150
						hover:text-[#ffffff] hover:bg-[#1a1a1a]/30
					"
				>
					<span>🔖</span>
				</button>
			</div>
		</article>
	`
})
export class PostCard {
	@Input({ required: true }) post!: Post;

	// Signals for reactive state
	private readonly _isLiked = signal(false);
	public readonly isLiked = this._isLiked.asReadonly();

	// Computed signals
	public readonly likeCount = computed(() => {
		return this._isLiked() ? this.post.likes + 1 : this.post.likes;
	});

	constructor() {
		this._isLiked.set(this.post?.isLiked ?? false);
	}

	toggleLike(): void {
		this._isLiked.update(current => !current);
	}

	formatDate(date: Date | string): string {
		const d = typeof date === 'string' ? new Date(date) : date;
		const now = new Date();
		const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

		if (seconds < 60) return 'Hace unos segundos';
		if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)}m`;
		if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)}h`;
		
		return d.toLocaleDateString('es-ES', { 
			month: 'short', 
			day: 'numeric' 
		});
	}
}
