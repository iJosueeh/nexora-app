import { ChangeDetectionStrategy, Component, computed, output, signal } from '@angular/core';

@Component({
  selector: 'app-publication-media-dropzone',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './publication-media-dropzone.html'
})
export class PublicationMediaDropzoneComponent {
  readonly filesSelected = output<File[]>();

  readonly files = signal<File[]>([]);
  readonly isDragging = signal(false);

  readonly fileSummary = computed(() => {
    const total = this.files().length;
    return total === 0 ? 'Drop high-resolution images or research PDFs here' : `${total} archivo${total === 1 ? '' : 's'} adjunto${total === 1 ? '' : 's'}`;
  });

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    this.updateFiles(event.dataTransfer?.files ?? null);
  }

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.updateFiles(target?.files ?? null);
    if (target) {
      target.value = '';
    }
  }

  removeFile(index: number): void {
    const nextFiles = this.files().filter((_, currentIndex) => currentIndex !== index);
    this.files.set(nextFiles);
    this.filesSelected.emit(nextFiles);
  }

  private updateFiles(fileList: FileList | null): void {
    if (!fileList?.length) {
      return;
    }

    const mergedFiles = [...this.files(), ...Array.from(fileList)];
    this.files.set(mergedFiles.slice(0, 6));
    this.filesSelected.emit(this.files());
  }
}
