import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FeedSidebar } from '../feed/components/feed-sidebar';
import { ProfileTopNav } from './components/profile-top-nav/profile-top-nav';
import { ProfileHeader } from './components/profile-header/profile-header';
import { ProfileStatsFocus } from './components/profile-stats/profile-stats-focus';
import { ProfileFeed } from './components/profile-feed/profile-feed';
import { PROFILE_MOCK, PROFILE_POSTS_MOCK } from './MOCKS/profile.mock';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    FeedSidebar,
    ProfileTopNav,
    ProfileHeader,
    ProfileStatsFocus,
    ProfileFeed
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-[var(--brand-black)] text-[var(--brand-text)] relative">
      <!-- DEV TOGGLE: Permite alternar vistas de diseño -->
      <div class="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2">
        <span class="text-[10px] font-bold text-[var(--brand-muted)] uppercase tracking-widest bg-black/40 px-2 py-1 rounded">Vistas de Diseño</span>
        <button 
          (click)="toggleDebugView()"
          class="group flex items-center gap-3 rounded-full bg-[var(--brand-surface)] border border-[var(--brand-border)] p-1 pr-4 transition-all hover:border-[var(--brand-red)] shadow-2xl"
        >
          <div [class]="isOwnProfile() ? 'bg-[var(--brand-red)]' : 'bg-gray-600'" 
               class="h-8 w-8 rounded-full flex items-center justify-center transition-colors">
            <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span class="text-xs font-bold text-white uppercase tracking-tighter">
            {{ isOwnProfile() ? 'VISTA: MI PERFIL' : 'VISTA: OTRO PERFIL' }}
          </span>
        </button>
      </div>

      <!-- Top Navigation -->
      <app-profile-top-nav />

      <div class="flex pt-16">
        <!-- Sidebar -->
        <div class="hidden w-64 md:block">
          <app-feed-sidebar />
        </div>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto border-x border-[var(--brand-border)] md:ml-0">
          <div class="mx-auto max-w-4xl">
            <app-profile-header [profile]="profile()" [isOwnProfile]="isOwnProfile()" />
            <app-profile-stats-focus [profile]="profile()" />
            <app-profile-feed [posts]="posts()" />
          </div>
        </main>

        <!-- Right Gap -->
        <div class="hidden w-20 lg:block"></div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProfilePage {
  readonly profile = signal(PROFILE_MOCK);
  readonly posts = signal(PROFILE_POSTS_MOCK);
  readonly isOwnProfile = signal(true);

  toggleDebugView(): void {
    this.isOwnProfile.update(v => !v);
  }
}
