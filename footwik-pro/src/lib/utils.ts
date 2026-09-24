import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatShortDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(iso));
}

export function formatPercent(value: number) {
  return `${Math.round(value)} %`;
}

type CurrencyRegion = "afrique" | "diaspora";

export function formatPrice(fcfa: number, eur: number, region: CurrencyRegion) {
  if (region === "diaspora") {
    return `${eur} €`;
  }
  return `${fcfa.toLocaleString("fr-FR")} FCFA`;
}
