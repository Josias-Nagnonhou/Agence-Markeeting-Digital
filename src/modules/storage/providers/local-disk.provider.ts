import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";
import type { StorageProvider, UploadedFile } from "@/modules/storage/storage.types";

/**
 * Stocke les fichiers sur le disque local sous `public/uploads`.
 * Adapté au développement local ; en production, remplacer par un
 * provider objet (Vercel Blob, S3...) implémentant la même interface
 * `StorageProvider`, sans changer les appelants.
 */
export class LocalDiskStorageProvider implements StorageProvider {
  private readonly uploadsRoot = path.join(process.cwd(), "public", "uploads");

  async upload(file: File, folder: string): Promise<UploadedFile> {
    const dir = path.join(this.uploadsRoot, folder);
    await mkdir(dir, { recursive: true });

    const extension = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const filename = `${nanoid(12)}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    // Chemin dynamique mais scopé à public/uploads : on informe Turbopack
    // qu'il n'a pas besoin de tracer tout le projet pour cet accès disque.
    const filePath = path.join(/* turbopackIgnore: true */ dir, filename);
    await writeFile(filePath, buffer);

    return {
      url: `/uploads/${folder}/${filename}`,
      contentType: file.type,
      size: file.size,
    };
  }
}
