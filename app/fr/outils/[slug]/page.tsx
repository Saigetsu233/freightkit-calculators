import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RegionalCoreToolPage } from "../../../components/RegionalCoreToolPage";
import { localePreferences, type SiteLocale } from "../../../lib/locales";
import { coreToolCopy, coreToolKey, localizedCoreToolPaths } from "../../../lib/regional-core-tools";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const key = coreToolKey("fr", slug); if (!key) return {};
  const text = coreToolCopy("fr"); const label = key === "dimensional-weight" ? text.dim : key === "pallet-loading" ? text.pallet : text.lcl;
  return { title: `${label} | ShipMathLab`, description: text.description, alternates: { canonical: localizedCoreToolPaths.fr[key], languages: Object.fromEntries((Object.keys(localizedCoreToolPaths) as SiteLocale[]).map((locale) => [localePreferences[locale].languageTag, localizedCoreToolPaths[locale][key]])) } };
}

export default async function FrenchLocalizedCoreToolRoute({ params }: Props) {
  const { slug } = await params;
  if (!coreToolKey("fr", slug)) notFound();
  return <RegionalCoreToolPage locale="fr" slug={slug} />;
}
