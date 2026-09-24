import Link from "next/link";
import { Lock } from "lucide-react";
import { MatchAnalysis } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/Badge";
import { ConfidenceStars } from "@/components/ConfidenceStars";

export function MatchCard({ match }: { match: MatchAnalysis }) {
  return (
    <Link
      href={`/matchs/${match.id}`}
      className="group block rounded-xl border border-pitch-600 bg-pitch-800 p-4 transition hover:border-grass/60 hover:shadow-glow"
    >
      <div className="flex items-center justify-between gap-2">
        <Badge variant="outline">{match.competition}</Badge>
        {match.isFree ? (
          <Badge variant="win">Aperçu gratuit</Badge>
        ) : (
          <Badge variant="gold">
            <Lock size={12} /> Premium
          </Badge>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pitch-600 font-display text-xs font-bold text-ink">
            {match.home.logo}
          </div>
          <span className="text-center text-sm font-medium text-ink">{match.home.shortName}</span>
        </div>
        <span className="px-2 font-display text-lg text-ink-faint">VS</span>
        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pitch-600 font-display text-xs font-bold text-ink">
            {match.away.logo}
          </div>
          <span className="text-center text-sm font-medium text-ink">{match.away.shortName}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-pitch-600 pt-3">
        <span className="text-xs text-ink-faint">{formatDate(match.kickoff)}</span>
        <ConfidenceStars confidence={match.confidence} size={14} />
      </div>

      <div className="mt-2 text-sm font-medium text-grass group-hover:underline">
        Voir la fiche complète →
      </div>
    </Link>
  );
}
