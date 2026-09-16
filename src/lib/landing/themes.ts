export interface LandingTheme {
  key: string;
  page: string;
  heroBg: string;
  heroText: string;
  heroAccentText: string;
  headlineFont: string;
  sectionAlt: string;
  cardBg: string;
  accentBg: string;
  accentText: string;
  ctaBg: string;
  ctaText: string;
}

export const LANDING_THEMES: Record<string, LandingTheme> = {
  minimal: {
    key: "minimal",
    page: "bg-white text-gray-900",
    heroBg: "bg-white",
    heroText: "text-gray-900",
    heroAccentText: "text-gray-500",
    headlineFont: "font-semibold tracking-tight",
    sectionAlt: "bg-gray-50",
    cardBg: "bg-white border border-gray-200",
    accentBg: "bg-gray-900",
    accentText: "text-white",
    ctaBg: "bg-gray-900 hover:bg-gray-700",
    ctaText: "text-white",
  },
  bold: {
    key: "bold",
    page: "bg-gray-950 text-white",
    heroBg: "bg-gray-950",
    heroText: "text-white",
    heroAccentText: "text-amber-400",
    headlineFont: "font-extrabold tracking-tight",
    sectionAlt: "bg-gray-900",
    cardBg: "bg-gray-900 border border-gray-800",
    accentBg: "bg-amber-500",
    accentText: "text-gray-950",
    ctaBg: "bg-amber-500 hover:bg-amber-400",
    ctaText: "text-gray-950",
  },
  editorial: {
    key: "editorial",
    page: "bg-[#fbf7f0] text-stone-900",
    heroBg: "bg-[#fbf7f0]",
    heroText: "text-stone-900",
    heroAccentText: "text-rose-700",
    headlineFont: "font-serif font-medium tracking-tight",
    sectionAlt: "bg-white",
    cardBg: "bg-[#fbf7f0] border border-stone-200",
    accentBg: "bg-rose-700",
    accentText: "text-white",
    ctaBg: "bg-rose-700 hover:bg-rose-600",
    ctaText: "text-white",
  },
};

export const DEFAULT_THEME_KEY = "minimal";

export function getThemeByKey(themeKey: string | null | undefined): LandingTheme {
  if (themeKey && LANDING_THEMES[themeKey]) return LANDING_THEMES[themeKey];
  return LANDING_THEMES[DEFAULT_THEME_KEY];
}
