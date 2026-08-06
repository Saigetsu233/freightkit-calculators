import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { getGuide, guides } from "../../lib/guides";
import { getTool } from "../../lib/tools";

export function generateStaticParams() { return guides.map((guide)=>({slug:guide.slug})); }

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params; const guide=getGuide(slug); if(!guide)return{}; return {title:guide.title,description:guide.description,alternates:{canonical:`/guides/${guide.slug}`}};}

export default async function GuidePage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const guide=getGuide(slug); if(!guide)notFound(); const tool=getTool(guide.relatedTool);
  const structuredData={"@context":"https://schema.org","@type":"Article",headline:guide.title,description:guide.description,dateModified:"2026-08-06",mainEntityOfPage:`https://shipmathlab.com/guides/${guide.slug}`,author:{"@type":"Organization",name:"ShipMathLab",url:"https://shipmathlab.com"},publisher:{"@type":"Organization",name:"ShipMathLab",url:"https://shipmathlab.com"}};
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,"\\u003c")}}/><SiteHeader/><div className="shell breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/guides">Guides</Link><span>/</span><span>{guide.category}</span></div><article className="shell article"><header><p className="eyebrow">{guide.category} · {guide.readTime} · reviewed August 2026</p><h1>{guide.title}</h1><p className="article-deck">{guide.description}</p><div className="takeaway"><strong>Bottom line</strong><p>{guide.takeaway}</p></div></header><div className="article-body">{guide.sections.map((section)=><section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}{section.bullets?<ul>{section.bullets.map((item)=><li key={item}>{item}</li>)}</ul>:null}</section>)}<section className="checklist"><h2>Working checklist</h2><ul>{guide.checklist.map((item)=><li key={item}>✓ {item}</li>)}</ul></section>{guide.sources?.length?<section className="source-list"><h2>Useful primary references</h2>{guide.sources.map((source)=><a key={source.url} href={source.url} rel="noopener noreferrer" target="_blank">{source.label} ↗</a>)}</section>:null}</div><aside className="article-cta"><div><p className="eyebrow">Put it to work</p><h2>{tool?.title}</h2><p>{tool?.description}</p></div><Link className="button button-primary" href={`/tools/${guide.relatedTool}`}>Open the free calculator ↗</Link></aside></article><SiteFooter/></main>;
}
