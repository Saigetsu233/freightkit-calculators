import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { getGuide } from "../../lib/guides";
import { getTool } from "../../lib/tools";
import { getTopic, topics } from "../../lib/topics";

export function generateStaticParams() {
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return {};
  return {
    title: topic.title,
    description: topic.description,
    alternates: { canonical: `/topics/${topic.slug}` },
    openGraph: { title: `${topic.title} | FreightKit`, description: topic.description },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();
  const tool = getTool(topic.relatedTool);
  const relatedGuides = topic.guideSlugs.map(getGuide).filter((guide): guide is NonNullable<typeof guide> => Boolean(guide));
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: topic.title,
        description: topic.description,
        url: `https://shipmathlab.com/topics/${topic.slug}`,
        dateModified: "2026-08-05",
        isPartOf: { "@type": "WebSite", name: "ShipMathLab", url: "https://shipmathlab.com" },
      },
      {
        "@type": "FAQPage",
        mainEntity: topic.questions.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <SiteHeader />
      <div className="shell breadcrumb"><Link href="/">Home</Link><span>/</span><span>{topic.category}</span></div>
      <article className="shell topic-page">
        <header className="topic-hero">
          <div><p className="eyebrow">Topic reference · reviewed August 2026</p><h1>{topic.title}</h1><p className="article-deck">{topic.description}</p></div>
          <div className="topic-answer"><strong>Quick answer</strong><p>{topic.quickAnswer}</p></div>
        </header>
        <section className="topic-method">
          <div><p className="eyebrow">Core method</p><h2>The formula</h2><div className="formula-box">{topic.formula}</div></div>
          <div><p className="eyebrow">Worked example</p><h2>Put numbers through it</h2><p>{topic.workedExample}</p></div>
        </section>
        <section className="topic-tool-cta">
          <div><p className="eyebrow">Calculate your shipment</p><h2>{tool?.title}</h2><p>{tool?.intro}</p></div>
          <Link className="button button-primary" href={`/tools/${topic.relatedTool}`}>Open the free calculator ↗</Link>
        </section>
        <section className="topic-questions">
          <div className="section-heading"><div><p className="eyebrow">Common questions</p><h2>Answers you can verify.</h2></div><p>Each answer states the planning rule and points to the longer working guide when the decision needs more context.</p></div>
          <div className="topic-question-grid">{topic.questions.map((item) => <article key={item.question}><h3>{item.question}</h3><p>{item.answer}</p>{item.guide ? <Link href={`/guides/${item.guide}`}>Read the worked guide ↗</Link> : null}</article>)}</div>
        </section>
        <section className="topic-guides"><p className="eyebrow">Supporting guides</p><h2>Go from formula to operating decision.</h2><div className="tool-guide-grid">{relatedGuides.map((guide) => <Link href={`/guides/${guide.slug}`} key={guide.slug}><span>{guide.readTime}</span><strong>{guide.title} ↗</strong><p>{guide.description}</p></Link>)}</div></section>
        <section className="topic-sources"><h2>Primary references</h2><p>Public references are starting points. Your current contract, tariff, equipment specification, and operating procedure control the final decision.</p>{topic.sources.map((source) => <a href={source.url} key={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}</section>
      </article>
      <SiteFooter />
    </main>
  );
}
