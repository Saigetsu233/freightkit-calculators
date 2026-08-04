import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="FreightKit home">
          <span className="brand-mark" aria-hidden="true">FK</span>
          <span>FreightKit</span>
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          <Link href="/#all-tools">All tools</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/resources">Resources</Link>
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
            <span className="brand-mark" aria-hidden="true">FK</span>
            <span>FreightKit</span>
          </Link>
          <p className="footer-statement">Useful packaging decisions start with transparent math.</p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link href="/#all-tools">All calculators</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/resources">Workbook &amp; resources</Link>
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <a href="https://github.com/Xenera-jiangchengzhi/freightkit-calculators" target="_blank" rel="noopener noreferrer">Open-source formulas</a>
          <Link href="/tools/cbm-calculator">CBM calculator</Link>
          <Link href="/tools/pallet-load-calculator">Pallet calculator</Link>
          <Link href="/tools/ecommerce-margin-calculator">Margin calculator</Link>
        </nav>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} FreightKit</span>
        <span>Planning estimates only. Verify critical figures with your carrier or supplier.</span>
      </div>
    </footer>
  );
}
