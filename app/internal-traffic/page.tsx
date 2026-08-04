import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { InternalTrafficControl } from "./InternalTrafficControl";

export const metadata: Metadata = {
  title: "Internal traffic control | FreightKit",
  robots: { index: false, follow: false },
};

export default function InternalTrafficPage() {
  return (
    <main>
      <SiteHeader />
      <div className="shell internal-page">
        <InternalTrafficControl />
      </div>
      <SiteFooter />
    </main>
  );
}
