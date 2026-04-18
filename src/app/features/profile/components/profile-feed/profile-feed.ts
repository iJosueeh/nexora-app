import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { ProfilePost } from '../../MOCKS/profile.mock';

@Component({
  selector: 'app-profile-feed',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mt-8 px-6 pb-12">
      <!-- Tabs -->
      <div class="mb-8 flex gap-8 border-b border-[var(--brand-border)]">
        @for (tab of tabs; track tab) {
          <button
            (click)="activeTab.set(tab)"
            [class]="activeTab() === tab ? 'border-[var(--brand-red)] text-white' : 'border-transparent text-[var(--brand-muted)]'"
            class="pb-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 hover:text-white"
          >
            {{ tab }}
          </button>
        }
      </div>
      
      <!-- Masonry-style Grid (using columns for simple responsive masonry) -->
      <div class="columns-1 gap-4 space-y-4 md:columns-2">
        @for (post of posts(); track post.id) {
          <article 
            [class]="post.type === 'link' ? 'bg-[#2a1315] border-[#4a1a1e]' : 'bg-[var(--brand-surface)] border-[var(--brand-border)]'"
            class="break-inside-avoid rounded-2xl border p-5 transition-transform hover:scale-[1.01]"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-[10px] font-bold uppercase tracking-widest text-[var(--brand-red)]">{{ post.tag }}</span>
              <span class="text-[10px] text-[var(--brand-muted)]">{{ post.timestamp }}</span>
            </div>
            
            @if (post.imageUrl) {
              <div class="mb-4 overflow-hidden rounded-xl border border-white/5">
                <img [src]="post.imageUrl" class="w-full object-cover" />
              </div>
            }
            
            <h4 [class]="post.type === 'text' ? 'text-lg italic' : 'text-sm'" class="font-bold text-white mb-4 leading-relaxed">
              @if (post.type === 'text') { " }
              {{ post.title }}
              @if (post.type === 'text') { " }
            </h4>
            
            @if (post.content) {
              <p class="mb-4 text-xs text-[var(--brand-text)] opacity-80 leading-relaxed">{{ post.content }}</p>
            }
            
            @if (post.type === 'link') {
              <a href="#" class="inline-flex items-center text-[10px] font-bold text-[var(--brand-red)] uppercase tracking-widest hover:underline">
                Read Article <svg class="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
            }
            
            <footer class="mt-4 flex items-center gap-4 pt-4 border-t border-white/5">
              <div class="flex items-center gap-1.5 text-[var(--brand-muted)] text-[10px] font-bold">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                {{ post.likes }}
              </div>
              <div class="flex items-center gap-1.5 text-[var(--brand-muted)] text-[10px] font-bold">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                {{ post.comments }}
              </div>
            </footer>
          </article>
        }
      </div>
    </div>
  `
})
export class ProfileFeed {
  readonly posts = input.required<ProfilePost[]>();
  readonly tabs = ['POSTS', 'MEDIA', 'LIKES'] as const;
  readonly activeTab = signal('POSTS');
}
