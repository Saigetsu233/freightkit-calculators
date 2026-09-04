import Link from "next/link";
import { LocaleLink } from "./LocaleRouting";
import type { SiteLocale } from "../lib/locales";

export function SiteHeader({ locale = "en" }: { locale?: SiteLocale }) {
  const nl = locale === "nl";
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="ShipMathLab home">
          <span className="brand-mark" aria-hidden="true">SM</span>
          <span>ShipMathLab</span>
        </Link>
        <nav className="site-nav" aria-label={nl ? "Hoofdnavigatie" : "Primary navigation"}>
          <Link href={nl ? "/nl/tools/laadmeter-calculator#calculator" : "/#all-tools"}>{nl ? "Calculator" : "All tools"}</Link>
          <Link href="/freight-planner">{nl ? "Vrachtplanner" : "Freight planner"}</Link>
          <Link href="/questions">{nl ? "Vragen" : "Questions"}</Link>
          <Link href="/guides">{nl ? "Gidsen" : "Guides"}</Link>
          <Link href="/resources">{nl ? "Bronnen" : "Resources"}</Link>
          <Link href="/embed">Embed</Link>
          <Link href="/methodology">{nl ? "Methode" : "Method"}</Link>
          <LocaleLink current={locale} />
          <Link className="nav-pill" href={nl ? "/nl/tools/laadmeter-calculator#calculator" : "/tools/dimensional-weight-calculator"}>{nl ? "Bereken nu" : "Start calculating"}</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({ locale = "en" }: { locale?: SiteLocale }) {
  const nl = locale === "nl";
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div>
          <Link className="brand" href="/">
            <span className="brand-mark" aria-hidden="true">SM</span>
            <span>ShipMathLab</span>
          </Link>
          <p className="footer-statement">{nl ? "Directe berekeningen voor pallets, laadmeters, volume, gewicht en vrachtkosten." : "Calculators for packaging, pallets, freight, landed cost, and ecommerce margin."}</p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link href={nl ? "/nl/tools/laadmeter-calculator" : "/#all-tools"}>{nl ? "Laadmeter calculator" : "All calculators"}</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/resources">Workbook &amp; resources</Link>
          <Link href="/resources/for-publishers">Publisher &amp; embed kit</Link>
          <Link href="/about">About</Link>
          <Link href="/methodology">Method &amp; sources</Link>
          <Link href="/changelog">Version log</Link>
          <Link href="/privacy">Privacy</Link>
          <a href="https://github.com/Saigetsu233/freightkit-calculators" target="_blank" rel="noopener noreferrer">Open-source formulas</a>
          <Link href="/tools/cbm-calculator">CBM calculator</Link>
          <Link href="/tools/pallet-load-calculator">Pallet calculator</Link>
          <Link href="/tools/ecommerce-margin-calculator">Margin calculator</Link>
        </nav>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} ShipMathLab</span>
        <span>{nl ? "Alleen voor planning. Controleer belangrijke waarden bij uw vervoerder of leverancier." : "Planning estimates only. Verify critical figures with your carrier or supplier."}</span>
      </div>
    </footer>
  );
}
