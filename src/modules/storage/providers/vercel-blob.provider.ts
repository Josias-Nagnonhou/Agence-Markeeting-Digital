import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import type { StorageProvider, UploadedFile } from "@/modules/storage/storage.types";

/**
 * Stockage sur Vercel Blob, pour les déploiements serverless (le disque
 * local n'est pas persistant sur Vercel — voir LocalDiskStorageProvider).
 * Nécessite BLOB_READ_WRITE_TOKEN (ajouté automatiquement par Vercel
 * quand un Blob store est connecté au projet).
 */
export class VercelBlobStorageProvider implements StorageProvider {
  async upload(file: File, folder: string): Promise<UploadedFile> {
    const extension = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const pathname = `${folder}/${nanoid(12)}.${extension}`;

    const blob = await put(pathname, file, { access: "public" });

    return {
      url: blob.url,
      contentType: file.type,
      size: file.size,
    };
  }
}
