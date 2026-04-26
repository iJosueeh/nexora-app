import { ChangeDetectionStrategy, Component, HostListener, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-menu.html',
  styleUrl: './profile-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileMenu {
  readonly isOwnProfile = input<boolean>(false);
  readonly handle = input<string>('');
  readonly signOut = output<void>();
  readonly copyLink = output<void>();

  private readonly router = inject(Router);
  readonly isOpen = signal(false);

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isOpen.update((v) => !v);
  }

  @HostListener('document:click')
  closeMenu(): void {
    this.isOpen.set(false);
  }

  goToSettings(event: MouseEvent): void {
    event.stopPropagation();
    this.isOpen.set(false);
    void this.router.navigate(['/settings']);
  }

  onSignOut(event: MouseEvent): void {
    event.stopPropagation();
    this.isOpen.set(false);
    this.signOut.emit();
  }

  onCopyLink(event: MouseEvent): void {
    event.stopPropagation();
    this.isOpen.set(false);
    this.copyLink.emit();
  }

  goToHome(event: MouseEvent): void {
    event.stopPropagation();
    this.isOpen.set(false);
    void this.router.navigate(['/home']);
  }

  goToExplore(event: MouseEvent): void {
    event.stopPropagation();
    this.isOpen.set(false);
    void this.router.navigate(['/feed/explore']);
  }

  goToNotifications(event: MouseEvent): void {
    event.stopPropagation();
    this.isOpen.set(false);
    void this.router.navigate(['/feed/notifications']);
  }

  isMenuRoute(pathPrefix: string): boolean {
    return this.router.url.startsWith(pathPrefix);
  }
}
