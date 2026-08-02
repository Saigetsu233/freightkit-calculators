import Link from "next/link";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { tools } from "./lib/tools";

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">Free packaging &amp; freight calculators</p>
          <h1>Packaging math,<br />without the spreadsheet.</h1>
          <p className="hero-lede">
            Ten practical calculators for ecommerce, warehouse, and freight teams.
            Check dimensional weight, carton fit, pallet loads, shipping cost, and
            margin—in seconds.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/tools/dimensional-weight-calculator">
              Calculate dimensional weight <span aria-hidden="true">↗</span>
            </Link>
            <a className="text-link" href="#all-tools">Browse all 10 tools</a>
          </div>
          <div className="trust-row" aria-label="Product qualities">
            <span>No sign-up</span><span>Runs in your browser</span><span>Clear formulas</span>
          </div>
        </div>

        <div className="hero-demo" aria-label="Example dimensional weight calculation">
          <div className="demo-topline"><span>DIM WEIGHT</span><span>METRIC · ÷5000</span></div>
          <div className="parcel-visual" aria-hidden="true">
            <span className="measure measure-top">40 cm</span>
            <span className="measure measure-side">25 cm</span>
            <span className="measure measure-front">30 cm</span>
            <div className="parcel-face parcel-front" />
            <div className="parcel-face parcel-side" />
            <div className="parcel-face parcel-top" />
          </div>
          <div className="demo-equation">
            <span>40 × 30 × 25</span><span>÷ 5,000</span>
          </div>
          <div className="demo-answer"><span>Chargeable weight</span><strong>6.00 kg</strong></div>
        </div>
      </section>

      <section className="signal-strip">
        <div className="shell signal-grid">
          <div><strong>10</strong><span>focused calculators</span></div>
          <div><strong>3</strong><span>unit systems covered</span></div>
          <div><strong>0</strong><span>accounts required</span></div>
          <p>Built for quick estimates before you quote, pack, or ship.</p>
        </div>
      </section>

      <section className="tools-section shell" id="all-tools">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The working set</p>
            <h2>Pick a calculation.<br />Get a useful answer.</h2>
          </div>
          <p>Every tool includes the formula, assumptions, and a copyable result. No hidden spreadsheet logic.</p>
        </div>

        <div className="tool-grid">
          {tools.map((tool, index) => (
            <Link className="tool-card" href={`/tools/${tool.slug}`} key={tool.slug}>
              <div className="tool-card-top">
                <span className="tool-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="tool-arrow" aria-hidden="true">↗</span>
              </div>
              <div>
                <p className="tool-kicker">{tool.category}</p>
                <h3>{tool.shortTitle}</h3>
                <p>{tool.description}</p>
              </div>
              <span className="tool-tag">{tool.tag}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="workflow-section">
        <div className="shell workflow-grid">
          <div>
            <p className="eyebrow eyebrow-light">Why FreightKit</p>
            <h2>Fast enough for a call.<br />Clear enough for a quote.</h2>
          </div>
          <ol className="workflow-list">
            <li><span>01</span><div><strong>Enter the known numbers</strong><p>Use your carton, pallet, carrier, and cost inputs.</p></div></li>
            <li><span>02</span><div><strong>See the working</strong><p>We show the formula and assumptions behind the estimate.</p></div></li>
            <li><span>03</span><div><strong>Copy the result</strong><p>Drop a clean summary into your quote, email, or worksheet.</p></div></li>
          </ol>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
