import { cn } from "@/lib/utils/cn";

export interface OfferAngleData {
  id: string;
  promise: string;
  differentiator: string;
  benefits: string[];
  rationale: string | null;
  status: "PROPOSED" | "SELECTED" | "DISCARDED";
}

export function OfferAngleCard({
  angle,
  isSelected,
  onSelect,
}: {
  angle: OfferAngleData;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex h-full flex-col gap-3 rounded-2xl border p-5 text-left transition-colors",
        isSelected ? "border-gray-900 ring-2 ring-gray-900/10" : "border-gray-200 hover:border-gray-400",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold leading-snug">{angle.promise}</p>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-0.5 text-xs",
            isSelected ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 text-gray-400",
          )}
        >
          {isSelected ? "Sélectionné" : "Choisir"}
        </span>
      </div>

      <p className="text-sm text-gray-600">
        <span className="font-medium text-gray-800">Différenciant : </span>
        {angle.differentiator}
      </p>

      <ul className="space-y-1 text-sm text-gray-600">
        {angle.benefits.map((benefit) => (
          <li key={benefit} className="flex gap-2">
            <span aria-hidden>•</span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      {angle.rationale && (
        <p className="mt-auto border-t border-gray-100 pt-3 text-xs text-gray-400">{angle.rationale}</p>
      )}
    </button>
  );
}
