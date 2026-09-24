import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "gold" | "win" | "loss" | "outline";
  className?: string;
}) {
  const variants: Record<string, string> = {
    default: "bg-pitch-600 text-ink-muted border border-pitch-400",
    gold: "bg-gold/15 text-gold border border-gold/40",
    win: "bg-grass/15 text-grass border border-grass/40",
    loss: "bg-loss/15 text-red-300 border border-loss/40",
    outline: "bg-transparent text-ink-faint border border-pitch-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
