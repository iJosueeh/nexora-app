import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Trend {
	category: string;
	title: string;
	conversations: string;
}

export interface SuggestedUser {
	id: string;
	name: string;
	role: string;
	avatar: string;
}

@Component({
	selector: 'app-feed-trends',
	standalone: true,
	imports: [CommonModule],
	template: `
		<aside class="fixed right-0 top-0 flex h-screen w-80 flex-col overflow-y-auto border-l border-[var(--brand-border)] bg-[var(--brand-black)]" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
			<div class="p-6 space-y-8">
				<!-- Trends Section -->
				<div>
					<h2 class="mb-6 text-xs font-bold uppercase tracking-widest text-[var(--brand-muted)]">
						Tendencias Actuales
					</h2>
					<ul class="space-y-6">
						@for (trend of trends(); track trend.title) {
							<li class="cursor-pointer group transition-colors duration-150">
								<div class="text-xs font-medium uppercase tracking-wide text-[var(--brand-muted)] group-hover:text-[#a0a6b0]">
									{{ trend.category }}
								</div>
								<div class="mt-1 text-sm font-bold tracking-tight text-[var(--brand-text)] transition-colors group-hover:text-[var(--brand-red)]">
									{{ trend.title }}
								</div>
								<div class="mt-1 text-xs text-[#b0b3b8]">
									{{ trend.conversations }} conversaciones
								</div>
							</li>
						}
					</ul>
				</div>

				<!-- Suggestions Section -->
				<div>
					<h2 class="mb-6 text-xs font-bold uppercase tracking-widest text-[var(--brand-muted)]">
						Sugerencias para Seguir
					</h2>
					<ul class="space-y-4">
						@for (user of suggestedUsers(); track user.id) {
							<li class="flex items-center justify-between gap-4 rounded-lg bg-[var(--brand-surface)] p-4 transition-colors duration-150 hover:bg-[var(--brand-surface-2)]">
								<div class="flex items-center gap-3 min-w-0 flex-1">
									<img 
										[src]="user.avatar" 
										[alt]="user.name"
										class="h-10 w-10 rounded-full object-cover flex-shrink-0"
									/>
									<div class="min-w-0">
										<div class="truncate text-xs font-bold text-[var(--brand-text)]">
											{{ user.name }}
										</div>
										<div class="truncate text-xs text-[var(--brand-muted)]">
											{{ user.role }}
										</div>
									</div>
								</div>
								<button 
									class="
										px-4 py-1.5 text-xs font-bold uppercase tracking-wide
										border border-[var(--brand-muted)] text-[var(--brand-muted)] rounded-full
										transition-all duration-150
										hover:border-[var(--brand-red)] hover:text-[var(--brand-red)] hover:bg-[color-mix(in_srgb,var(--brand-red)_14%,transparent)]
										flex-shrink-0 whitespace-nowrap
									"
								>
									Seguir
								</button>
							</li>
						}
					</ul>
				</div>
			</div>
		</aside>
	`
})
export class FeedTrends {
	trends = signal<Trend[]>([
		{
			category: 'TENDENCIAS EN CIENCIA',
			title: '#BioEthics2024',
			conversations: '45.2K'
		},
		{
			category: 'RESEARCH',
			title: 'Hackathon ',
			conversations: '28.5K'
		},
		{
			category: 'RESEARCH',
			title: '#SustainableUrbanismo',
			conversations: '19.8K'
		}
	]);

	suggestedUsers = signal<SuggestedUser[]>([
		{
			id: '1',
			name: 'David Ökuñ',
			role: 'Pro Trainer',
			avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
		},
		{
			id: '2',
			name: 'Li Wei',
			role: 'Researcher',
			avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Li'
		},
		{
			id: '3',
			name: 'Sarah López',
			role: 'Community Lead',
			avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
		}
	]);
}
