import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = { title: "Version & Source Review Log", description: "ShipMathLab formula, source-review, and product release notes.", alternates: { canonical: "/changelog" } };

const changes = [
  { date: "2026-08-16", label: "August 16, 2026 · v1.5", title: "One package, every major DIM rule", items: ["Rebuilt dimensional weight as a side-by-side FedEx, UPS Daily, UPS Retail, USPS, and DHL comparison.", "Added common package presets, billable-weight basis, package-count totals, a custom contract divisor, and a shrink-to-actual-weight target.", "Separated result views and valid generated results from simple calculator opens in the analytics funnel."] },
  { date: "2026-08-11", label: "August 11, 2026 · v1.4", title: "No freight knowledge required to start", items: ["Added the same plain-language input promise to all 20 calculators and moved calculator inputs closer to the first viewport.", "Reworked dimensional weight around a closest-match shipping setup, sealed parcel measurements, and scale weight instead of requiring a divisor choice.", "Reworked pallet loading around a pallet preset and one packed carton, with example transport limits clearly labelled and advanced dimensions optional.", "Made LCL W/M calculation independent from quote pricing: visitors can enter cargo facts first and add freight charges only if available.", "Added calculator-visible and input-started events so usability can be measured separately from completed calculations."] },
  { date: "2026-08-06", label: "August 6, 2026 · v1.3", title: "Reference assets and measurable distribution", items: ["Added DIM-divisor, pallet-dimension, and LCL quote-audit downloads.", "Added formula flow diagrams, print actions, copy-result events, embed-source analytics, and maintained-source records.", "Reviewed FedEx, UPS, DHL, USPS, EPAL, ISO, and Maersk reference links for the three priority tools."] },
  { date: "2026-08-05", label: "August 5, 2026 · v1.2", title: "Priority tool clusters", items: ["Expanded dimensional weight, pallet load, and LCL W/M with worked examples, error checks, and four distinct guides each.", "Published three no-key iframe calculators and the open formula repository."] },
  { date: "2026-08-03", label: "August 3, 2026 · v1.0", title: "Public launch", items: ["Released the original freight, packaging, inventory, warehouse, and ecommerce calculator collection."] },
];

export default function ChangelogPage() {
  return <main><SiteHeader/><div className="shell legal-page"><p className="updated">Version log</p><h1>What changed, and why.</h1><div className="change-list">{changes.map((change) => <article key={`${change.label}-${change.title}`}><time dateTime={change.date}>{change.label}</time><h2>{change.title}</h2><ul>{change.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></div><SiteFooter/></main>;
}
