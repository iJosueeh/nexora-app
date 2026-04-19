import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';

import { AuthSession } from '../../../../../../core/services/auth-session';
import { PublicationDraft } from '../../publication-draft.model';
import { PublicationActionChipsComponent } from '../publication-action-chips/publication-action-chips';
import { PublicationLocationSelectComponent } from '../publication-location-select/publication-location-select';
import { PublicationMediaDropzoneComponent } from '../publication-media-dropzone/publication-media-dropzone';
import { PublicationVisibility, PublicationVisibilitySelectorComponent } from '../publication-visibility-selector/publication-visibility-selector';
import { PublicationTagsSelectComponent } from '../publication-tags-select/publication-tags-select';

@Component({
  selector: 'app-publication-composer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PublicationActionChipsComponent,
    PublicationLocationSelectComponent,
    PublicationMediaDropzoneComponent,
    PublicationVisibilitySelectorComponent,
    PublicationTagsSelectComponent
  ],
  templateUrl: './publication-composer.html'
})
export class PublicationComposerComponent {
  readonly published = output<PublicationDraft>();

  private readonly authSession = inject(AuthSession);

  readonly title = signal('');
  readonly description = signal('');
  readonly attachments = signal<File[]>([]);
  readonly visibility = signal<PublicationVisibility>('public');
  readonly location = signal('');
  readonly selectedTags = signal<string[]>([]);
  readonly activeActions = signal<string[]>([]);

  readonly extractedTags = computed(() => {
    const content = `${this.title()} ${this.description()}`.trim();
    const matches = content.match(/#[\p{L}\p{N}_]+/gu) || [];
    return [...new Set(matches)]; // Remove duplicates
  });

  readonly userAvatar = computed(() => {
    const user = this.authSession.getUser();
    return user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.username ?? user?.email ?? 'NexoraUser')}`;
  });

  readonly userName = computed(() => {
    const user = this.authSession.getUser();
    return user?.fullName?.trim() || user?.username?.trim() || user?.email?.split('@')[0] || 'Tu perfil';
  });

  readonly canPublish = computed(() => {
    const title = this.title().trim();
    const description = this.description().trim();
    return title.length >= 3 || description.length >= 3 || this.attachments().length > 0;
  });

  updateTitle(event: Event): void {
    const target = event.target as HTMLTextAreaElement | null;
    this.title.set(target?.value ?? '');
  }

  updateDescription(event: Event): void {
    const target = event.target as HTMLTextAreaElement | null;
    this.description.set(target?.value ?? '');
  }

  updateAttachments(files: File[]): void {
    this.attachments.set(files);
  }

  updateVisibility(value: PublicationVisibility): void {
    this.visibility.set(value);
  }

  updateLocation(value: string): void {
    this.location.set(value);
  }

  updateSelectedTags(tags: string[]): void {
    this.selectedTags.set(tags);
  }

  updateActions(actions: string[]): void {
    this.activeActions.set(actions);
  }

  readonly isTagsOpen = computed(() => this.activeActions().includes('tags'));
  readonly isLocationOpen = computed(() => this.activeActions().includes('location'));

  publish(): void {
    const title = this.title().trim();
    const content = this.description().trim();
    if (!this.canPublish()) {
      return;
    }

    this.published.emit({
      title: title || content.split('\n')[0]?.slice(0, 90) || '',
      content,
      attachments: [...this.attachments()],
      visibility: this.visibility(),
      tags: this.selectedTags().length > 0 ? this.selectedTags() : this.extractedTags(),
      location: this.location() || undefined
    });

    this.title.set('');
    this.description.set('');
    this.attachments.set([]);
    this.location.set('');
    this.selectedTags.set([]);
    this.activeActions.set([]);
  }
}
