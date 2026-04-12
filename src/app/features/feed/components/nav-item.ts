import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItemData {
	label: string;
	icon: string;
	route: string;
	badge?: number;
}

@Component({
	selector: 'app-nav-item',
	standalone: true,
	imports: [CommonModule, RouterLink, RouterLinkActive],
	template: `
		<li 
			[routerLinkActive]="'active'"
			#routerLinkActive="routerLinkActive"
			class="group relative"
		>
			<a
				[routerLink]="item.route"
				class="
					flex items-center gap-3 px-4 py-2.5
					rounded-lg transition-all duration-200
					text-[#878d99]
					hover:bg-[#1f2937] hover:text-[#d6dae3]
					active:bg-[#1f2937] active:text-[#f0f2f7]
					relative
				"
				[attr.aria-label]="item.label"
			>
				<!-- Icon -->
				<span class="text-lg flex-shrink-0">
					{{ item.icon }}
				</span>

				<!-- Label -->
				<span class="text-sm font-medium flex-1">
					{{ item.label }}
				</span>

				<!-- Badge -->
				@if (item.badge && item.badge > 0) {
					<span 
						class="
							inline-flex items-center justify-center
							min-w-5 h-5 px-1
							bg-[#df3432] text-white text-xs font-bold
							rounded-full flex-shrink-0
							animate-pulse
						"
					>
						{{ item.badge > 99 ? '99+' : item.badge }}
					</span>
				}

				<!-- Active Indicator (Left Border) -->
				<div 
					class="
						absolute left-0 top-0 bottom-0 w-1
						bg-[#df3432] rounded-r-lg
						transition-all duration-200
						origin-top
						scale-y-0
					"
					[class.scale-y-100]="routerLinkActive.isActive"
				></div>
			</a>
		</li>
	`
})
export class NavItem {
	@Input({ required: true }) item!: NavItemData;
}
