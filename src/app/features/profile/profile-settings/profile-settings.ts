import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';

import { ShellLayout } from '../../../shared/components/shell-layout/shell-layout';
import { FeedSidebar } from '../../feed/components/feed-sidebar/feed-sidebar';
import { AuthSession } from '../../../core/services/auth-session';
import { SupabaseStorageService } from '../../../core/services/supabase-storage.service';
import { UPDATE_PROFILE_MUTATION } from '../../../graphql/graphql.queries';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ShellLayout, FeedSidebar],
  templateUrl: './profile-settings.html',
  styleUrl: './profile-settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingsPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authSession = inject(AuthSession);
  private readonly apollo = inject(Apollo);
  private readonly storageService = inject(SupabaseStorageService);
  private readonly toastr = inject(ToastrService);

  readonly user = computed(() => this.authSession.getUser());
  readonly isSaving = signal(false);
  readonly previewAvatar = signal<string | null>(null);
  readonly previewBanner = signal<string | null>(null);

  readonly form = this.fb.group({
    fullName: [this.user()?.fullName || '', [Validators.required]],
    username: [this.user()?.username || '', [Validators.required]],
    bio: [this.user()?.bio || ''],
    avatarUrl: [this.user()?.avatarUrl || ''],
    bannerUrl: [this.user()?.bannerUrl || ''],
    career: [this.user()?.career || '']
  });

  async onFileSelected(event: Event, type: 'avatar' | 'banner'): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'avatar') this.previewAvatar.set(reader.result as string);
      else this.previewBanner.set(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const bucket = type === 'avatar' ? 'nexora-avatars' : 'nexora-posts';
      const fileExt = file.name.split('.').pop() || 'jpg';
      const path = `${this.user()?.id}/${type}-${crypto.randomUUID()}.${fileExt}`;
      const url = await this.storageService.uploadFile(bucket, path, file);
      
      if (type === 'avatar') this.form.patchValue({ avatarUrl: url });
      else this.form.patchValue({ bannerUrl: url });
    } catch (e) {
      this.toastr.error(`Error al subir ${type === 'avatar' ? 'el avatar' : 'la portada'}`);
    }
  }

  removeFile(type: 'avatar' | 'banner'): void {
    if (type === 'avatar') {
      this.previewAvatar.set(null);
      this.form.patchValue({ avatarUrl: '' });
    } else {
      this.previewBanner.set(null);
      this.form.patchValue({ bannerUrl: '' });
    }
  }

  cancel(): void {
    const username = this.user()?.username;
    if (username) {
      this.router.navigate(['/u', username]);
    } else {
      this.router.navigate(['/feed']);
    }
  }

  save(): void {
    if (this.form.invalid || this.isSaving()) return;

    this.isSaving.set(true);
    const formValue = this.form.value;

    this.apollo.mutate<any>({
      mutation: UPDATE_PROFILE_MUTATION,
      variables: {
        input: {
          username: formValue.username,
          fullName: formValue.fullName,
          bio: formValue.bio,
          career: formValue.career,
          avatarUrl: formValue.avatarUrl || null,
          bannerUrl: formValue.bannerUrl || null
        }
      }
    }).subscribe({
      next: (result) => {
        const updatedProfile = result.data.actualizarPerfil;
        this.authSession.mergeUser(updatedProfile);
        this.toastr.success('Perfil actualizado correctamente');
        this.isSaving.set(false);
      },
      error: (err) => {
        this.toastr.error('Error al actualizar el perfil');
        this.isSaving.set(false);
        console.error(err);
      }
    });
  }
}
