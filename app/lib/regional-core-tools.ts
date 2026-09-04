import type { SiteLocale } from "./locales";

export type RegionalCoreTool = "dimensional-weight" | "pallet-loading" | "lcl-chargeable-volume";

type ToolCopy = {
  title: string;
  description: string;
  dim: string;
  pallet: string;
  lcl: string;
  shipment: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  quantity: string;
  divisor: string;
  calculate: string;
  results: string;
  dimensionalWeight: string;
  chargeableWeight: string;
  actualWeight: string;
  carton: string;
  palletType: string;
  maxHeight: string;
  cartonsLayer: string;
  cartonsPallet: string;
  palletsRequired: string;
  cbm: string;
  tonnes: string;
  wm: string;
  note: string;
  source: string;
};

export const localizedCoreToolPaths: Record<SiteLocale, Record<RegionalCoreTool, string>> = {
  en: {
    "dimensional-weight": "/tools/dimensional-weight-calculator",
    "pallet-loading": "/tools/pallet-load-calculator",
    "lcl-chargeable-volume": "/tools/lcl-chargeable-volume-calculator",
  },
  nl: {
    "dimensional-weight": "/nl/tools/volumetrisch-gewicht-calculator",
    "pallet-loading": "/nl/tools/pallet-belading-calculator",
    "lcl-chargeable-volume": "/nl/tools/lcl-tarief-volume-calculator",
  },
  de: {
    "dimensional-weight": "/de/tools/volumengewicht-rechner",
    "pallet-loading": "/de/tools/palettenbeladung-rechner",
    "lcl-chargeable-volume": "/de/tools/lcl-abrechnungsvolumen-rechner",
  },
  fr: {
    "dimensional-weight": "/fr/outils/calculateur-poids-volumetrique",
    "pallet-loading": "/fr/outils/calculateur-chargement-palette",
    "lcl-chargeable-volume": "/fr/outils/calculateur-volume-facturable-lcl",
  },
  ja: {
    "dimensional-weight": "/ja/tools/dimensional-weight-calculator",
    "pallet-loading": "/ja/tools/pallet-loading-calculator",
    "lcl-chargeable-volume": "/ja/tools/lcl-chargeable-volume-calculator",
  },
  zh: {
    "dimensional-weight": "/zh/tools/dimensional-weight-calculator",
    "pallet-loading": "/zh/tools/pallet-loading-calculator",
    "lcl-chargeable-volume": "/zh/tools/lcl-chargeable-volume-calculator",
  },
};

const copy: Record<Exclude<SiteLocale, "en">, ToolCopy> = {
  nl: { title: "Reken direct met uw zending", description: "Voorbeeldwaarden zijn ingevuld; vervang alleen de maten die u kent.", dim: "Calculator volumetrisch gewicht", pallet: "Palletbelading berekenen", lcl: "LCL-factuurvolume berekenen", shipment: "Zending", length: "Lengte", width: "Breedte", height: "Hoogte", weight: "Gewicht", quantity: "Aantal", divisor: "Volumieke deler", calculate: "Resultaat bijwerken", results: "Uw resultaat", dimensionalWeight: "Volumetrisch gewicht", chargeableWeight: "Verrekenbaar gewicht", actualWeight: "Werkelijk gewicht", carton: "Doos", palletType: "Pallettype", maxHeight: "Maximale totale hoogte", cartonsLayer: "Dozen per laag", cartonsPallet: "Dozen per pallet", palletsRequired: "Benodigde pallets", cbm: "Totaal CBM", tonnes: "Metrische ton", wm: "Verrekenbare W/M", note: "Controleer vóór boeking uw contractregel, laadveiligheid en offerte.", source: "Berekening gebeurt in uw browser." },
  de: { title: "Direkt mit Ihren Sendungsdaten rechnen", description: "Beispielwerte sind eingetragen. Ersetzen Sie nur die Maße, die Sie kennen.", dim: "Volumengewicht berechnen", pallet: "Palettenbeladung berechnen", lcl: "LCL-Abrechnungsvolumen berechnen", shipment: "Sendung", length: "Länge", width: "Breite", height: "Höhe", weight: "Gewicht", quantity: "Menge", divisor: "Volumengewicht-Divisor", calculate: "Ergebnis aktualisieren", results: "Ihr Ergebnis", dimensionalWeight: "Volumengewicht", chargeableWeight: "Abrechnungsgewicht", actualWeight: "Tatsächliches Gewicht", carton: "Karton", palletType: "Palettentyp", maxHeight: "Maximale Gesamthöhe", cartonsLayer: "Kartons je Lage", cartonsPallet: "Kartons je Palette", palletsRequired: "Benötigte Paletten", cbm: "CBM gesamt", tonnes: "Metrische Tonnen", wm: "Abrechenbare W/M", note: "Prüfen Sie vor der Buchung Vertrag, Ladungssicherheit und Angebot.", source: "Die Berechnung läuft in Ihrem Browser." },
  fr: { title: "Calculez directement avec vos données d'expédition", description: "Des exemples sont déjà saisis ; remplacez uniquement les mesures connues.", dim: "Calculer le poids volumétrique", pallet: "Calculer le chargement palette", lcl: "Calculer le volume facturable LCL", shipment: "Expédition", length: "Longueur", width: "Largeur", height: "Hauteur", weight: "Poids", quantity: "Quantité", divisor: "Diviseur volumétrique", calculate: "Mettre à jour le résultat", results: "Votre résultat", dimensionalWeight: "Poids volumétrique", chargeableWeight: "Poids facturable", actualWeight: "Poids réel", carton: "Carton", palletType: "Type de palette", maxHeight: "Hauteur totale maximale", cartonsLayer: "Cartons par couche", cartonsPallet: "Cartons par palette", palletsRequired: "Palettes nécessaires", cbm: "CBM total", tonnes: "Tonnes métriques", wm: "W/M facturable", note: "Avant réservation, vérifiez contrat, sécurité de chargement et devis.", source: "Le calcul s'effectue dans votre navigateur." },
  ja: { title: "出荷データを入力してすぐ計算", description: "例の数値が入っています。分かる寸法だけを置き換えてください。", dim: "容積重量を計算", pallet: "パレット積載を計算", lcl: "LCL課金容積を計算", shipment: "出荷", length: "長さ", width: "幅", height: "高さ", weight: "重量", quantity: "数量", divisor: "容積重量の除数", calculate: "結果を更新", results: "計算結果", dimensionalWeight: "容積重量", chargeableWeight: "課金重量", actualWeight: "実重量", carton: "段ボール", palletType: "パレット種類", maxHeight: "最大総高さ", cartonsLayer: "1段あたりの箱数", cartonsPallet: "1パレットあたりの箱数", palletsRequired: "必要パレット数", cbm: "合計CBM", tonnes: "メトリックトン", wm: "課金W/M", note: "予約前に、契約条件・積載安全・見積内容を確認してください。", source: "計算はブラウザ内で行われます。" },
  zh: { title: "用现有发货数据直接计算", description: "已填入示例值，只需替换你知道的尺寸。", dim: "计算体积重", pallet: "计算托盘装载", lcl: "计算 LCL 计费体积", shipment: "货物", length: "长度", width: "宽度", height: "高度", weight: "重量", quantity: "数量", divisor: "体积重除数", calculate: "更新结果", results: "计算结果", dimensionalWeight: "体积重量", chargeableWeight: "计费重量", actualWeight: "实际重量", carton: "纸箱", palletType: "托盘类型", maxHeight: "最大总高度", cartonsLayer: "每层纸箱数", cartonsPallet: "每托盘纸箱数", palletsRequired: "所需托盘数", cbm: "总 CBM", tonnes: "公吨", wm: "计费 W/M", note: "订舱前请核对合同规则、装载安全和报价。", source: "计算仅在你的浏览器中完成。" },
};

export function coreToolKey(locale: SiteLocale, slug: string): RegionalCoreTool | null {
  if (locale === "en") return null;
  return (Object.keys(localizedCoreToolPaths[locale]) as RegionalCoreTool[]).find((key) => localizedCoreToolPaths[locale][key].endsWith(`/${slug}`)) ?? null;
}

export function coreToolCopy(locale: Exclude<SiteLocale, "en">) { return copy[locale]; }

export const allLocalizedCoreToolPaths = (Object.keys(localizedCoreToolPaths) as SiteLocale[])
  .filter((locale) => locale !== "en")
  .flatMap((locale) => Object.values(localizedCoreToolPaths[locale]));
