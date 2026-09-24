import { CircleAlert, CircleCheck, CircleHelp, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { CouponResult, Verdict } from "@/lib/coupon/analyze";

const VERDICT_STYLE: Record<Verdict, { label: string; className: string; Icon: typeof CircleCheck }> = {
  solide: { label: "Solide", className: "border-grass/40 bg-grass/10 text-grass", Icon: CircleCheck },
  moyen: { label: "Moyen", className: "border-gold/40 bg-gold/10 text-gold", Icon: CircleHelp },
  risque: { label: "Risqué", className: "border-loss/40 bg-loss/10 text-red-300", Icon: CircleAlert },
};

export function CouponResultView({ result }: { result: CouponResult }) {
  const overall = VERDICT_STYLE[result.overallRisk];

  return (
    <div className="space-y-4">
      {result.demo && (
        <div className="flex items-center gap-2 rounded-lg border border-gold/30 bg-gold-darker/20 px-3 py-2 text-xs text-gold">
          <TriangleAlert size={14} />
          Mode démo : aucune clé IA n&apos;est configurée côté serveur, ceci est un exemple illustratif.
        </div>
      )}

      <div className={cn("flex items-center gap-3 rounded-xl border p-4", overall.className)}>
        <overall.Icon size={22} />
        <div>
          <div className="text-xs uppercase tracking-wide">Risque global du coupon</div>
          <div className="font-display text-lg font-bold">{overall.label}</div>
        </div>
      </div>

      <p className="text-sm text-ink-muted">{result.summary}</p>

      <div className="space-y-3">
        {result.selections.map((s, i) => {
          const v = VERDICT_STYLE[s.verdict];
          return (
            <div key={i} className="rounded-xl border border-pitch-600 bg-pitch-800 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-ink">{s.matchLabel}</div>
                  <div className="text-xs text-ink-faint">{s.market}</div>
                </div>
                <span className={cn("flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold", v.className)}>
                  <v.Icon size={13} /> {v.label}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink-muted">{s.explanation}</p>
              {s.keyFacts.length > 0 && (
                <ul className="mt-2 space-y-1 text-xs text-ink-faint">
                  {s.keyFacts.map((f, j) => (
                    <li key={j}>• {f}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <p className="rounded-lg border border-pitch-600 bg-pitch-600/30 px-3 py-2 text-xs text-ink-faint">
        Cette analyse est une aide à la décision. Aucun résultat n&apos;est garanti.
        Pariez de manière responsable.
      </p>
    </div>
  );
}
