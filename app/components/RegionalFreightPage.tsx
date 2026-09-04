import Link from "next/link";
import { RegionalFreightCalculator } from "./RegionalFreightCalculator";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import type { RegionalFreightConfig } from "../lib/regional-freight";

export function RegionalFreightPage({ config }: { config: RegionalFreightConfig }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `ShipMathLab — ${config.title}`,
    inLanguage: config.htmlLang,
    url: `https://shipmathlab.com${config.path}`,
    description: config.metadataDescription,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: config.locale === "ja" ? "JPY" : config.locale === "zh" ? "CNY" : "EUR" },
  };

  return (
    <main className="tool-page" lang={config.htmlLang}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <SiteHeader locale={config.locale} />
      <div className="shell breadcrumb"><Link href="/">ShipMathLab</Link><span>/</span><span>{config.regionLabel}</span><span>/</span><span>{config.title}</span></div>
      <section className="shell tool-hero regional-tool-hero">
        <div><p className="eyebrow">{config.eyebrow}</p><h1>{config.title}</h1><p className="tool-summary">{config.summary}</p></div>
        <div className="tool-meta">
          <div><span>Language / 语言</span><strong>{config.languageName}</strong></div>
          <div><span>Units / 単位</span><strong>{config.unitsLabel}</strong></div>
          <div><span>Pallet</span><strong>{config.standardPalletLabel}</strong></div>
          <div><span>Planning width</span><strong>{config.planningWidthLabel}</strong></div>
        </div>
      </section>
      <section className="regional-context"><div className="shell regional-context-grid"><div><span>✓</span><strong>{config.selectedTitle}</strong></div><p>{config.selectedCopy}</p></div></section>
      <section id="calculator" className="calculator-band"><div className="shell calculator-shell"><RegionalFreightCalculator config={config} /></div></section>
      <section className="shell method-section">
        <div><p className="eyebrow">{config.methodEyebrow}</p><h2>{config.methodTitle}</h2></div>
        <div className="method-copy">
          <p>{config.methodCopy}</p>
          <div className="formula-box">{config.formula}</div>
          <div className="regional-rule-grid">
            <RuleCard title={config.palletRuleTitle} copy={config.palletRuleCopy} sourceLabel={config.palletRuleSourceLabel} source={config.palletRuleSource} />
            <RuleCard title={config.vehicleRuleTitle} copy={config.vehicleRuleCopy} sourceLabel={config.vehicleRuleSourceLabel} source={config.vehicleRuleSource} />
            <RuleCard title={config.carrierRuleTitle} copy={config.carrierRuleCopy} sourceLabel={config.carrierRuleSourceLabel} source={config.carrierRuleSource} />
          </div>
        </div>
      </section>
      <section className="shell evidence-grid">
        <article className="evidence-card"><p className="eyebrow">Reference</p><h2>{config.knownTitle}</h2><ul>{config.knownItems.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article className="evidence-card mistake-card"><p className="eyebrow">Check</p><h2>{config.warningTitle}</h2><ul>{config.warningItems.map((item) => <li key={item}>{item}</li>)}</ul></article>
      </section>
      <SiteFooter locale={config.locale} />
    </main>
  );
}

function RuleCard({ title, copy, sourceLabel, source }: { title: string; copy: string; sourceLabel: string; source: string }) {
  return <article><h3>{title}</h3><p>{copy}</p><a href={source} target="_blank" rel="noopener noreferrer">{sourceLabel} ↗</a></article>;
}
