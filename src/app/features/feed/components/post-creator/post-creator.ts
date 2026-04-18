import { ChangeDetectionStrategy, Component, computed, output, signal } from '@angular/core';
import { Post } from '../../../../interfaces/feed';

@Component({
	selector: 'app-post-creator',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './post-creator.html'
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
