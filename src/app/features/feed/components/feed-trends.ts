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
		<aside class="fixed right-0 top-0 h-screen w-80 border-l border-[#161b25] bg-[#06080d] overflow-y-auto flex flex-col" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
			<div class="p-6 space-y-8">
				<!-- Trends Section -->
				<div>
					<h2 class="text-xs font-bold uppercase tracking-widest text-[#878d99] mb-6">
						Tendencias Actuales
					</h2>
					<ul class="space-y-6">
						@for (trend of trends(); track trend.title) {
							<li class="cursor-pointer group transition-colors duration-150">
								<div class="text-xs text-[#878d99] font-medium uppercase tracking-wide group-hover:text-[#a0a6b0]">
									{{ trend.category }}
								</div>
								<div class="text-sm font-bold text-[#f0f2f7] group-hover:text-[#df3432] transition-colors mt-1 tracking-tight">
									{{ trend.title }}
								</div>
								<div class="text-xs text-[#b0b3b8] mt-1">
									{{ trend.conversations }} conversaciones
								</div>
							</li>
						}
					</ul>
				</div>

				<!-- Suggestions Section -->
				<div>
					<h2 class="text-xs font-bold uppercase tracking-widest text-[#878d99] mb-6">
						Sugerencias para Seguir
					</h2>
					<ul class="space-y-4">
						@for (user of suggestedUsers(); track user.id) {
							<li class="flex items-center justify-between gap-4 p-4 rounded-lg bg-[#0d0d0d] hover:bg-[#131820] transition-colors duration-150">
								<div class="flex items-center gap-3 min-w-0 flex-1">
									<img 
										[src]="user.avatar" 
										[alt]="user.name"
										class="h-10 w-10 rounded-full object-cover flex-shrink-0"
									/>
									<div class="min-w-0">
										<div class="text-xs font-bold text-[#f0f2f7] truncate">
											{{ user.name }}
										</div>
										<div class="text-xs text-[#878d99] truncate">
											{{ user.role }}
										</div>
									</div>
								</div>
								<button 
									class="
										px-4 py-1.5 text-xs font-bold uppercase tracking-wide
										border border-[#878d99] text-[#878d99] rounded-full
										transition-all duration-150
										hover:border-[#df3432] hover:text-[#df3432] hover:bg-[#df3432]/10
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
