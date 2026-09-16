"use client";

import { useState } from "react";
import Image from "next/image";

export function ImageUploader({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setIsUploading(true);

    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files).slice(0, 6 - value.length)) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/uploads", { method: "POST", body: formData });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error ?? "Échec de l'upload.");
        uploaded.push(body.url as string);
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'upload.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((url) => (
          <div key={url} className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
            <Image src={url} alt="Visuel produit" fill className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((u) => u !== url))}
              className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white"
              aria-label="Retirer l'image"
            >
              ×
            </button>
          </div>
        ))}

        {value.length < 6 && (
          <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 text-xs text-gray-500 hover:border-gray-400">
            {isUploading ? "..." : "+ Ajouter"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              disabled={isUploading}
              onChange={(event) => handleFiles(event.target.files)}
            />
          </label>
        )}
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <p className="mt-2 text-xs text-gray-400">Optionnel — PNG, JPEG ou WEBP, 5 Mo max, 6 visuels max.</p>
    </div>
  );
}
