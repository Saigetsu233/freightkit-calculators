import type { Metadata } from "next";
import { localizedFreightPaths, type SiteLocale } from "./locales";

export type RegionalPallet = {
  key: string;
  label: string;
  length: number;
  width: number;
};

export type RegionalFreightConfig = {
  locale: Exclude<SiteLocale, "en">;
  htmlLang: string;
  intlLocale: string;
  path: string;
  metadataTitle: string;
  metadataDescription: string;
  eyebrow: string;
  title: string;
  summary: string;
  regionLabel: string;
  languageName: string;
  selectedTitle: string;
  selectedCopy: string;
  unitsLabel: string;
  standardPalletLabel: string;
  planningWidthLabel: string;
  calculatorTitle: string;
  liveResult: string;
  exampleTitle: string;
  exampleStrong: string;
  exampleCopy: string;
  loadUnitLabel: string;
  lengthLabel: string;
  widthLabel: string;
  quantityLabel: string;
  layersLabel: string;
  layersHelp: string;
  workingWidthLabel: string;
  workingWidthHelp: string;
  customLabel: string;
  resultLabel: string;
  resultUnit: string;
  floorAreaLabel: string;
  vehicleShareLabel: string;
  palletEquivalentLabel: string;
  calculationWidthLabel: string;
  resultNote: string;
  copyLabel: string;
  copiedLabel: string;
  printLabel: string;
  copySummary: string;
  methodEyebrow: string;
  methodTitle: string;
  methodCopy: string;
  formula: string;
  palletRuleTitle: string;
  palletRuleCopy: string;
  palletRuleSourceLabel: string;
  palletRuleSource: string;
  vehicleRuleTitle: string;
  vehicleRuleCopy: string;
  vehicleRuleSourceLabel: string;
  vehicleRuleSource: string;
  carrierRuleTitle: string;
  carrierRuleCopy: string;
  carrierRuleSourceLabel: string;
  carrierRuleSource: string;
  knownTitle: string;
  knownItems: string[];
  warningTitle: string;
  warningItems: string[];
  planningWidth: number;
  referenceVehicleLength: number;
  referenceVehicleLabel: string;
  pallets: RegionalPallet[];
};

const epal1: RegionalPallet = { key: "epal1", label: "Europallet · EPAL 1 · 120 × 80 cm", length: 120, width: 80 };
const epal2: RegionalPallet = { key: "epal2", label: "Industriepallet · EPAL 2 · 120 × 100 cm", length: 120, width: 100 };

export const regionalFreightConfigs: Record<Exclude<SiteLocale, "en">, RegionalFreightConfig> = {
  nl: {
    locale: "nl", htmlLang: "nl-NL", intlLocale: "nl-NL", path: localizedFreightPaths.nl,
    metadataTitle: "Laadmeters berekenen voor vrachtwagens",
    metadataDescription: "Bereken direct laadmeters voor pallets en eigen maten, met Europese palletmaten en instelbare trailerbreedte.",
    eyebrow: "Wegtransport · Nederland en Europa", title: "Laadmeters berekenen",
    summary: "Kies een pallet, vul het aantal in en zie direct hoeveel meter van de trailer nodig is.",
    regionLabel: "Nederland / Europa", languageName: "Nederlands",
    selectedTitle: "Nederlandse taal en Europese maten gekozen", selectedCopy: "De keuze wordt op dit apparaat onthouden. Alle planningswaarden blijven aanpasbaar.",
    unitsLabel: "cm · m · LDM", standardPalletLabel: "EPAL 120 × 80 cm", planningWidthLabel: "2,40 m (instelbaar)",
    calculatorTitle: "Vul uw zending in", liveResult: "Direct resultaat", exampleTitle: "Voorbeeld is al ingevuld", exampleStrong: "Vervang alleen wat u weet", exampleCopy: "De standaardwaarden passen bij Europees wegtransport.",
    loadUnitLabel: "Laadeenheid", lengthLabel: "Lengte", widthLabel: "Breedte", quantityLabel: "Aantal", layersLabel: "Stapelbare lagen", layersHelp: "Gebruik 1 als de goederen niet stapelbaar zijn.", workingWidthLabel: "Bruikbare binnenbreedte", workingWidthHelp: "2,40 m is een rekenwaarde, geen wettelijke voertuigbreedte. Bevestig de binnenmaat bij uw vervoerder.", customLabel: "Eigen afmetingen",
    resultLabel: "Benodigde laadruimte", resultUnit: "LDM", floorAreaLabel: "Vloeroppervlak", vehicleShareLabel: "Van een trailer van 13,6 m", palletEquivalentLabel: "EPAL 1-equivalenten", calculationWidthLabel: "Rekenbreedte", resultNote: "Planningsschatting voor rechthoekige vloerplaatsen. Controleer stapelbaarheid, aslasten en de werkelijke binnenmaten.", copyLabel: "Kopieer resultaat", copiedLabel: "Gekopieerd ✓", printLabel: "Resultaat afdrukken", copySummary: "Laadruimte: {length} LDM. Vloeroppervlak: {area} m². Aandeel van 13,6 m trailer: {share}%.",
    methodEyebrow: "Formule en regionale regels", methodTitle: "Wat de calculator gebruikt", methodCopy: "De vloeroppervlakte wordt gedeeld door de instelbare bruikbare binnenbreedte en het aantal stapelbare lagen.", formula: "LDM = lengte (m) × breedte (m) × aantal ÷ binnenbreedte ÷ lagen",
    palletRuleTitle: "EPAL-palletmaten", palletRuleCopy: "EPAL 1 meet 800 × 1.200 mm; EPAL 2 meet 1.200 × 1.000 mm. Beide staan als directe keuze in de calculator.", palletRuleSourceLabel: "EPAL productoverzicht", palletRuleSource: "https://www.epal-pallets.org/eu-en/load-carriers/overview",
    vehicleRuleTitle: "EU-voertuigafmetingen", vehicleRuleCopy: "De EU-richtlijn noemt voor de meeste voertuigen 2,55 m maximale buitenbreedte en 16,50 m voor een trekker-oplegger. De invoer van 2,40 m is uitsluitend een interne planningswaarde.", vehicleRuleSourceLabel: "EU-richtlijn 96/53/EG", vehicleRuleSource: "https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A01996L0053-20190710",
    carrierRuleTitle: "DHL Express volumetrisch gewicht", carrierRuleCopy: "Voor lichte, volumineuze expreszendingen gebruikt DHL Express lengte × breedte × hoogte in cm ÷ 5.000. Dit staat los van de LDM-berekening op deze pagina.", carrierRuleSourceLabel: "DHL formaten en gewichten", carrierRuleSource: "https://www.dhl.de/de/geschaeftskunden/express/infos-knowhow/formate-gewichte.html",
    knownTitle: "Snelle controles", knownItems: ["1 EPAL 1-pallet = 0,40 LDM bij 2,40 m rekenbreedte.", "1 EPAL 2-pallet = 0,50 LDM bij dezelfde breedte.", "10 niet-stapelbare EPAL 1-pallets = 4,00 LDM."], warningTitle: "Wanneer de uitkomst afwijkt", warningItems: ["De werkelijke binnenbreedte is anders.", "De lading steekt uit of is onregelmatig.", "De goederen zijn niet stapelbaar.", "Gewichtsverdeling en aslast zijn niet gecontroleerd."],
    planningWidth: 2.4, referenceVehicleLength: 13.6, referenceVehicleLabel: "13,6 m trailer", pallets: [epal1, epal2],
  },
  de: {
    locale: "de", htmlLang: "de-DE", intlLocale: "de-DE", path: localizedFreightPaths.de,
    metadataTitle: "Lademeter-Rechner für Paletten und Lkw",
    metadataDescription: "Lademeter direkt berechnen – mit EPAL-Paletten, metrischen Einheiten und anpassbarer Innenbreite.",
    eyebrow: "Straßengüterverkehr · Deutschland und Europa", title: "Lademeter berechnen",
    summary: "Palette und Menge wählen und sofort sehen, wie viel Lkw-Ladefläche benötigt wird.",
    regionLabel: "Deutschland / Europa", languageName: "Deutsch", selectedTitle: "Deutsch und europäische Maße gewählt", selectedCopy: "Die Auswahl bleibt auf diesem Gerät gespeichert. Planungswerte können jederzeit geändert werden.",
    unitsLabel: "cm · m · LDM", standardPalletLabel: "EPAL 120 × 80 cm", planningWidthLabel: "2,40 m (änderbar)",
    calculatorTitle: "Sendung eingeben", liveResult: "Sofortergebnis", exampleTitle: "Beispiel ist ausgefüllt", exampleStrong: "Nur bekannte Werte ersetzen", exampleCopy: "Die Startwerte passen zum europäischen Straßentransport.", loadUnitLabel: "Ladeeinheit", lengthLabel: "Länge", widthLabel: "Breite", quantityLabel: "Anzahl", layersLabel: "Stapelbare Lagen", layersHelp: "1 wählen, wenn die Ware nicht stapelbar ist.", workingWidthLabel: "Nutzbare Innenbreite", workingWidthHelp: "2,40 m ist ein Planungswert, keine gesetzliche Fahrzeugbreite. Innenmaß beim Frachtführer prüfen.", customLabel: "Eigene Maße",
    resultLabel: "Benötigte Ladefläche", resultUnit: "LDM", floorAreaLabel: "Bodenfläche", vehicleShareLabel: "Anteil eines 13,6-m-Aufliegers", palletEquivalentLabel: "EPAL-1-Äquivalente", calculationWidthLabel: "Rechenbreite", resultNote: "Planungsschätzung für rechteckige Stellflächen. Stapelbarkeit, Achslasten und tatsächliche Innenmaße prüfen.", copyLabel: "Ergebnis kopieren", copiedLabel: "Kopiert ✓", printLabel: "Ergebnis drucken", copySummary: "Ladefläche: {length} LDM. Bodenfläche: {area} m². Anteil am 13,6-m-Auflieger: {share} %.",
    methodEyebrow: "Formel und regionale Regeln", methodTitle: "So wird gerechnet", methodCopy: "Die Bodenfläche wird durch die einstellbare nutzbare Innenbreite und die Zahl der stapelbaren Lagen geteilt.", formula: "LDM = Länge (m) × Breite (m) × Anzahl ÷ Innenbreite ÷ Lagen",
    palletRuleTitle: "EPAL-Palettenmaße", palletRuleCopy: "EPAL 1 misst 800 × 1.200 mm, EPAL 2 misst 1.200 × 1.000 mm. Beide sind direkt auswählbar.", palletRuleSourceLabel: "EPAL Produktübersicht", palletRuleSource: "https://www.epal-pallets.org/eu-en/load-carriers/overview",
    vehicleRuleTitle: "EU-Fahrzeugabmessungen", vehicleRuleCopy: "Die EU-Richtlinie nennt für die meisten Fahrzeuge 2,55 m maximale Außenbreite und 16,50 m für Sattelkraftfahrzeuge. 2,40 m ist hier nur ein interner Planungswert.", vehicleRuleSourceLabel: "EU-Richtlinie 96/53/EG", vehicleRuleSource: "https://eur-lex.europa.eu/legal-content/DE/ALL/?uri=CELEX%3A01996L0053-20190710",
    carrierRuleTitle: "DHL Express Volumengewicht", carrierRuleCopy: "DHL Express verwendet für leichte, sperrige Sendungen Länge × Breite × Höhe in cm ÷ 5.000. Diese Regel ist getrennt von der LDM-Rechnung.", carrierRuleSourceLabel: "DHL Formate und Gewichte", carrierRuleSource: "https://www.dhl.de/de/geschaeftskunden/express/infos-knowhow/formate-gewichte.html",
    knownTitle: "Schnell prüfen", knownItems: ["1 EPAL-1-Palette = 0,40 LDM bei 2,40 m Rechenbreite.", "1 EPAL-2-Palette = 0,50 LDM.", "10 nicht stapelbare EPAL-1-Paletten = 4,00 LDM."], warningTitle: "Mögliche Abweichungen", warningItems: ["Die tatsächliche Innenbreite weicht ab.", "Ware ragt über die Palette hinaus.", "Ware ist nicht stapelbar.", "Achslast und Gewichtsverteilung sind nicht geprüft."],
    planningWidth: 2.4, referenceVehicleLength: 13.6, referenceVehicleLabel: "13,6-m-Auflieger", pallets: [epal1, epal2],
  },
  fr: {
    locale: "fr", htmlLang: "fr-FR", intlLocale: "fr-FR", path: localizedFreightPaths.fr,
    metadataTitle: "Calculateur de mètres de plancher pour palettes",
    metadataDescription: "Calculez les mètres de plancher avec palettes EPAL, unités métriques et largeur intérieure réglable.",
    eyebrow: "Transport routier · France et Europe", title: "Calculer les mètres de plancher",
    summary: "Choisissez une palette et une quantité pour obtenir immédiatement la longueur de plancher nécessaire.",
    regionLabel: "France / Europe", languageName: "Français", selectedTitle: "Français et dimensions européennes sélectionnés", selectedCopy: "Le choix reste mémorisé sur cet appareil. Toutes les valeurs de planification sont modifiables.",
    unitsLabel: "cm · m · mètre de plancher", standardPalletLabel: "EPAL 120 × 80 cm", planningWidthLabel: "2,40 m (modifiable)",
    calculatorTitle: "Saisissez l’envoi", liveResult: "Résultat immédiat", exampleTitle: "Un exemple est prérempli", exampleStrong: "Remplacez seulement les valeurs connues", exampleCopy: "Les valeurs initiales correspondent au transport routier européen.", loadUnitLabel: "Unité de chargement", lengthLabel: "Longueur", widthLabel: "Largeur", quantityLabel: "Quantité", layersLabel: "Couches empilables", layersHelp: "Indiquez 1 si la marchandise n’est pas empilable.", workingWidthLabel: "Largeur intérieure utile", workingWidthHelp: "2,40 m est une valeur de planification, pas une largeur légale. Confirmez l’intérieur auprès du transporteur.", customLabel: "Dimensions personnalisées",
    resultLabel: "Longueur de plancher nécessaire", resultUnit: "m", floorAreaLabel: "Surface au sol", vehicleShareLabel: "Part d’une semi-remorque de 13,6 m", palletEquivalentLabel: "Équivalents EPAL 1", calculationWidthLabel: "Largeur de calcul", resultNote: "Estimation pour des emplacements rectangulaires. Vérifiez l’empilabilité, les charges par essieu et les dimensions intérieures réelles.", copyLabel: "Copier le résultat", copiedLabel: "Copié ✓", printLabel: "Imprimer", copySummary: "Longueur de plancher : {length} m. Surface : {area} m². Part d’une semi-remorque de 13,6 m : {share} %.",
    methodEyebrow: "Formule et règles régionales", methodTitle: "Méthode de calcul", methodCopy: "La surface au sol est divisée par la largeur intérieure utile réglable et par le nombre de couches empilables.", formula: "mètres de plancher = longueur × largeur × quantité ÷ largeur intérieure ÷ couches",
    palletRuleTitle: "Dimensions des palettes EPAL", palletRuleCopy: "L’EPAL 1 mesure 800 × 1 200 mm et l’EPAL 2, 1 200 × 1 000 mm. Les deux sont proposées dans le calculateur.", palletRuleSourceLabel: "Catalogue EPAL", palletRuleSource: "https://www.epal-pallets.org/eu-en/load-carriers/overview",
    vehicleRuleTitle: "Dimensions européennes des véhicules", vehicleRuleCopy: "La directive européenne fixe généralement 2,55 m de largeur extérieure maximale et 16,50 m pour un véhicule articulé. Les 2,40 m saisis ici restent une hypothèse intérieure.", vehicleRuleSourceLabel: "Directive 96/53/CE", vehicleRuleSource: "https://eur-lex.europa.eu/legal-content/FR/ALL/?uri=CELEX%3A01996L0053-20190710",
    carrierRuleTitle: "Poids volumétrique Colissimo", carrierRuleCopy: "Pour les liaisons aériennes internationales et Outre-mer concernées, Colissimo applique longueur × largeur × hauteur en cm ÷ 5 000. Les conditions exactes dépendent du service.", carrierRuleSourceLabel: "Règle Colissimo officielle", carrierRuleSource: "https://www.colissimo.entreprise.laposte.fr/en/offer-and-prices/international/volumetric-weight",
    knownTitle: "Repères rapides", knownItems: ["1 palette EPAL 1 = 0,40 m de plancher avec 2,40 m de largeur utile.", "1 palette EPAL 2 = 0,50 m.", "10 palettes EPAL 1 non empilables = 4,00 m."], warningTitle: "Sources d’écart", warningItems: ["La largeur intérieure réelle diffère.", "La charge dépasse de la palette.", "La marchandise n’est pas empilable.", "Les charges par essieu ne sont pas contrôlées ici."],
    planningWidth: 2.4, referenceVehicleLength: 13.6, referenceVehicleLabel: "semi-remorque de 13,6 m", pallets: [epal1, epal2],
  },
  ja: {
    locale: "ja", htmlLang: "ja-JP", intlLocale: "ja-JP", path: localizedFreightPaths.ja,
    metadataTitle: "トラック積載スペース計算｜パレット・荷台長",
    metadataDescription: "JPR T11型パレットなどの床面積から、必要な荷台長をメートル単位で計算します。",
    eyebrow: "国内トラック輸送 · 日本", title: "必要な荷台長を計算",
    summary: "パレットの種類と枚数を選ぶだけで、トラック床面を何メートル使うか確認できます。",
    regionLabel: "日本", languageName: "日本語", selectedTitle: "日本語と国内向け初期値を選択", selectedCopy: "選択はこの端末に保存されます。荷台内寸や車種に合わせて値を変更できます。",
    unitsLabel: "cm · m · 荷台長", standardPalletLabel: "JPR T11 · 110 × 110 cm", planningWidthLabel: "2.35 m（変更可）",
    calculatorTitle: "貨物を入力", liveResult: "リアルタイム計算", exampleTitle: "入力例を設定済み", exampleStrong: "分かる項目だけ変更", exampleCopy: "国内輸送でよく使われるT11型パレットを初期値にしています。", loadUnitLabel: "パレット・荷姿", lengthLabel: "長さ", widthLabel: "幅", quantityLabel: "枚数", layersLabel: "積み重ね段数", layersHelp: "積み重ねできない場合は1にしてください。", workingWidthLabel: "使用できる荷台内幅", workingWidthHelp: "2.35 mは計画用の代表値で、法定幅ではありません。実車の内寸を確認してください。", customLabel: "任意サイズ",
    resultLabel: "必要な荷台長", resultUnit: "m", floorAreaLabel: "床面積", vehicleShareLabel: "9.6 m荷台に占める割合", palletEquivalentLabel: "T11型パレット換算", calculationWidthLabel: "計算上の内幅", resultNote: "長方形の床占有面積による概算です。積載方法、軸重、はみ出し、実車の内寸を別途確認してください。", copyLabel: "結果をコピー", copiedLabel: "コピーしました ✓", printLabel: "印刷", copySummary: "必要な荷台長：{length} m。床面積：{area} m²。9.6 m荷台の使用率：{share}%。",
    methodEyebrow: "計算式と国内ルール", methodTitle: "この計算で使う値", methodCopy: "貨物の床面積を変更可能な荷台内幅と積み重ね段数で割ります。", formula: "必要荷台長 = 長さ (m) × 幅 (m) × 枚数 ÷ 荷台内幅 ÷ 段数",
    palletRuleTitle: "JPR T11型パレット", palletRuleCopy: "国内で広く使われるT11型は1,100 × 1,100 mmです。計算の初期値に設定しています。", palletRuleSourceLabel: "日本パレットレンタル", palletRuleSource: "https://www.jpr.co.jp/pallet-loading-pattern/",
    vehicleRuleTitle: "日本の一般制限値", vehicleRuleCopy: "国土交通省の一般的制限値は幅2.5 m、長さ12.0 m、高さ3.8 mなどです。道路指定や許可、車種で条件が変わります。2.35 mは荷台内幅の計画値です。", vehicleRuleSourceLabel: "国土交通省・車両制限令", vehicleRuleSource: "https://www.mlit.go.jp/road/soudan/soudan_09_02.html",
    carrierRuleTitle: "ヤマト運輸の宅急便サイズ", carrierRuleCopy: "宅急便のサイズは縦・横・高さの合計で判定され、通常は200 cm・30 kgまでです。荷台長計算とは別の判定基準です。", carrierRuleSourceLabel: "ヤマト運輸・荷物のサイズ", carrierRuleSource: "https://www.kuronekoyamato.co.jp/ytc/customer/send/search/payment/size/",
    knownTitle: "すぐ確認できる目安", knownItems: ["JPR T11型パレットは110 × 110 cmです。", "2.35 m内幅なら1枚あたり約0.51 mの荷台長です。", "10枚・段積みなしなら約5.15 mです。"], warningTitle: "結果が変わる条件", warningItems: ["実際の荷台内幅が異なる場合。", "貨物がパレットからはみ出す場合。", "積み重ねできない、または固定スペースが必要な場合。", "重量や軸重の制限に達する場合。"],
    planningWidth: 2.35, referenceVehicleLength: 9.6, referenceVehicleLabel: "9.6 m荷台", pallets: [{ key: "jpr-t11", label: "JPR T11型 · 110 × 110 cm", length: 110, width: 110 }, epal1],
  },
  zh: {
    locale: "zh", htmlLang: "zh-CN", intlLocale: "zh-CN", path: localizedFreightPaths.zh,
    metadataTitle: "货车装载长度计算器｜托盘与车厢空间",
    metadataDescription: "按托盘尺寸和数量计算所需车厢长度，提供中国常用托盘、车辆限制与顺丰体积重规则。",
    eyebrow: "公路货运 · 中国大陆", title: "计算货物占用的车厢长度",
    summary: "选择托盘并填写数量，立即看到需要占用多少米车厢地板。",
    regionLabel: "中国大陆", languageName: "中文", selectedTitle: "已选择中文和中国大陆常用尺寸", selectedCopy: "本设备会记住语言。托盘和车厢数值都可以按实际承运车辆修改。",
    unitsLabel: "厘米 · 米 · 车厢长度", standardPalletLabel: "120 × 100 厘米", planningWidthLabel: "2.40 米（可修改）",
    calculatorTitle: "填写货物", liveResult: "即时结果", exampleTitle: "已填入示例", exampleStrong: "只需修改已知数据", exampleCopy: "默认采用120 × 100厘米托盘和常用规划内宽。", loadUnitLabel: "托盘/货物尺寸", lengthLabel: "长度", widthLabel: "宽度", quantityLabel: "数量", layersLabel: "可堆叠层数", layersHelp: "不能堆叠时填1。", workingWidthLabel: "可用车厢内宽", workingWidthHelp: "2.40米只是规划值，不是法定车辆宽度，请按实际车厢内尺寸修改。", customLabel: "自定义尺寸",
    resultLabel: "所需车厢长度", resultUnit: "米", floorAreaLabel: "占地面积", vehicleShareLabel: "占13.75米参考车厢", palletEquivalentLabel: "120 × 100托盘当量", calculationWidthLabel: "计算内宽", resultNote: "这是矩形占地的规划估算。还需检查能否堆叠、重量与轴荷、异形突出和实际车厢内尺寸。", copyLabel: "复制结果", copiedLabel: "已复制 ✓", printLabel: "打印结果", copySummary: "所需车厢长度：{length}米。占地面积：{area}平方米。占13.75米参考车厢：{share}%。",
    methodEyebrow: "公式与地区规则", methodTitle: "计算依据", methodCopy: "用货物占地面积除以可修改的车厢内宽，再除以可堆叠层数。", formula: "所需车厢长度 = 长(m) × 宽(m) × 数量 ÷ 车厢内宽 ÷ 堆叠层数",
    palletRuleTitle: "中国联运通用平托盘", palletRuleCopy: "国家标准体系优先推荐1,200 × 1,000毫米托盘，已作为计算器默认选项。", palletRuleSourceLabel: "国家市场监督管理总局标准解读", palletRuleSource: "https://www.samr.gov.cn/bzjss/bzjd/art/2019/art_ea4c131076364bdd992565bd53110ee1.html",
    vehicleRuleTitle: "当前公路车辆尺度规则", vehicleRuleCopy: "现行超限认定中，车货总宽超过2.55米、总高超过4米或总长超过18.1米属于超限情形。页面中的2.40米只是车厢内宽规划值。GB 1589—2026将于2027年7月1日实施，目前不作为默认现行规则。", vehicleRuleSourceLabel: "交通运输部超限运输规定", vehicleRuleSource: "https://xxgk.mot.gov.cn/jigou/fgs/202108/t20210825_3616568.html",
    carrierRuleTitle: "顺丰体积重量规则", carrierRuleCopy: "顺丰中国大陆不同产品可能使用6000或分重量段使用12000/6000的体积系数，国际件常见5000。具体计费以产品、流向和官网报价为准。", carrierRuleSourceLabel: "顺丰官方价格查询说明", carrierRuleSource: "https://www.sf-express.com/chn/sc/price-query",
    knownTitle: "快速参考", knownItems: ["国家标准托盘单元常用1200 × 1000毫米。", "按2.40米内宽，单个120 × 100厘米托盘约占0.50米车厢长度。", "10个不可堆叠托盘约占5.00米。"], warningTitle: "结果可能变化的情况", warningItems: ["实际车厢内宽不同。", "货物超出托盘或形状不规则。", "货物不能堆叠或需要隔离空间。", "重量、轴荷或固定方式成为限制。"],
    planningWidth: 2.4, referenceVehicleLength: 13.75, referenceVehicleLabel: "13.75米参考车厢", pallets: [{ key: "cn-1200-1000", label: "中国常用托盘 · 120 × 100 cm", length: 120, width: 100 }, { key: "square-1100", label: "方形托盘 · 110 × 110 cm", length: 110, width: 110 }, epal1],
  },
};

export function regionalMetadata(config: RegionalFreightConfig): Metadata {
  return {
    title: config.metadataTitle,
    description: config.metadataDescription,
    alternates: {
      canonical: config.path,
      languages: {
        en: localizedFreightPaths.en,
        "nl-NL": localizedFreightPaths.nl,
        "de-DE": localizedFreightPaths.de,
        "fr-FR": localizedFreightPaths.fr,
        "ja-JP": localizedFreightPaths.ja,
        "zh-CN": localizedFreightPaths.zh,
        "x-default": localizedFreightPaths.en,
      },
    },
    openGraph: { title: config.metadataTitle, description: config.metadataDescription, url: config.path, locale: config.htmlLang.replace("-", "_") },
  };
}
