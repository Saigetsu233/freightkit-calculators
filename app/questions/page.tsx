import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { freightQuestions } from "../lib/freight-questions";

export const metadata: Metadata = {
  title: "Freight Questions — Direct Answers with Calculators",
  description: "Answer-first guides for dimensional weight, pallet loading, LCL W/M, and freight quote decisions.",
  alternates: { canonical: "/questions" },
};

export default function QuestionsPage() {
  return <main><SiteHeader /><div className="shell breadcrumb"><Link href="/">Home</Link><span>/</span><span>Questions</span></div><section className="shell content-page"><p className="eyebrow">Search the situation, then run the math</p><h1>Freight answers for the decision in front of you.</h1><p className="article-deck">These pages use the wording operators, shippers, and warehouse teams use when they need an answer—not only the name of a calculator. Each one gives a short rule, a worked path, and a direct tool.</p><div className="question-card-grid">{freightQuestions.map((question) => <Link className="question-card" href={`/questions/${question.slug}`} key={question.slug}><span className="eyebrow">{question.toolLabel}</span><h2>{question.title}</h2><p>{question.description}</p><strong>Read and calculate →</strong></Link>)}</div></section><SiteFooter /></main>;
}
