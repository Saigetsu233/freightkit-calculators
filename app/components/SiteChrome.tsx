import Link from "next/link";
import { LocaleMenu } from "./LocaleRouting";
import { localizedFreightPaths, type SiteLocale } from "../lib/locales";
import { localizedHubPaths } from "../lib/regional-hubs";

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
  nl: { navigation: "Hoofdnavigatie", calculator: "Laadmeter", planner: "Vrachtplanner", questions: "Vragen", guides: "Gidsen", resources: "Bronnen", embed: "Insluiten", method: "Methode", start: "Bereken nu", statement: "Directe berekeningen voor pallets, laadmeters, volume, gewicht en vrachtkosten.", disclaimer: "Alleen voor planning. Controleer belangrijke waarden bij uw vervoerder of leverancier.", footerNavigation: "Voeternavigatie", workbook: "Werkboek en bronnen", publisherKit: "Uitgevers- en insluitkit", about: "Over ShipMathLab", versionLog: "Versielog", privacy: "Privacy", openSource: "Open-sourceformules", cbm: "CBM-calculator", pallet: "Palletcalculator", margin: "Margincalculator" },
  de: { navigation: "Hauptnavigation", calculator: "Lademeter", planner: "Frachtplaner", questions: "Fragen", guides: "Ratgeber", resources: "Quellen", embed: "Einbetten", method: "Methode", start: "Jetzt berechnen", statement: "Direkte Berechnungen für Paletten, Lademeter, Volumen, Gewicht und Frachtkosten.", disclaimer: "Nur zur Planung. Kritische Werte beim Frachtführer oder Lieferanten prüfen.", footerNavigation: "Fußnavigation", workbook: "Arbeitsmappe und Quellen", publisherKit: "Publisher- und Einbettungskit", about: "Über ShipMathLab", versionLog: "Versionsprotokoll", privacy: "Datenschutz", openSource: "Open-Source-Formeln", cbm: "CBM-Rechner", pallet: "Palettenrechner", margin: "Margenrechner" },
  fr: { navigation: "Navigation principale", calculator: "Mètres de plancher", planner: "Planificateur", questions: "Questions", guides: "Guides", resources: "Ressources", embed: "Intégrer", method: "Méthode", start: "Calculer", statement: "Calculs directs pour palettes, espace de chargement, volume, poids et fret.", disclaimer: "Estimations de planification. Vérifiez les valeurs critiques auprès du transporteur ou fournisseur.", footerNavigation: "Navigation de pied de page", workbook: "Classeur et ressources", publisherKit: "Kit éditeur et intégration", about: "À propos de ShipMathLab", versionLog: "Historique des versions", privacy: "Confidentialité", openSource: "Formules open source", cbm: "Calculateur CBM", pallet: "Calculateur de palettes", margin: "Calculateur de marge" },
  ja: { navigation: "メインナビゲーション", calculator: "荷台長計算", planner: "輸送プランナー", questions: "質問", guides: "ガイド", resources: "資料", embed: "埋め込み", method: "計算方法", start: "計算する", statement: "パレット、荷台スペース、容積、重量、輸送費をすぐに計算できます。", disclaimer: "計画用の概算です。重要な値は運送会社・仕入先に確認してください。", footerNavigation: "フッターナビゲーション", workbook: "ワークブック・資料", publisherKit: "埋め込みキット", about: "ShipMathLabについて", versionLog: "更新履歴", privacy: "プライバシー", openSource: "オープンソースの計算式", cbm: "CBM計算", pallet: "パレット計算", margin: "粗利計算" },
  zh: { navigation: "主导航", calculator: "车厢长度", planner: "货运规划", questions: "问答", guides: "指南", resources: "资料", embed: "嵌入", method: "计算方法", start: "开始计算", statement: "快速计算托盘、车厢空间、体积、重量和货运成本。", disclaimer: "结果仅供规划。关键数值请向承运商或供应商确认。", footerNavigation: "页脚导航", workbook: "工作簿与资料", publisherKit: "发布者与嵌入工具包", about: "关于 ShipMathLab", versionLog: "版本记录", privacy: "隐私", openSource: "开源公式", cbm: "CBM 计算器", pallet: "托盘计算器", margin: "利润率计算器" },
};

export function SiteHeader({ locale = "en" }: { locale?: SiteLocale }) {
  const text = chromeText[locale];
  const regional = locale !== "en";
  const calculatorHref = regional ? `${localizedFreightPaths[locale]}#calculator` : "/#all-tools";
  const hubPaths = localizedHubPaths[locale];
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="ShipMathLab home">
          <span className="brand-mark" aria-hidden="true">SM</span>
          <span>ShipMathLab</span>
        </Link>
        <nav className="site-nav" aria-label={text.navigation}>
          <Link href={calculatorHref}>{text.calculator}</Link>
          <Link href={hubPaths.planner}>{text.planner}</Link>
          <Link href={hubPaths.questions}>{text.questions}</Link>
          <Link href={hubPaths.guides}>{text.guides}</Link>
          <Link href={hubPaths.resources}>{text.resources}</Link>
          <Link href={hubPaths.embed}>{text.embed}</Link>
          <Link href={hubPaths.methodology}>{text.method}</Link>
          <LocaleMenu current={locale} />
          <Link className="nav-pill" href={regional ? `${localizedFreightPaths[locale]}#calculator` : "/tools/dimensional-weight-calculator"}>{text.start}</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({ locale = "en" }: { locale?: SiteLocale }) {
  const text = chromeText[locale];
  const hubPaths = localizedHubPaths[locale];
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div>
          <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">SM</span><span>ShipMathLab</span></Link>
          <p className="footer-statement">{text.statement}</p>
        </div>
        <nav className="footer-links" aria-label={text.footerNavigation}>
          <Link href={locale === "en" ? "/#all-tools" : localizedFreightPaths[locale]}>{text.calculator}</Link>
          <Link href={hubPaths.guides}>{text.guides}</Link><Link href={hubPaths.resources}>{text.workbook}</Link><Link href={hubPaths.embed}>{text.publisherKit}</Link><Link href="/about">{text.about}</Link><Link href={hubPaths.methodology}>{text.method}</Link><Link href="/changelog">{text.versionLog}</Link><Link href="/privacy">{text.privacy}</Link>
          <a href="https://github.com/Saigetsu233/freightkit-calculators" target="_blank" rel="noopener noreferrer">{text.openSource}</a>
          <Link href="/tools/cbm-calculator">{text.cbm}</Link><Link href="/tools/pallet-load-calculator">{text.pallet}</Link><Link href="/tools/ecommerce-margin-calculator">{text.margin}</Link>
        </nav>
      </div>
      <div className="shell footer-bottom"><span>© {new Date().getFullYear()} ShipMathLab</span><span>{text.disclaimer}</span></div>
    </footer>
  );
}
