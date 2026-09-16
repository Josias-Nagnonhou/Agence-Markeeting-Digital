import { cn } from "@/lib/utils/cn";

export interface WizardStep {
  key: string;
  label: string;
  status: "done" | "current" | "upcoming";
}

export function Stepper({ steps }: { steps: WizardStep[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-3 text-sm">
      {steps.map((step, index) => (
        <li key={step.key} className="flex items-center gap-2">
          <span
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
              step.status === "done" && "bg-indigo-600 text-white",
              step.status === "current" && "bg-indigo-600 text-white ring-2 ring-indigo-200 ring-offset-2",
              step.status === "upcoming" && "bg-gray-100 text-gray-400",
            )}
          >
            {index + 1}
          </span>
          <span
            className={cn(
              "font-medium",
              step.status === "upcoming" ? "text-gray-400" : "text-gray-900",
            )}
          >
            {step.label}
          </span>
          {index < steps.length - 1 && <span className="mx-1 h-px w-6 bg-gray-200" />}
        </li>
      ))}
    </ol>
  );
}
