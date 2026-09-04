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
  embed: string;
  method: string;
  start: string;
  statement: string;
  disclaimer: string;
  footerNavigation: string;
  workbook: string;
  publisherKit: string;
  about: string;
  versionLog: string;
  privacy: string;
  openSource: string;
  cbm: string;
  pallet: string;
  margin: string;
}> = {
  en: { navigation: "Primary navigation", calculator: "All tools", planner: "Freight planner", questions: "Questions", guides: "Guides", resources: "Resources", embed: "Embed", method: "Method", start: "Start calculating", statement: "Calculators for packaging, pallets, freight, landed cost, and ecommerce margin.", disclaimer: "Planning estimates only. Verify critical figures with your carrier or supplier.", footerNavigation: "Footer navigation", workbook: "Workbook & resources", publisherKit: "Publisher & embed kit", about: "About", versionLog: "Version log", privacy: "Privacy", openSource: "Open-source formulas", cbm: "CBM calculator", pallet: "Pallet calculator", margin: "Margin calculator" },
  nl: { navigation: "Hoofdnavigatie", calculator: "Laadmeter", planner: "Vrachtplanner (EN)", questions: "Vragen (EN)", guides: "Gidsen (EN)", resources: "Bronnen (EN)", embed: "Insluiten (EN)", method: "Methode (EN)", start: "Bereken nu", statement: "Directe berekeningen voor pallets, laadmeters, volume, gewicht en vrachtkosten.", disclaimer: "Alleen voor planning. Controleer belangrijke waarden bij uw vervoerder of leverancier.", footerNavigation: "Voeternavigatie", workbook: "Werkboek en bronnen (EN)", publisherKit: "Uitgevers- en insluitkit (EN)", about: "Over ShipMathLab (EN)", versionLog: "Versielog (EN)", privacy: "Privacy (EN)", openSource: "Open-sourceformules", cbm: "CBM-calculator (EN)", pallet: "Palletcalculator (EN)", margin: "Margincalculator (EN)" },
  de: { navigation: "Hauptnavigation", calculator: "Lademeter", planner: "Frachtplaner (EN)", questions: "Fragen (EN)", guides: "Ratgeber (EN)", resources: "Quellen (EN)", embed: "Einbetten (EN)", method: "Methode (EN)", start: "Jetzt berechnen", statement: "Direkte Berechnungen für Paletten, Lademeter, Volumen, Gewicht und Frachtkosten.", disclaimer: "Nur zur Planung. Kritische Werte beim Frachtführer oder Lieferanten prüfen.", footerNavigation: "Fußnavigation", workbook: "Arbeitsmappe und Quellen (EN)", publisherKit: "Publisher- und Einbettungskit (EN)", about: "Über ShipMathLab (EN)", versionLog: "Versionsprotokoll (EN)", privacy: "Datenschutz (EN)", openSource: "Open-Source-Formeln", cbm: "CBM-Rechner (EN)", pallet: "Palettenrechner (EN)", margin: "Margenrechner (EN)" },
  fr: { navigation: "Navigation principale", calculator: "Mètres de plancher", planner: "Planificateur (EN)", questions: "Questions (EN)", guides: "Guides (EN)", resources: "Ressources (EN)", embed: "Intégrer (EN)", method: "Méthode (EN)", start: "Calculer", statement: "Calculs directs pour palettes, espace de chargement, volume, poids et fret.", disclaimer: "Estimations de planification. Vérifiez les valeurs critiques auprès du transporteur ou fournisseur.", footerNavigation: "Navigation de pied de page", workbook: "Classeur et ressources (EN)", publisherKit: "Kit éditeur et intégration (EN)", about: "À propos de ShipMathLab (EN)", versionLog: "Historique des versions (EN)", privacy: "Confidentialité (EN)", openSource: "Formules open source", cbm: "Calculateur CBM (EN)", pallet: "Calculateur de palettes (EN)", margin: "Calculateur de marge (EN)" },
  ja: { navigation: "メインナビゲーション", calculator: "荷台長計算", planner: "輸送プランナー（英語）", questions: "質問（英語）", guides: "ガイド（英語）", resources: "資料（英語）", embed: "埋め込み（英語）", method: "計算方法（英語）", start: "計算する", statement: "パレット、荷台スペース、容積、重量、輸送費をすぐに計算できます。", disclaimer: "計画用の概算です。重要な値は運送会社・仕入先に確認してください。", footerNavigation: "フッターナビゲーション", workbook: "ワークブック・資料（英語）", publisherKit: "埋め込みキット（英語）", about: "ShipMathLabについて（英語）", versionLog: "更新履歴（英語）", privacy: "プライバシー（英語）", openSource: "オープンソースの計算式", cbm: "CBM計算（英語）", pallet: "パレット計算（英語）", margin: "粗利計算（英語）" },
  zh: { navigation: "主导航", calculator: "车厢长度", planner: "货运规划（英文）", questions: "问答（英文）", guides: "指南（英文）", resources: "资料（英文）", embed: "嵌入（英文）", method: "计算方法（英文）", start: "开始计算", statement: "快速计算托盘、车厢空间、体积、重量和货运成本。", disclaimer: "结果仅供规划。关键数值请向承运商或供应商确认。", footerNavigation: "页脚导航", workbook: "工作簿与资料（英文）", publisherKit: "发布者与嵌入工具包（英文）", about: "关于 ShipMathLab（英文）", versionLog: "版本记录（英文）", privacy: "隐私（英文）", openSource: "开源公式", cbm: "CBM 计算器（英文）", pallet: "托盘计算器（英文）", margin: "利润率计算器（英文）" },
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
          <Link href="/embed">{text.embed}</Link>
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
        <nav className="footer-links" aria-label={text.footerNavigation}>
          <Link href={locale === "en" ? "/#all-tools" : localizedFreightPaths[locale]}>{text.calculator}</Link>
          <Link href="/guides">{text.guides}</Link><Link href="/resources">{text.workbook}</Link><Link href="/resources/for-publishers">{text.publisherKit}</Link><Link href="/about">{text.about}</Link><Link href="/methodology">{text.method}</Link><Link href="/changelog">{text.versionLog}</Link><Link href="/privacy">{text.privacy}</Link>
          <a href="https://github.com/Saigetsu233/freightkit-calculators" target="_blank" rel="noopener noreferrer">{text.openSource}</a>
          <Link href="/tools/cbm-calculator">{text.cbm}</Link><Link href="/tools/pallet-load-calculator">{text.pallet}</Link><Link href="/tools/ecommerce-margin-calculator">{text.margin}</Link>
        </nav>
      </div>
      <div className="shell footer-bottom"><span>© {new Date().getFullYear()} ShipMathLab</span><span>{text.disclaimer}</span></div>
    </footer>
  );
}
