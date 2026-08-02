import Link from "next/link";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";

export default function NotFound() {
  return <main><SiteHeader/><section className="shell legal-page"><p className="updated">404 — Missing parcel</p><h1>This page didn’t make the shipment.</h1><p>The calculator or page you requested could not be found.</p><p><Link className="button button-primary" href="/">Return to all tools</Link></p></section><SiteFooter/></main>;
}
