import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-profile-top-nav',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="fixed top-0 left-0 right-0 z-50 flex h-16 items-center border-b border-[var(--brand-border)] bg-[var(--brand-black)] px-6">
      <div class="flex w-64 items-center">
        <span class="text-xl font-bold text-white">Nexora<span class="text-[var(--brand-red)]">.</span></span>
      </div>
      
      <div class="flex flex-1 justify-center px-8">
        <div class="relative w-full max-w-2xl">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <svg class="h-4 w-4 text-[var(--brand-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar debates académicos..."
            class="h-10 w-full rounded-full border-none bg-[var(--brand-surface)] pl-11 pr-4 text-sm text-[var(--brand-text)] placeholder-[var(--brand-muted)] transition-all focus:ring-1 focus:ring-[var(--brand-red)]"
          />
        </div>
      </div>
      
      <div class="flex w-64 items-center justify-end gap-5">
        <button class="relative text-[var(--brand-muted)] hover:text-white transition-colors">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span class="absolute top-0 right-0 h-2 w-2 rounded-full bg-[var(--brand-red)] border-2 border-[var(--brand-black)]"></span>
        </button>
        <div class="h-8 w-8 overflow-hidden rounded-full bg-[var(--brand-surface)] border border-[var(--brand-border)]">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Julian" alt="Avatar" class="h-full w-full object-cover" />
        </div>
      </div>
    </header>
  `
})
export class ProfileTopNav {}
