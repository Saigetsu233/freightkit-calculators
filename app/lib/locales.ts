export type SiteLocale = "en" | "nl";

export const localePreferences: Record<SiteLocale, {
  label: string;
  languageTag: string;
  region: string;
  measurementSystem: "metric" | "imperial";
}> = {
  en: {
    label: "English",
    languageTag: "en",
    region: "International",
    measurementSystem: "metric",
  },
  nl: {
    label: "Nederlands",
    languageTag: "nl-NL",
    region: "Nederland / continentaal Europa",
    measurementSystem: "metric",
  },
};

export const dutchRoadFreightStandards = {
  trailerWorkingWidthMetres: 2.4,
  referenceTrailerLengthMetres: 13.6,
  euroPallet: { lengthCentimetres: 120, widthCentimetres: 80, loadMetres: 0.4 },
  blockPallet: { lengthCentimetres: 120, widthCentimetres: 100, loadMetres: 0.5 },
} as const;

export const localePathMap: Record<string, Partial<Record<SiteLocale, string>>> = {
  "/": { en: "/", nl: "/nl/tools/laadmeter-calculator" },
  "/tools/load-meter-calculator": { en: "/tools/load-meter-calculator", nl: "/nl/tools/laadmeter-calculator" },
  "/nl/tools/laadmeter-calculator": { en: "/tools/load-meter-calculator", nl: "/nl/tools/laadmeter-calculator" },
};

