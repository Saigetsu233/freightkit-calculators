"use client";

import Link from "next/link";
import { useEffect } from "react";
import { localePathMap, type SiteLocale } from "../lib/locales";

const preferenceKey = "shipmathlab-locale";

function browserLocale(): SiteLocale {
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  return languages.some((language) => language.toLowerCase().startsWith("nl")) ? "nl" : "en";
}

export function LocaleAutoSwitch() {
  useEffect(() => {
    const path = window.location.pathname.replace(/\/$/, "") || "/";
    document.documentElement.lang = path.startsWith("/nl/") ? "nl-NL" : "en";
    const routes = localePathMap[path];
    if (!routes) return;

    const saved = window.localStorage.getItem(preferenceKey) as SiteLocale | null;
    const locale = saved === "en" || saved === "nl" ? saved : browserLocale();
    if (!saved) window.localStorage.setItem(preferenceKey, locale);
    const destination = routes[locale];
    if (destination && destination !== path) window.location.replace(destination);
  }, []);

  return null;
}

export function LocaleLink({ current, className = "locale-control" }: { current: SiteLocale; className?: string }) {
  const target: SiteLocale = current === "nl" ? "en" : "nl";
  const path = localePathMap[typeof window === "undefined" ? (current === "nl" ? "/nl/tools/laadmeter-calculator" : "/") : (window.location.pathname.replace(/\/$/, "") || "/")];
  const href = path?.[target] ?? (target === "nl" ? "/nl/tools/laadmeter-calculator" : "/");

  return (
    <Link href={href} hrefLang={target === "nl" ? "nl-NL" : "en"} className={className} onClick={() => window.localStorage.setItem(preferenceKey, target)}>
      {target === "nl" ? "Nederlands" : "English"}
    </Link>
  );
}
