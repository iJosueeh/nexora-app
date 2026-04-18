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
	templateUrl: './nav-item.html'
})
export class NavItem {
	@Input({ required: true }) item!: NavItemData;
}
