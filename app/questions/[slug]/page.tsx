import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calculator } from "../../components/Calculator";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { freightQuestions, getFreightQuestion } from "../../lib/freight-questions";

export function generateStaticParams() { return freightQuestions.map((question) => ({ slug: question.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const question = getFreightQuestion(slug); if (!question) return {};
  return { title: question.title, description: question.description, alternates: { canonical: `/questions/${question.slug}` }, openGraph: { title: `${question.title} | ShipMathLab`, description: question.description } };
}

export default async function QuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const question = getFreightQuestion(slug); if (!question) notFound();
  const structuredData = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: question.title, acceptedAnswer: { "@type": "Answer", text: question.answer } }] };
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /><SiteHeader /><div className="shell breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/questions">Questions</Link><span>/</span><span>{question.toolLabel}</span></div><article className="shell question-page"><header className="question-hero"><p className="eyebrow">Direct freight answer · reviewed August 2026</p><h1>{question.title}</h1><p className="article-deck">{question.description}</p><div className="question-answer"><strong>Short answer</strong><p>{question.answer}</p></div></header><section className="question-calculator"><div className="section-heading compact"><div><p className="eyebrow">Run the numbers</p><h2>{question.toolLabel}</h2></div><p>Start with the prefilled example, then replace it with your finished package, pallet, or cargo lines.</p></div><Calculator slug={question.tool} /></section><section className="question-content"><p className="eyebrow">A defensible workflow</p><h2>Check these four things before you trust the result.</h2><ol>{question.steps.map((step) => <li key={step}>{step}</li>)}</ol></section><section className="question-related"><p className="eyebrow">Go deeper</p><div className="tool-guide-grid">{question.related.map((href) => <Link className="guide-card" href={href} key={href}><h3>{href.split("/").pop()?.replaceAll("-", " ")}</h3><p>Open the related ShipMathLab reference and keep the assumptions visible.</p><strong>Continue →</strong></Link>)}</div></section></article><SiteFooter /></main>;
}
