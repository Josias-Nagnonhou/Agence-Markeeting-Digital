import { useId } from "react";
import { Team } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ClubCrest({
  team,
  size = 40,
  className,
}: {
  team: Team;
  size?: number;
  className?: string;
}) {
  const gradientId = useId();
  const textColor = team.lightText ? "#FFFFFF" : "#0A0E0B";
  const code = team.shortName.replace(/[^A-Za-zÀ-ÿ]/g, "").slice(0, 4).toUpperCase() || team.logo;

  return (
    <svg
      viewBox="0 0 100 116"
      width={size}
      height={(size * 116) / 100}
      className={cn("shrink-0 drop-shadow-sm", className)}
      role="img"
      aria-label={`Blason ${team.name}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={team.primaryColor} />
          <stop offset="100%" stopColor={team.accentColor} stopOpacity={0.85} />
        </linearGradient>
      </defs>
      <path
        d="M50 3 L91 16 V52 C91 79 74 100 50 113 C26 100 9 79 9 52 V16 Z"
        fill={`url(#${gradientId})`}
        stroke="rgba(0,0,0,0.35)"
        strokeWidth={2}
      />
      <path
        d="M50 3 L91 16 V52 C91 79 74 100 50 113 C26 100 9 79 9 52 V16 Z"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={1.5}
      />
      <text
        x="50"
        y="63"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        fontFamily="var(--font-display), 'Arial Narrow', sans-serif"
        fontWeight={800}
        fontSize={code.length > 3 ? 22 : 28}
        letterSpacing="0.5"
      >
        {code}
      </text>
    </svg>
  );
}
