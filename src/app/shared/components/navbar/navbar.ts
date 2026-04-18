import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthSession } from '../../../core/services/auth-session';

type NavbarMode = 'public' | 'authenticated' | 'feed';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly router = inject(Router);
  private readonly authSession = inject(AuthSession);
  private readonly destroyRef = inject(DestroyRef);

  readonly menuOpen = signal(false);
  readonly currentPath = signal(this.router.url);

  readonly isAuthenticated = computed(() => !!this.authSession.session()?.user?.email);
  readonly isFeedRoute = computed(() => {
    const current = this.currentPath();
    return current.startsWith('/feed') || current.startsWith('/profile') || current.startsWith('/u/');
  });
  readonly profileLink = computed(() => {
    const username = this.authSession.getUser()?.username?.trim();
    return username ? ['/u', username] : ['/profile'];
  });
  readonly mode = computed<NavbarMode>(() => {
    if (this.isFeedRoute() && this.isAuthenticated()) {
      return 'feed';
    }

    if (this.isAuthenticated()) {
      return 'authenticated';
    }

    return 'public';
  });
  readonly displayName = computed(() => {
    const user = this.authSession.getUser();
    return user?.fullName?.trim() || user?.username?.trim() || user?.email?.split('@')[0] || 'Usuario';
  });
  readonly userInitials = computed(() => {
    const name = this.displayName();
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  });

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(event => {
        this.currentPath.set(event.urlAfterRedirects);
      });
  }

  toggleMenu(): void {
    this.menuOpen.update(value => !value);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  signOut(): void {
    this.authSession.clear();
    void this.router.navigateByUrl('/login');
  }

  isCurrent(path: string): boolean {
    return this.currentPath().startsWith(path);
  }
}
