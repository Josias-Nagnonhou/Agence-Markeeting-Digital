import { LocalDiskStorageProvider } from "@/modules/storage/providers/local-disk.provider";
import type { StorageProvider } from "@/modules/storage/storage.types";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

function getStorageProvider(): StorageProvider {
  // Point d'extension unique : brancher un provider cloud (Vercel Blob,
  // S3...) ici selon l'environnement, sans changer les appelants.
  return new LocalDiskStorageProvider();
}

export class InvalidFileError extends Error {}

export async function uploadProductImage(file: File) {
  if (!ALLOWED_CONTENT_TYPES.has(file.type)) {
    throw new InvalidFileError("Formats acceptés : PNG, JPEG, WEBP.");
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new InvalidFileError("Le fichier dépasse la taille maximale de 5 Mo.");
  }

  const provider = getStorageProvider();
  return provider.upload(file, "products");
}
