"use client";

import { useState } from "react";

export function EmbedPanel({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const code = `<iframe src="https://shipmathlab.com/embed/${slug}" title="${title}" width="100%" height="820" loading="lazy" style="border:0"></iframe>`;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="shell embed-panel">
      <div>
        <p className="eyebrow">Free to embed</p>
        <h2>Put this calculator on your site.</h2>
        <p>Paste one iframe into a logistics article, supplier portal, or internal knowledge base. The calculator stays hosted and updated by ShipMathLab.</p>
      </div>
      <div className="embed-code-block">
        <code>{code}</code>
        <div className="embed-actions">
          <button type="button" className="button button-primary" onClick={copyCode}>{copied ? "Embed code copied ✓" : "Copy embed code"}</button>
          <a className="text-link" href="https://github.com/Saigetsu233/freightkit-calculators" target="_blank" rel="noopener noreferrer">Formula source on GitHub ↗</a>
        </div>
      </div>
    </section>
  );
}
