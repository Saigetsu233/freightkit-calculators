"use client";

import { useEffect } from "react";
import { localePathMap, localePreferences, localizedFreightPaths, type SiteLocale } from "../lib/locales";

const preferenceKey = "shipmathlab-locale";
const supportedLocales = Object.keys(localePreferences) as SiteLocale[];

function isLocale(value: string | null): value is SiteLocale {
  return Boolean(value && supportedLocales.includes(value as SiteLocale));
}

function browserLocale(): SiteLocale {
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const language of languages) {
    const code = language.toLowerCase().split("-")[0] as SiteLocale;
    if (supportedLocales.includes(code)) return code;
  }
  return "en";
}

function localeForPath(path: string): SiteLocale | null {
  return supportedLocales.find((locale) => localizedFreightPaths[locale] === path) ?? null;
}

export function LocaleAutoSwitch() {
  useEffect(() => {
    const path = window.location.pathname.replace(/\/$/, "") || "/";
    const pathLocale = localeForPath(path);
    if (pathLocale && pathLocale !== "en") {
      document.documentElement.lang = localePreferences[pathLocale].languageTag;
      window.localStorage.setItem(preferenceKey, pathLocale);
      return;
    }

    document.documentElement.lang = "en";
    const routes = localePathMap[path];
    if (!routes) return;
    const saved = window.localStorage.getItem(preferenceKey);
    const locale = isLocale(saved) ? saved : browserLocale();
    if (!saved) window.localStorage.setItem(preferenceKey, locale);
    const destination = routes[locale];
    if (destination && destination !== path && locale !== "en") window.location.replace(destination);
  }, []);

  return null;
}

export function LocaleMenu({ current, className = "locale-control" }: { current: SiteLocale; className?: string }) {
  return (
    <label className={`${className} locale-picker`}>
      <span className="sr-only">Language</span>
      <select
        aria-label="Language"
        value={current}
        onChange={(event) => {
          const target = event.target.value as SiteLocale;
          window.localStorage.setItem(preferenceKey, target);
          const path = window.location.pathname.replace(/\/$/, "") || "/";
          window.location.assign(localePathMap[path]?.[target] ?? localizedFreightPaths[target]);
        }}
      >
        {supportedLocales.map((locale) => <option key={locale} value={locale}>{localePreferences[locale].label}</option>)}
      </select>
    </label>
  );
}
