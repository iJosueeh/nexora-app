import { ChangeDetectionStrategy, Component, computed, output, signal } from '@angular/core';
import { Post } from '../../../interfaces/feed';

@Component({
	selector: 'app-post-creator',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<section class="mb-4 space-y-3 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4">
			<div class="flex flex-wrap items-center gap-2">
				@for (tab of tabs; track tab) {
					<button
						type="button"
						(click)="activeTab.set(tab)"
						class="rounded-full px-4 py-1.5 text-xs font-semibold transition-colors"
						[class.bg-[var(--brand-red)]]="activeTab() === tab"
						[class.text-white]="activeTab() === tab"
						[class.bg-black/20]="activeTab() !== tab"
						[class.text-[var(--brand-muted)]]="activeTab() !== tab"
					>
						{{ tab }}
					</button>
				}
			</div>

			<div class="flex items-start gap-3 rounded-xl border border-[var(--brand-border)] bg-black/20 p-3">
				<div class="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-red)]/20 text-xs font-bold text-[var(--brand-red)]">
					YO
				</div>
				<div class="flex-1">
					<label class="sr-only" for="post-content">Escribe una publicacion</label>
					<textarea
						id="post-content"
						rows="2"
						[value]="draft()"
						(input)="updateDraft($event)"
						placeholder="Comparte algo con tu comunidad..."
						class="w-full resize-none bg-transparent text-sm text-[var(--brand-text)] placeholder:text-[var(--brand-muted)] outline-none"
					></textarea>
					<div class="mt-2 flex items-center justify-between">
						<p class="text-[11px] uppercase tracking-wide text-[var(--brand-muted)]">
							Vista: {{ activeTab() }}
						</p>
						<button
							type="button"
							(click)="publish()"
							[disabled]="!canPublish()"
							class="rounded-full bg-[var(--brand-red)] px-4 py-2 text-xs font-semibold text-white transition-colors enabled:hover:bg-[#f13a43] disabled:cursor-not-allowed disabled:opacity-40"
						>
							Publicar
						</button>
					</div>
				</div>
			</div>
		</section>
	`
})
export class PostCreatorComponent {
	readonly created = output<Post>();
	readonly tabs = ['Lo ultimo', 'Popular', 'Investigacion', 'Vida en el campus'];
	readonly activeTab = signal(this.tabs[0]);
	readonly draft = signal('');

	readonly canPublish = computed(() => this.draft().trim().length >= 3);

	updateDraft(event: Event): void {
		const value = (event.target as HTMLTextAreaElement).value;
		this.draft.set(value);
	}

	publish(): void {
		const content = this.draft().trim();
		if (content.length < 3) {
			return;
		}

		this.created.emit({
			id: this.createPostId(),
			author: {
				id: 'current-user',
				email: 'usuario@nexora.app',
				username: 'tu.usuario',
				fullName: 'Tu Perfil',
				role: 'Comunidad Nexora',
				verified: false,
				avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NexoraUser'
			},
			is_official: false,
			content,
			createdAt: new Date(),
			likes: 0,
			comments: 0,
			shares: 0,
			tags: []
		});

		this.draft.set('');
	}

	private createPostId(): string {
		if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
			return crypto.randomUUID();
		}

		return `local-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
	}
}
