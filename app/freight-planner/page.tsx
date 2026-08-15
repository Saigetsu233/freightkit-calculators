import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "../components/Calculator";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "Freight Decision Planner — DIM, Pallet & LCL",
  description: "A three-step freight decision workflow: compare dimensional weight, test a pallet load, and audit LCL weight or measure before quoting.",
  alternates: { canonical: "/freight-planner" },
  openGraph: { title: "Freight Decision Planner | ShipMathLab", description: "Three transparent calculators for package, pallet, and LCL decisions." },
};

const stages = [
  { slug: "dimensional-weight-calculator", kicker: "01 · Parcel", title: "Does cube or scale weight control?", description: "Compare actual and dimensional weight with a carrier or contract divisor before accepting a parcel quote." },
  { slug: "pallet-load-calculator", kicker: "02 · Warehouse", title: "How many cartons can the pallet really carry?", description: "Test orientation, whole layers, total height, gross weight, and the limiting constraint." },
  { slug: "lcl-chargeable-volume-calculator", kicker: "03 · Ocean", title: "What is the chargeable LCL basis?", description: "Total multiple cargo lines, compare CBM with metric tonnes, and expose minimums and fixed fees." },
];

export default function FreightPlanner() {
  return <main><SiteHeader /><div className="shell breadcrumb"><Link href="/">Home</Link><span>/</span><span>Freight planner</span></div><article className="shell content-page"><p className="eyebrow">Three freight checks</p><h1>Check parcel weight, pallet capacity, and LCL W/M.</h1><p className="article-deck">Run the three calculations that commonly change a freight quote. Use your finished dimensions, approved pallet limits, and the rates from your carrier or forwarder.</p><div className="principle-grid">{stages.map((stage) => <article key={stage.slug}><span>{stage.kicker}</span><h2>{stage.title}</h2><p>{stage.description}</p><Link className="text-link" href={`/tools/${stage.slug}`}>Open full tool →</Link></article>)}</div>{stages.map((stage) => <section className="calculator-section" aria-labelledby={`${stage.slug}-heading`} key={stage.slug}><div className="section-heading compact"><div><p className="eyebrow">{stage.kicker}</p><h2 id={`${stage.slug}-heading`}>{stage.title}</h2></div><p>{stage.description}</p></div><Calculator slug={stage.slug} /></section>)}<section className="prose-section"><p className="eyebrow">Before using the result</p><h2>Keep the shipment details with the number.</h2><p>Record the finished dimensions, scale weight, carrier or tariff rule, pallet specification, quote scope, currency, and review date. The current contract, equipment rating, and physical trial still control the shipment.</p><Link className="button button-primary" href="/methodology">Method and sources →</Link></section></article><SiteFooter /></main>;
}
