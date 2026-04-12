import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
	selector: 'app-feed-sidebar',
	standalone: true,
	imports: [CommonModule, RouterLink, RouterLinkActive],
	template: `
		<aside class="fixed left-0 top-0 h-screen w-64 border-r border-[#1a1a1a] bg-[#0a0a0a] flex flex-col" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
			<!-- Header/Logo -->
			<div class="border-b border-[#1a1a1a] px-6 py-6">
				<a routerLink="/feed" class="flex items-center gap-3">
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#e63946]"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
					<span class="text-lg font-bold text-[#ffffff] tracking-tight">Nexora</span>
				</a>
			</div>

			<!-- Navigation Menu -->
			<nav class="flex-1 overflow-y-auto px-2 py-4">
				<ul class="space-y-1">
					<li [routerLinkActive]="'active'" #routerLinkActive="routerLinkActive">
						<a
							routerLink="/feed"
							class="
								flex items-center gap-4 px-4 py-3
								rounded-full transition-colors duration-150
								text-[#838383]
								hover:bg-[#1a1a1a] hover:text-[#ffffff]
								relative text-sm font-normal
							"
							[class.bg-[#121212]]="routerLinkActive.isActive"
							[class.text-[#ffffff]]="routerLinkActive.isActive"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
							<span class="flex-1">Inicio</span>
							@if (routerLinkActive.isActive) {
								<div class="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#e63946] rounded-full"></div>
							}
						</a>
					</li>

					<li [routerLinkActive]="'active'" #routerLinkActive1="routerLinkActive">
						<a
							routerLink="/feed/explore"
							class="
								flex items-center gap-4 px-4 py-3
								rounded-full transition-colors duration-150
								text-[#838383]
								hover:bg-[#1a1a1a] hover:text-[#ffffff]
								relative text-sm font-normal
							"
							[class.bg-[#121212]]="routerLinkActive1.isActive"
							[class.text-[#ffffff]]="routerLinkActive1.isActive"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
							<span class="flex-1">Exploración</span>
							@if (routerLinkActive1.isActive) {
								<div class="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#e63946] rounded-full"></div>
							}
						</a>
					</li>

					<li [routerLinkActive]="'active'" #routerLinkActive2="routerLinkActive">
						<a
							routerLink="/feed/notifications"
							class="
								flex items-center gap-4 px-4 py-3
								rounded-full transition-colors duration-150
								text-[#838383]
								hover:bg-[#1a1a1a] hover:text-[#ffffff]
								relative text-sm font-normal
							"
							[class.bg-[#121212]]="routerLinkActive2.isActive"
							[class.text-[#ffffff]]="routerLinkActive2.isActive"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
							<span class="flex-1">Notificación</span>
							@if (notificationBadge() > 0) {
								<span class="inline-flex items-center justify-center min-w-5 h-5 px-1.5 bg-[#e63946] text-white text-xs font-bold rounded-full">
									{{ notificationBadge() }}
								</span>
							}
							@if (routerLinkActive2.isActive) {
								<div class="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#e63946] rounded-full"></div>
							}
						</a>
					</li>

					<li [routerLinkActive]="'active'" #routerLinkActive3="routerLinkActive">
						<a
							routerLink="/feed/profile"
							class="
								flex items-center gap-4 px-4 py-3
								rounded-full transition-colors duration-150
								text-[#838383]
								hover:bg-[#1a1a1a] hover:text-[#ffffff]
								relative text-sm font-normal
							"
							[class.bg-[#121212]]="routerLinkActive3.isActive"
							[class.text-[#ffffff]]="routerLinkActive3.isActive"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
							<span class="flex-1">Perfil</span>
							@if (routerLinkActive3.isActive) {
								<div class="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#e63946] rounded-full"></div>
							}
						</a>
					</li>
				</ul>
			</nav>

			<!-- Postear Button -->
		<div class="border-t border-[#1a1a1a] p-4">
			<button 
				class="
					w-full bg-[#e63946] text-white font-bold py-3
					rounded-full transition-all duration-150
					hover:bg-[#f1454f] active:scale-95
					text-sm font-bold tracking-wide
				"
			>
				Postear
			</button>
		</div>
		</aside>
	`,
	styles: [`
		:host { display: block; }
	`]
})
export class FeedSidebar {
	notificationBadge = signal(5);
}
