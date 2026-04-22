import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseAuthService } from './supabase-auth.service';

export type StorageBucket = 'nexora-avatars' | 'nexora-posts';

@Injectable({
  providedIn: 'root',
})
export class SupabaseStorageService {
  private readonly supabaseAuth = inject(SupabaseAuthService);

  private getClient(): SupabaseClient {
    return this.supabaseAuth.getClient();
  }

  async uploadFile(bucket: StorageBucket, path: string, file: File): Promise<string> {
    const MAX_SIZE_MB = 2;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      throw new Error(`El archivo es demasiado grande. El límite es de ${MAX_SIZE_MB}MB.`);
    }

    const client = this.getClient();
    
    console.log(`[SupabaseStorage] Intentando subir a ${bucket}/${path}`, {
      size: file.size,
      type: file.type,
      name: file.name
    });

    // Aseguramos un MIME type estándar
    const contentType = file.type || 'image/jpeg';
    
    // Convertimos a ArrayBuffer para máxima compatibilidad binaria
    const fileBody = await file.arrayBuffer();

    const { data, error } = await client
      .storage.from(bucket)
      .upload(path, fileBody, {
        cacheControl: '3600',
        upsert: true,
        contentType: contentType
      });

    if (error) {
      // @ts-ignore - Intentar ver si hay un mensaje detallado en la respuesta
      const errorDetails = error.message || error.error || JSON.stringify(error);
      console.error(`[SupabaseStorage] Error detallado en ${bucket}:`, errorDetails);
      throw error;
    }

    const { data: publicUrlData } = client
      .storage.from(bucket)
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  }

  async deleteFile(bucket: StorageBucket, path: string): Promise<void> {
    const { error } = await this.getClient()
      .storage.from(bucket)
      .remove([path]);

    if (error) {
      console.error(`[SupabaseStorage] Error eliminando en ${bucket}:`, error);
      throw error;
    }
  }
}
