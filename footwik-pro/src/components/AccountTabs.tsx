"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function AccountTabs({
  tabs,
}: {
  tabs: { id: string; label: string; content: React.ReactNode }[];
}) {
  const [active, setActive] = useState(tabs[0]?.id);

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-pitch-600 pb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition",
              active === t.id ? "bg-grass text-pitch-950" : "text-ink-muted hover:bg-pitch-600",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-6">{tabs.find((t) => t.id === active)?.content}</div>
    </div>
  );
}
