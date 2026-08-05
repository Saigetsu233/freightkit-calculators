import type { Metadata } from "next";
import { headers } from "next/headers";
import { Analytics } from "./components/Analytics";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "localhost:3000";
  const protocol = headerStore.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = `${protocol}://${host}`;

  return {
    metadataBase: new URL(base),
    title: {
      default: "FreightKit — Free Packaging & Freight Calculators",
      template: "%s | FreightKit",
    },
    description:
      "Twenty free packaging, freight, warehouse, inventory, landed-cost, and ecommerce margin calculators.",
    applicationName: "FreightKit",
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
      siteName: "FreightKit",
      title: "FreightKit — Packaging math, without the spreadsheet.",
      description: "Twenty free calculators and practical guides for packaging, ecommerce, warehouse, and freight teams.",
      url: base,
      images: [{ url: `${base}/og.png`, width: 1200, height: 630, alt: "FreightKit packaging calculators" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "FreightKit — Packaging math, without the spreadsheet.",
      description: "Twenty free calculators and practical guides for packaging, ecommerce, warehouse, and freight teams.",
      images: [`${base}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}<Analytics /></body>
    </html>
  );
}
