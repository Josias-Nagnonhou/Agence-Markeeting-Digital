import Link from "next/link";
import { Info } from "lucide-react";

export function ResponsibleGamingBanner() {
  return (
    <div className="border-b border-gold/20 bg-gold-darker/60">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-xs text-gold/90">
        <Info size={14} className="shrink-0" />
        <p>
          Les analyses sont des aides à la décision. Aucun résultat
          n&apos;est garanti. Pariez de manière responsable.{" "}
          <Link href="/jeu-responsable" className="underline hover:text-gold">
            En savoir plus
          </Link>
        </p>
      </div>
    </div>
  );
}
