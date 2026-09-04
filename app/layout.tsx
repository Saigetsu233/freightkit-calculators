import type { Metadata } from "next";
import { headers } from "next/headers";
import { Analytics } from "./components/Analytics";
import { LocaleAutoSwitch } from "./components/LocaleRouting";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "localhost:3000";
  const protocol = headerStore.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = `${protocol}://${host}`;

  return {
    metadataBase: new URL(base),
    title: {
      default: "ShipMathLab — Free Freight, CBM & Pallet Calculators",
      template: "%s | ShipMathLab",
    },
    description:
      "Twenty free freight, CBM, dimensional-weight, pallet-loading, landed-cost, warehouse, and shipping calculators with visible formulas.",
    applicationName: "ShipMathLab",
    keywords: [
      "dimensional weight calculator",
      "CBM calculator",
      "pallet calculator",
      "shipping calculator",
      "packaging tools",
    ],
    verification: {
      google: "NyUKa8vAgyDXfVy6b7JdSnifHTCoSMHJIlmDToOIETM",
      other: {
        "msvalidate.01": "EE39BE120044E7CAB9E9F93ABD6EACF6",
      },
    },
    openGraph: {
      type: "website",
      siteName: "ShipMathLab",
      title: "ShipMathLab — Freight and packaging math, without the spreadsheet.",
      description: "Twenty free calculators and practical guides for packaging, ecommerce, warehouse, and freight teams.",
      url: base,
      images: [{ url: `${base}/og-ranking-v2.png`, width: 1536, height: 1024, alt: "ShipMathLab freight math calculators for CBM, pallets, dimensional weight, and landed cost" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "ShipMathLab — Freight and packaging math, without the spreadsheet.",
      description: "Twenty free calculators and practical guides for packaging, ecommerce, warehouse, and freight teams.",
      images: [`${base}/og-ranking-v2.png`],
    },
  };
}

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ShipMathLab",
    url: "https://shipmathlab.com",
    description: "Independent freight and packaging calculator website with transparent formulas and source trails.",
    founder: { "@type": "Person", name: "Saigetsu233" },
    sameAs: ["https://github.com/Saigetsu233/freightkit-calculators"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ShipMathLab",
    alternateName: "FreightKit",
    url: "https://shipmathlab.com",
    description: "Free freight, CBM, dimensional-weight, pallet-loading, and landed-cost calculators.",
    publisher: { "@type": "Organization", name: "ShipMathLab", url: "https://shipmathlab.com" },
  },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}<LocaleAutoSwitch /><Analytics /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /></body>
    </html>
  );
}
