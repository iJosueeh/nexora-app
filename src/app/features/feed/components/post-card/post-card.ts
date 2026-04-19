import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Post } from '../../../../interfaces/feed';

@Component({
	selector: 'app-post-card',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block'
	},
	templateUrl: './post-card.html',
	styleUrl: './post-card.css'
})
export class PostCardComponent {
	readonly post = input.required<Post>();

	readonly isOfficial = computed(() => this.post().is_official === true);

	readonly relativeDate = computed(() => {
		const createdAt = this.post().createdAt;
		const createdAtDate = createdAt instanceof Date ? createdAt : new Date(createdAt);
		const ageInMinutes = Math.floor((Date.now() - createdAtDate.getTime()) / 60000);

		if (ageInMinutes < 1) {
			return 'Hace segundos';
		}

		if (ageInMinutes < 60) {
			return `Hace ${ageInMinutes}m`;
		}

		const ageInHours = Math.floor(ageInMinutes / 60);
		if (ageInHours < 24) {
			return `Hace ${ageInHours}h`;
		}

		return createdAtDate.toLocaleDateString('es-ES', {
			month: 'short',
			day: 'numeric'
		});
	});
}
