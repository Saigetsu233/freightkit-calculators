import type { Metadata } from "next";
import Link from "next/link";
import { DutchLoadMeterCalculator } from "../../../components/DutchLoadMeterCalculator";
import { SiteFooter, SiteHeader } from "../../../components/SiteChrome";
import { dutchRoadFreightStandards } from "../../../lib/locales";

export const metadata: Metadata = {
  title: "Laadmeters berekenen voor vrachtwagens",
  description: "Bereken direct laadmeters (LDM) voor Europallets, blokpallets en eigen maten. Met Nederlandse invoer, Europese palletmaten en een instelbare trailerbreedte.",
  alternates: {
    canonical: "/nl/tools/laadmeter-calculator",
    languages: {
      en: "/tools/load-meter-calculator",
      "nl-NL": "/nl/tools/laadmeter-calculator",
      "x-default": "/tools/load-meter-calculator",
    },
  },
  openGraph: {
    locale: "nl_NL",
    title: "Laadmeter calculator voor pallets en vrachtwagens",
    description: "Vul palletmaat en aantal in en zie direct het aantal laadmeters.",
    url: "/nl/tools/laadmeter-calculator",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ShipMathLab Laadmeter Calculator",
  inLanguage: "nl-NL",
  url: "https://shipmathlab.com/nl/tools/laadmeter-calculator",
  description: "Nederlandstalige calculator voor laadmeters, palletplaatsen en trailerbezetting.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
};

export default function DutchLoadMeterPage() {
  return (
    <main className="tool-page" lang="nl-NL">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <SiteHeader locale="nl" />
      <div className="shell breadcrumb"><Link href="/">ShipMathLab</Link><span>/</span><span>Nederland</span><span>/</span><span>Laadmeters</span></div>
      <section className="shell tool-hero regional-tool-hero">
        <div><p className="eyebrow">Wegtransport · Nederland en Europa</p><h1>Laadmeters berekenen</h1><p className="tool-summary">Kies een pallet, vul het aantal in en zie direct hoeveel meter van de trailer nodig is. U hoeft de LDM-formule niet vooraf te kennen.</p></div>
        <div className="tool-meta">
          <div><span>Taal</span><strong>Nederlands</strong></div>
          <div><span>Eenheden</span><strong>cm · m · LDM</strong></div>
          <div><span>Standaard pallet</span><strong>EPAL 120 × 80 cm</strong></div>
          <div><span>Rekenbreedte</span><strong>2,40 m (instelbaar)</strong></div>
        </div>
      </section>
      <section className="regional-context"><div className="shell regional-context-grid"><div><span>Automatisch gekozen</span><strong>Nederlandse taal en Europese maten</strong></div><p>De taalkeuze wordt op dit apparaat onthouden. Alle waarden blijven aanpasbaar, omdat vervoerders en voertuigen kunnen afwijken.</p></div></section>
      <section id="calculator" className="calculator-band"><div className="shell calculator-shell"><DutchLoadMeterCalculator /></div></section>
      <section className="shell method-section">
        <div><p className="eyebrow">Formule en regionale standaard</p><h2>Wat de calculator gebruikt</h2></div>
        <div className="method-copy">
          <p>Laadmeters verdelen het vloeroppervlak van de zending over de bruikbare binnenbreedte van de trailer. De standaardinvoer gebruikt {formatNumber(dutchRoadFreightStandards.trailerWorkingWidthMetres)} meter, maar blijft bewust instelbaar.</p>
          <div className="formula-box">LDM = lengte (m) × breedte (m) × aantal ÷ trailerbreedte ÷ stapelbare lagen</div>
          <div className="regional-standard-grid">
            <article><span>Europallet · EPAL 1</span><strong>120 × 80 cm</strong><p>Met een rekenbreedte van 2,40 m is één niet-gestapelde pallet {formatNumber(dutchRoadFreightStandards.euroPallet.loadMetres)} LDM.</p></article>
            <article><span>Blokpallet · EPAL 2</span><strong>120 × 100 cm</strong><p>Met dezelfde rekenbreedte is één niet-gestapelde pallet {formatNumber(dutchRoadFreightStandards.blockPallet.loadMetres)} LDM.</p></article>
          </div>
          <p className="fine-print">Dit zijn planningswaarden, geen wettelijke laadgoedkeuring. De EU-limiet van 2,55 m betreft de buitenbreedte van de meeste voertuigen; 2,40 m hier is een gebruikelijke interne rekenbreedte en moet bij de vervoerder worden bevestigd.</p>
          <div className="tool-sources"><strong>Bronnen en maatvoering</strong><a href="https://www.epal-pallets.org/eu-en/load-carriers/overview" target="_blank" rel="noopener noreferrer">EPAL productspecificaties ↗</a><a href="https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A01996L0053-20190710" target="_blank" rel="noopener noreferrer">EU-richtlijn 96/53/EG voor voertuigafmetingen ↗</a></div>
        </div>
      </section>
      <section className="shell evidence-grid">
        <article className="evidence-card"><p className="eyebrow">Snel controleren</p><h2>Bekende palletwaarden</h2><ul><li>1 Europallet van 120 × 80 cm = 0,4 LDM.</li><li>1 blokpallet van 120 × 100 cm = 0,5 LDM.</li><li>10 Europallets = 4,0 LDM wanneer ze niet stapelbaar zijn.</li></ul></article>
        <article className="evidence-card mistake-card"><p className="eyebrow">Let op</p><h2>Wanneer de uitkomst kan afwijken</h2><ul><li>De vervoerder gebruikt een andere bruikbare binnenbreedte.</li><li>De goederen mogen niet werkelijk op elkaar worden gestapeld.</li><li>Uitstekende of onregelmatige lading gebruikt extra vloerplaats.</li><li>Aslast en gewichtsverdeling worden niet door LDM alleen gecontroleerd.</li></ul></article>
      </section>
      <SiteFooter locale="nl" />
    </main>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 2 }).format(value);
}

