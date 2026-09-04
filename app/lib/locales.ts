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

import { localizedHubPaths, type RegionalHubKey } from "./regional-hubs";

const equivalents: Partial<Record<SiteLocale, string>> = { ...localizedFreightPaths };

function equivalentsForHub(key: RegionalHubKey): Partial<Record<SiteLocale, string>> {
  return Object.fromEntries(
    (Object.keys(localizedHubPaths) as SiteLocale[]).map((locale) => [locale, localizedHubPaths[locale][key]]),
  ) as Partial<Record<SiteLocale, string>>;
}

export const localePathMap: Record<string, Partial<Record<SiteLocale, string>>> = {
  "/": equivalents,
  ...Object.fromEntries(Object.values(localizedFreightPaths).map((path) => [path, equivalents])),
  ...Object.fromEntries(
    (["planner", "questions", "guides", "resources", "embed", "methodology"] as RegionalHubKey[]).flatMap((key) => {
      const paths = equivalentsForHub(key);
      return Object.values(paths).map((path) => [path, paths]);
    }),
  ),
};
