import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { localizedFreightPaths, localePreferences, type SiteLocale } from "../lib/locales";
import { getRegionalHub, localizedHubPaths, type RegionalHubKey } from "../lib/regional-hubs";
import { coreToolCopy, localizedCoreToolPaths, type RegionalCoreTool } from "../lib/regional-core-tools";
import { SiteFooter, SiteHeader } from "./SiteChrome";

function isLocale(value: string): value is SiteLocale {
  return value in localizedHubPaths && value !== "en";
}

export function regionalHubMetadata(localeValue: string, section: string): Metadata {
  if (!isLocale(localeValue)) return {};
  const entry = getRegionalHub(localeValue, section);
  if (!entry) return {};
  const canonical = localizedHubPaths[localeValue][entry.key];
  const languages = Object.fromEntries(
    (Object.keys(localizedHubPaths) as SiteLocale[]).map((locale) => [localePreferences[locale].languageTag, localizedHubPaths[locale][entry.key]]),
  );
  return {
    title: `${entry.content.label} | ShipMathLab`,
    description: entry.content.description,
    alternates: { canonical, languages },
  };
}

export function RegionalHubPage({ locale: localeValue, section }: { locale: string; section: string }) {
  if (!isLocale(localeValue)) notFound();
  const entry = getRegionalHub(localeValue, section);
  if (!entry) notFound();

  const locale = localeValue as Exclude<SiteLocale, "en">;
  const { content } = entry;
  const calculatorHref = `${localizedFreightPaths[locale]}#calculator`;
  const corePaths = localizedCoreToolPaths[locale];
  const coreCopy = coreToolCopy(locale);
  const languageLinks = Object.entries(localizedHubPaths).map(([key, paths]) => ({
    locale: key as SiteLocale,
    href: paths[entry.key as RegionalHubKey],
  }));

  return (
    <main>
      <SiteHeader locale={locale} />
      <div className="shell breadcrumb"><Link href={localizedFreightPaths[locale]}>{content.home}</Link><span>/</span><span>{content.section}</span></div>
      <article className="shell regional-hub-page">
        <section className="regional-hub-hero">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
          <Link className="button button-primary" href={calculatorHref}>{content.action}</Link>
        </section>
        <section className="regional-hub-intro">
          <div>
            <p className="eyebrow">{content.section}</p>
            <h2>{content.introTitle}</h2>
          </div>
          <p>{content.intro}</p>
        </section>
        <section className="regional-hub-grid" aria-label={content.section}>
          {content.cards.map((card) => <article key={card.title}><h2>{card.title}</h2><p>{card.description}</p></article>)}
        </section>
        <section className="regional-core-links" aria-label={content.section}>
          {(Object.keys(corePaths) as RegionalCoreTool[]).map((tool) => <Link key={tool} href={corePaths[tool]}>
            {tool === "dimensional-weight" ? coreCopy.dim : tool === "pallet-loading" ? coreCopy.pallet : coreCopy.lcl} →
          </Link>)}
        </section>
        <aside className="regional-hub-note"><strong>{content.noteTitle}</strong><p>{content.note}</p></aside>
        <nav className="regional-hub-language-links" aria-label="Languages">
          {languageLinks.map(({ locale: language, href }) => <Link key={language} href={href}>{localePreferences[language].label}</Link>)}
        </nav>
      </article>
      <SiteFooter locale={locale} />
    </main>
  );
}
