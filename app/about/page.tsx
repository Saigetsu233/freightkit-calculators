import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = { title: "About", description: "Why FreightKit exists and how to use its free packaging calculators." };

export default function AboutPage() {
  return <main><SiteHeader/><article className="shell legal-page"><p className="updated">About FreightKit</p><h1>Useful answers, visible working.</h1><p>FreightKit is a focused collection of free calculators for people who quote, pack, store, and ship physical products. It turns recurring packaging maths into quick, readable estimates.</p><h2>What we optimise for</h2><p>Each tool starts with a practical decision, uses a transparent formula, and states the assumptions that can change the answer. Inputs stay in your browser; an account is not required.</p><h2>What FreightKit is not</h2><p>These tools are planning aids. They do not replace a current carrier quotation, supplier drawing, structural assessment, customs advice, or a safe-loading review. Equipment and contract rules vary, so verify critical numbers before committing money or cargo.</p><h2>Corrections</h2><p>Packaging rules change and even simple calculators can contain mistakes. Before public launch, a dedicated contact address should be added here for corrections and requests.</p></article><SiteFooter/></main>;
}
