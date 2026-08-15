import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="ShipMathLab home">
          <span className="brand-mark" aria-hidden="true">SM</span>
          <span>ShipMathLab</span>
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          <Link href="/#all-tools">All tools</Link>
          <Link href="/freight-planner">Freight planner</Link>
          <Link href="/questions">Questions</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/resources">Resources</Link>
          <Link href="/embed">Embed</Link>
          <Link href="/methodology">Method</Link>
          <Link className="nav-pill" href="/tools/dimensional-weight-calculator">Start calculating</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div>
          <Link className="brand" href="/">
            <span className="brand-mark" aria-hidden="true">SM</span>
            <span>ShipMathLab</span>
          </Link>
          <p className="footer-statement">Calculators for packaging, pallets, freight, landed cost, and ecommerce margin.</p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link href="/#all-tools">All calculators</Link>
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
        <span>Planning estimates only. Verify critical figures with your carrier or supplier.</span>
      </div>
    </footer>
  );
}
