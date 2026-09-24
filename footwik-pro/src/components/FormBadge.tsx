import { cn } from "@/lib/utils";
import { FormResult } from "@/lib/types";

export function FormRow({ results }: { results: FormResult[] }) {
  return (
    <div className="flex gap-1.5">
      {results.map((r, i) => (
        <div
          key={i}
          title={`${r.home ? "vs" : "@"} ${r.opponent} · ${r.score}`}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
            r.result === "V" && "bg-grass/20 text-grass",
            r.result === "N" && "bg-ink-faint/20 text-ink-muted",
            r.result === "D" && "bg-loss/20 text-red-300",
          )}
        >
          {r.result}
        </div>
      ))}
    </div>
  );
}
