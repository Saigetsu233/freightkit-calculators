import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact ShipMathLab about calculator corrections, privacy, partnerships, or accessibility.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main>
      <SiteHeader />
      <article className="shell legal-page">
        <p className="updated">Contact ShipMathLab</p>
        <h1>Questions, corrections, and partnerships.</h1>
        <p>ShipMathLab is an independently maintained calculator project. The public issue tracker is the fastest way to report a reproducible calculator problem or ask a site question.</p>
        <h2>Calculator corrections</h2>
        <p>Include the calculator URL, your inputs, the result you expected, and a current carrier, standards-body, or other primary source when possible.</p>
        <p><a href="https://github.com/Saigetsu233/freightkit-calculators/issues/new" target="_blank" rel="noopener noreferrer">Open a GitHub issue</a></p>
        <h2>Privacy and advertising</h2>
        <p>Use the same issue tracker for privacy questions, advertising concerns, or requests related to site data. Do not include private shipment, customer, payment, or account information in a public issue.</p>
        <h2>Embedding and partnerships</h2>
        <p>For calculator embedding, educational use, or a relevant partnership, describe the intended site, audience, and calculator in the issue. Unrelated link-exchange requests are not accepted.</p>
      </article>
      <SiteFooter />
    </main>
  );
}
