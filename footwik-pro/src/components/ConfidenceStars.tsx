import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Confidence } from "@/lib/types";

export function ConfidenceStars({
  confidence,
  size = 16,
}: {
  confidence: Confidence;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Indice de confiance ${confidence} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={cn(i <= confidence ? "fill-gold text-gold" : "fill-transparent text-pitch-400")}
        />
      ))}
    </div>
  );
}
