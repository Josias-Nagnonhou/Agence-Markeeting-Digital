export interface UploadedFile {
  url: string;
  contentType: string;
  size: number;
}

export interface StorageProvider {
  upload(file: File, folder: string): Promise<UploadedFile>;
}
