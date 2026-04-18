import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProfileData } from '../../MOCKS/profile.mock';

@Component({
  selector: 'app-profile-stats-focus',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-6 px-6 md:flex-row">
      <!-- Stats -->
      <div class="flex flex-1 items-center justify-start gap-8 py-4 border-y border-[var(--brand-border)] md:border-none">
        <div class="flex flex-col">
          <span class="text-xl font-bold text-white">{{ profile().stats.followers }}</span>
          <span class="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-muted)]">Seguidores</span>
        </div>
        <div class="flex flex-col">
          <span class="text-xl font-bold text-white">{{ profile().stats.following }}</span>
          <span class="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-muted)]">Seguidos</span>
        </div>
        <div class="flex flex-col">
          <span class="text-xl font-bold text-white">{{ profile().stats.posts }}</span>
          <span class="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-muted)]">Posts</span>
        </div>
      </div>
      
      <!-- Scholarly Focus -->
      <div class="flex-1 rounded-2xl bg-[var(--brand-surface)] p-5 border border-[var(--brand-border)]">
        <h3 class="mb-3 text-[10px] font-bold uppercase tracking-widest text-[var(--brand-muted)]">Scholarly Focus</h3>
        <div class="flex flex-wrap gap-2">
          @for (tag of profile().focus; track tag) {
            <span class="rounded-full bg-[var(--brand-black)] px-3 py-1 text-xs text-[var(--brand-text)] border border-[var(--brand-border)] hover:border-[var(--brand-red)] transition-colors cursor-default">
              {{ tag }}
            </span>
          }
        </div>
      </div>
    </div>
  `
})
export class ProfileStatsFocus {
  readonly profile = input.required<ProfileData>();
}
