import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileData } from '../../MOCKS/profile.mock';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full">
      <!-- Cover Image -->
      <div class="h-48 w-full overflow-hidden rounded-b-2xl md:h-64">
        <img [src]="profile().cover" alt="Cover" class="h-full w-full object-cover" />
      </div>
      
      <!-- Profile Info Section -->
      <div class="px-6 pb-4">
        <div class="relative flex items-end justify-between">
          <!-- Avatar overlapping cover -->
          <div class="-mt-16 h-32 w-32 overflow-hidden rounded-2xl border-4 border-[var(--brand-black)] bg-[var(--brand-surface)] shadow-lg md:h-40 md:w-40">
            <img [src]="profile().avatar" [alt]="profile().name" class="h-full w-full object-cover" />
          </div>
          
          <!-- Action Buttons -->
          <div class="flex items-center gap-3 pb-4">
            @if (isOwnProfile()) {
              <button class="rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] px-6 py-2 text-sm font-bold text-white transition-all hover:bg-[var(--brand-surface-2)] active:scale-95">
                Editar Perfil
              </button>
            } @else {
              <button class="rounded-full bg-[var(--brand-red)] px-6 py-2 text-sm font-bold text-white transition-all hover:bg-[#f13a43] active:scale-95">
                Seguir
              </button>
            }
            
            <!-- Three Dots Menu Container -->
            <div class="relative">
              <button 
                (click)="toggleMenu()"
                class="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-surface)] border border-[var(--brand-border)] text-[var(--brand-muted)] hover:text-white transition-colors"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              @if (isMenuOpen()) {
                <div class="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface-2)] shadow-2xl">
                  <div class="flex flex-col py-1">
                    <button (click)="copyProfileLink()" class="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/5 transition-colors">
                      <svg class="h-4 w-4 text-[var(--brand-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      Compartir Perfil
                    </button>

                    @if (isOwnProfile()) {
                      <button class="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/5 transition-colors text-left">
                        <svg class="h-4 w-4 text-[var(--brand-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                        Código QR
                      </button>
                    } @else {
                      <button class="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/5 transition-colors">
                        <svg class="h-4 w-4 text-[var(--brand-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                        Agregar Amigo
                      </button>
                      <button class="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/5 transition-colors">
                        <svg class="h-4 w-4 text-[var(--brand-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                        Bloquear
                      </button>
                      <button class="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-[var(--brand-red)] hover:bg-white/5 transition-colors">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Reportar
                      </button>
                    }
                  </div>
                </div>
                <!-- Invisible overlay to close menu -->
                <div (click)="isMenuOpen.set(false)" class="fixed inset-0 z-40 bg-transparent"></div>
              }
            </div>
          </div>
        </div>
        
        <!-- Name & Bio -->
        <div class="mt-4">
          <h1 class="text-2xl font-bold text-white md:text-3xl">{{ profile().name }}</h1>
          <p class="text-[var(--brand-muted)]"><span class="text-[var(--brand-red)]">@</span>{{ profile().handle }}</p>
          
          <p class="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--brand-text)]">
            {{ profile().bio }}
          </p>
          
          <div class="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[var(--brand-muted)]">
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              {{ profile().faculty }}
            </div>
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
              {{ profile().career }}
            </div>
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {{ profile().joinDate }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileHeader {
  readonly profile = input.required<ProfileData>();
  readonly isOwnProfile = input(false);
  readonly isMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
  }

  async copyProfileLink(): Promise<void> {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert('¡Enlace de perfil copiado al portapapeles!');
    } catch (err) {
      console.error('Error al copiar el enlace: ', err);
    }
    this.isMenuOpen.set(false);
  }
}
