import Link from "next/link";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { guides } from "./lib/guides";
import { tools } from "./lib/tools";
import { topics } from "./lib/topics";

export default function Home() {
  const featuredGuideSlugs = ["dimensional-weight-carrier-divisors", "standard-pallet-sizes-carton-fit", "calculate-lcl-wm-multiple-cartons", "lcl-minimum-charges-local-fees"];
  const featuredGuides = featuredGuideSlugs.map((slug) => guides.find((guide) => guide.slug === slug)).filter((guide): guide is (typeof guides)[number] => Boolean(guide));
  const priorityToolSlugs = ["pallet-load-calculator", "dimensional-weight-calculator", "cbm-calculator", "lcl-chargeable-volume-calculator", "landed-cost-calculator"];
  const priorityTools = priorityToolSlugs.map((slug) => tools.find((tool) => tool.slug === slug)).filter((tool): tool is (typeof tools)[number] => Boolean(tool));
  return (
    <main>
      <SiteHeader />

      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">20 packaging &amp; freight calculators</p>
          <h1>Calculate shipping weight,<br />capacity, and cost.</h1>
          <p className="hero-lede">
            Enter carton, pallet, shipment, or cost details and see the result immediately.
            Use the included presets for dimensional weight, pallet size, LCL W/M,
            landed cost, and more.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/tools/dimensional-weight-calculator">
              Calculate dimensional weight <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="/freight-planner">Freight planner →</Link>
            <a className="text-link" href="#all-tools">All 20 calculators</a>
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
          <div><strong>20</strong><span>shipping calculators</span></div>
          <div><strong>{guides.length}</strong><span>worked guides</span></div>
          <div><strong>Instant</strong><span>results as you type</span></div>
          <p>Use the result while checking a quote, packing plan, or shipment.</p>
        </div>
      </section>

      <section className="tools-section shell" aria-labelledby="popular-calculators">
        <div className="section-heading">
          <div><p className="eyebrow">Common calculations</p><h2 id="popular-calculators">Start with the number<br />you need.</h2></div>
          <p>Calculate pallet capacity, dimensional weight, shipment volume, LCL chargeable volume, or landed cost.</p>
        </div>
        <div className="tool-grid">
          {priorityTools.map((tool, index) => <Link className="tool-card" href={`/tools/${tool.slug}`} key={tool.slug}><div className="tool-card-top"><span className="tool-number">0{index + 1}</span><span className="tool-arrow" aria-hidden="true">↗</span></div><div><p className="tool-kicker">{tool.category}</p><h3>{tool.shortTitle}</h3><p>{tool.description}</p></div><span className="tool-tag">{tool.tag}</span></Link>)}
        </div>
      </section>

      <section className="tools-section shell" id="all-tools">
        <div className="section-heading">
          <div>
            <p className="eyebrow">All calculators</p>
            <h2>Choose a calculation.<br />Enter your shipment details.</h2>
          </div>
          <p>Each tool shows the formula, important limits, and a result you can copy or print.</p>
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

      <section className="home-guides shell">
        <div className="section-heading">
          <div><p className="eyebrow">Examples and guides</p><h2>Measure correctly.<br/>Check the result.</h2></div>
          <p>Use worked examples for carrier divisors, pallet sizes, LCL quotes, measurements, and common errors.</p>
        </div>
        <div className="home-guide-grid">{featuredGuides.map((guide)=><Link href={`/guides/${guide.slug}`} key={guide.slug}><span>{guide.category} · {guide.readTime}</span><h3>{guide.title}</h3><p>{guide.description}</p></Link>)}</div>
        <Link className="text-link collection-link" href="/guides">Browse all {guides.length} guides ↗</Link>
      </section>

      <section className="home-topics shell">
        <div className="section-heading"><div><p className="eyebrow">Freight topics</p><h2>Formula, example,<br/>and calculator together.</h2></div><p>Each topic explains the calculation, shows a worked example, and links to the relevant tool and source.</p></div>
        <div className="topic-card-grid">{topics.map((topic)=><Link href={`/topics/${topic.slug}`} key={topic.slug}><span>{topic.category}</span><h3>{topic.title}</h3><p>{topic.description}</p><strong>Open topic reference ↗</strong></Link>)}</div>
      </section>

      <section className="network-band">
        <div className="shell network-band-inner">
          <div><p className="eyebrow">Tax calculations</p><h2>Need to calculate VAT or sales tax?</h2><p>TaxMathKit calculates sales tax, reverse tax, VAT, federal income tax, 1099 tax, and capital gains.</p></div>
          <a className="button button-primary" href="https://taxmathkit.com/?utm_source=shipmathlab&utm_medium=referral&utm_campaign=tool-network">Open tax calculators <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="home-product"><div className="shell home-product-grid"><div><p className="eyebrow eyebrow-light">FreightKit Operations Workbook</p><h2>Run several shipments<br/>in one workbook.</h2><p>Batch DIM checks, compare freight quotes, plan pallets, and calculate landed cost and ecommerce margin in an editable Excel file.</p></div><div className="home-product-buy"><strong>$19</strong><span>one-time · no subscription</span><Link className="button button-acid" href="/resources#spreadsheet-pack">See the workbook ↗</Link></div></div></section>

      <section className="workflow-section">
        <div className="shell workflow-grid">
          <div>
            <p className="eyebrow eyebrow-light">How to use a calculator</p>
            <h2>Enter, check,<br />and copy.</h2>
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
