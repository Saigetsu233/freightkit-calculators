import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RegionalCoreToolPage } from "../../../components/RegionalCoreToolPage";
import { localePreferences, type SiteLocale } from "../../../lib/locales";
import { coreToolCopy, coreToolKey, localizedCoreToolPaths } from "../../../lib/regional-core-tools";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!(locale in localizedCoreToolPaths) || locale === "en") return {};
  const typedLocale = locale as Exclude<SiteLocale, "en">; const key = coreToolKey(typedLocale, slug); if (!key) return {};
  const text = coreToolCopy(typedLocale); const label = key === "dimensional-weight" ? text.dim : key === "pallet-loading" ? text.pallet : text.lcl;
  return { title: `${label} | ShipMathLab`, description: text.description, alternates: { canonical: localizedCoreToolPaths[typedLocale][key], languages: Object.fromEntries((Object.keys(localizedCoreToolPaths) as SiteLocale[]).map((language) => [localePreferences[language].languageTag, localizedCoreToolPaths[language][key]])) } };
}

export default async function LocalizedCoreToolRoute({ params }: Props) {
  const { locale, slug } = await params;
  if (!(locale in localizedCoreToolPaths) || locale === "en" || !coreToolKey(locale as Exclude<SiteLocale, "en">, slug)) notFound();
  return <RegionalCoreToolPage locale={locale} slug={slug} />;
}
