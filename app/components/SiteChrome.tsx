import Link from "next/link";
import { LocaleMenu } from "./LocaleRouting";
import { localizedFreightPaths, type SiteLocale } from "../lib/locales";

const chromeText: Record<SiteLocale, {
  navigation: string;
  calculator: string;
  planner: string;
  questions: string;
  guides: string;
  resources: string;
  method: string;
  start: string;
  statement: string;
  disclaimer: string;
}> = {
  en: { navigation: "Primary navigation", calculator: "All tools", planner: "Freight planner", questions: "Questions", guides: "Guides", resources: "Resources", method: "Method", start: "Start calculating", statement: "Calculators for packaging, pallets, freight, landed cost, and ecommerce margin.", disclaimer: "Planning estimates only. Verify critical figures with your carrier or supplier." },
  nl: { navigation: "Hoofdnavigatie", calculator: "Laadmeter", planner: "Vrachtplanner", questions: "Vragen (EN)", guides: "Gidsen (EN)", resources: "Bronnen (EN)", method: "Methode (EN)", start: "Bereken nu", statement: "Directe berekeningen voor pallets, laadmeters, volume, gewicht en vrachtkosten.", disclaimer: "Alleen voor planning. Controleer belangrijke waarden bij uw vervoerder of leverancier." },
  de: { navigation: "Hauptnavigation", calculator: "Lademeter", planner: "Frachtplaner", questions: "Fragen (EN)", guides: "Ratgeber (EN)", resources: "Quellen (EN)", method: "Methode (EN)", start: "Jetzt berechnen", statement: "Direkte Berechnungen für Paletten, Lademeter, Volumen, Gewicht und Frachtkosten.", disclaimer: "Nur zur Planung. Kritische Werte beim Frachtführer oder Lieferanten prüfen." },
  fr: { navigation: "Navigation principale", calculator: "Mètres de plancher", planner: "Planificateur", questions: "Questions (EN)", guides: "Guides (EN)", resources: "Ressources (EN)", method: "Méthode (EN)", start: "Calculer", statement: "Calculs directs pour palettes, espace de chargement, volume, poids et fret.", disclaimer: "Estimations de planification. Vérifiez les valeurs critiques auprès du transporteur ou fournisseur." },
  ja: { navigation: "メインナビゲーション", calculator: "荷台長計算", planner: "輸送プランナー", questions: "質問 (英語)", guides: "ガイド (英語)", resources: "資料 (英語)", method: "計算方法 (英語)", start: "計算する", statement: "パレット、荷台スペース、容積、重量、輸送費をすぐに計算できます。", disclaimer: "計画用の概算です。重要な値は運送会社・仕入先に確認してください。" },
  zh: { navigation: "主导航", calculator: "车厢长度", planner: "货运规划", questions: "问答（英文）", guides: "指南（英文）", resources: "资料（英文）", method: "方法（英文）", start: "开始计算", statement: "快速计算托盘、车厢空间、体积、重量和货运成本。", disclaimer: "结果仅供规划。关键数值请向承运商或供应商确认。" },
};

export function SiteHeader({ locale = "en" }: { locale?: SiteLocale }) {
  const text = chromeText[locale];
  const regional = locale !== "en";
  const calculatorHref = regional ? `${localizedFreightPaths[locale]}#calculator` : "/#all-tools";
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="ShipMathLab home">
          <span className="brand-mark" aria-hidden="true">SM</span>
          <span>ShipMathLab</span>
        </Link>
        <nav className="site-nav" aria-label={text.navigation}>
          <Link href={calculatorHref}>{text.calculator}</Link>
          <Link href="/freight-planner">{text.planner}</Link>
          <Link href="/questions">{text.questions}</Link>
          <Link href="/guides">{text.guides}</Link>
          <Link href="/resources">{text.resources}</Link>
          <Link href="/embed">Embed</Link>
          <Link href="/methodology">{text.method}</Link>
          <LocaleMenu current={locale} />
          <Link className="nav-pill" href={regional ? `${localizedFreightPaths[locale]}#calculator` : "/tools/dimensional-weight-calculator"}>{text.start}</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({ locale = "en" }: { locale?: SiteLocale }) {
  const text = chromeText[locale];
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div>
          <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">SM</span><span>ShipMathLab</span></Link>
          <p className="footer-statement">{text.statement}</p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link href={locale === "en" ? "/#all-tools" : localizedFreightPaths[locale]}>{text.calculator}</Link>
          <Link href="/guides">Guides</Link><Link href="/resources">Workbook &amp; resources</Link><Link href="/resources/for-publishers">Publisher &amp; embed kit</Link><Link href="/about">About</Link><Link href="/methodology">Method &amp; sources</Link><Link href="/changelog">Version log</Link><Link href="/privacy">Privacy</Link>
          <a href="https://github.com/Saigetsu233/freightkit-calculators" target="_blank" rel="noopener noreferrer">Open-source formulas</a>
          <Link href="/tools/cbm-calculator">CBM calculator</Link><Link href="/tools/pallet-load-calculator">Pallet calculator</Link><Link href="/tools/ecommerce-margin-calculator">Margin calculator</Link>
        </nav>
      </div>
      <div className="shell footer-bottom"><span>© {new Date().getFullYear()} ShipMathLab</span><span>{text.disclaimer}</span></div>
    </footer>
  );
}
