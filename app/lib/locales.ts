export type SiteLocale = "en" | "nl" | "de" | "fr" | "ja" | "zh";

export const localePreferences: Record<SiteLocale, {
  label: string;
  languageTag: string;
  region: string;
}> = {
  en: { label: "English", languageTag: "en", region: "International" },
  nl: { label: "Nederlands", languageTag: "nl-NL", region: "Nederland / Europa" },
  de: { label: "Deutsch", languageTag: "de-DE", region: "Deutschland / Europa" },
  fr: { label: "Français", languageTag: "fr-FR", region: "France / Europe" },
  ja: { label: "日本語", languageTag: "ja-JP", region: "日本" },
  zh: { label: "中文", languageTag: "zh-CN", region: "中国大陆" },
};

export const localizedFreightPaths: Record<SiteLocale, string> = {
  en: "/tools/load-meter-calculator",
  nl: "/nl/tools/laadmeter-calculator",
  de: "/de/tools/lademeter-rechner",
  fr: "/fr/outils/calculateur-metre-plancher",
  ja: "/ja/tools/truck-loading-calculator",
  zh: "/zh/tools/truck-loading-calculator",
};

const equivalents: Partial<Record<SiteLocale, string>> = { ...localizedFreightPaths };

export const localePathMap: Record<string, Partial<Record<SiteLocale, string>>> = {
  "/": equivalents,
  ...Object.fromEntries(Object.values(localizedFreightPaths).map((path) => [path, equivalents])),
};
