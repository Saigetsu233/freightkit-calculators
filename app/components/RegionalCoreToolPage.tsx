"use client";

import Link from "next/link";
import { useState } from "react";
import { localizedFreightPaths, type SiteLocale } from "../lib/locales";
import { coreToolCopy, coreToolKey, localizedCoreToolPaths, type RegionalCoreTool } from "../lib/regional-core-tools";
import { SiteFooter, SiteHeader } from "./SiteChrome";

function numeric(value: string) { const parsed = Number(value); return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0; }
function formatted(value: number, locale: SiteLocale, digits = 2) { return new Intl.NumberFormat(locale === "zh" ? "zh-CN" : locale === "ja" ? "ja-JP" : `${locale}-${locale === "nl" ? "NL" : locale === "de" ? "DE" : "FR"}`, { maximumFractionDigits: digits }).format(value); }

export function RegionalCoreToolPage({ locale, slug }: { locale: string; slug: string }) {
  if (!(locale in localizedCoreToolPaths) || locale === "en") return null;
  const typedLocale = locale as Exclude<SiteLocale, "en">;
  const tool = coreToolKey(typedLocale, slug);
  if (!tool) return null;
  const text = coreToolCopy(typedLocale);
  const label = tool === "dimensional-weight" ? text.dim : tool === "pallet-loading" ? text.pallet : text.lcl;
  const localizedPaths = localizedCoreToolPaths[typedLocale];

  return <main className="tool-page" lang={typedLocale}>
    <SiteHeader locale={typedLocale} />
    <div className="shell breadcrumb"><Link href={localizedFreightPaths[typedLocale]}>ShipMathLab</Link><span>/</span><span>{label}</span></div>
    <section className="shell tool-hero regional-tool-hero">
      <div><p className="eyebrow">{text.shipment}</p><h1>{label}</h1><p className="tool-summary">{text.description}</p></div>
      <div className="tool-meta"><div><span>{text.source}</span><strong>{text.results}</strong></div></div>
    </section>
    <section id="calculator" className="calculator-band"><div className="shell calculator-shell">
      {tool === "dimensional-weight" ? <DimensionalTool locale={typedLocale} /> : tool === "pallet-loading" ? <PalletTool locale={typedLocale} /> : <LclTool locale={typedLocale} />}
    </div></section>
    <section className="shell regional-tool-crosslinks"><p>{text.title}</p><div>{(Object.keys(localizedPaths) as RegionalCoreTool[]).filter((key) => key !== tool).map((key) => <Link key={key} href={localizedPaths[key]}>{key === "dimensional-weight" ? text.dim : key === "pallet-loading" ? text.pallet : text.lcl} →</Link>)}</div></section>
    <SiteFooter locale={typedLocale} />
  </main>;
}

function Field({ label, value, setValue, unit, step = "any" }: { label: string; value: string; setValue: (value: string) => void; unit: string; step?: string }) {
  return <div className="field"><label>{label}</label><div className="input-pair"><input type="number" min="0" step={step} inputMode="decimal" value={value} onChange={(event) => setValue(event.target.value)} /><span className="input-unit">{unit}</span></div></div>;
}

function Result({ heading, primary, rows, note }: { heading: string; primary: string; rows: Array<[string, string]>; note: string }) {
  return <aside className="result-card" aria-live="polite"><p className="result-label">{heading}</p><p className="result-primary">{primary}</p><div className="result-grid">{rows.map(([label, value]) => <div className="result-metric" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><p className="result-note">{note}</p></aside>;
}

function DimensionalTool({ locale }: { locale: Exclude<SiteLocale, "en"> }) {
  const text = coreToolCopy(locale); const [length, setLength] = useState("50"); const [width, setWidth] = useState("40"); const [height, setHeight] = useState("30"); const [weight, setWeight] = useState("7"); const [quantity, setQuantity] = useState("1"); const [divisor, setDivisor] = useState("5000");
  const volume = numeric(length) * numeric(width) * numeric(height); const dim = numeric(divisor) ? volume / numeric(divisor) : 0; const billable = Math.max(dim, numeric(weight)); const qty = Math.floor(numeric(quantity));
  return <><div className="calc-card"><div className="calc-card-header"><h2>{text.dim}</h2><span className="live-badge">{text.results}</span></div><div className="guided-promise"><span>{text.description}</span><strong>{text.title}</strong></div><div className="calc-form"><div className="field-grid"><Field label={text.length} value={length} setValue={setLength} unit="cm" /><Field label={text.width} value={width} setValue={setWidth} unit="cm" /><Field label={text.height} value={height} setValue={setHeight} unit="cm" /><Field label={text.weight} value={weight} setValue={setWeight} unit="kg" /><Field label={text.quantity} value={quantity} setValue={setQuantity} unit="×" step="1" /><Field label={text.divisor} value={divisor} setValue={setDivisor} unit="cm³/kg" /></div></div></div><Result heading={text.results} primary={`${formatted(billable * qty, locale)} kg`} rows={[[text.dimensionalWeight, `${formatted(dim, locale)} kg`], [text.actualWeight, `${formatted(numeric(weight), locale)} kg`], [text.chargeableWeight, `${formatted(billable, locale)} kg`], [text.quantity, formatted(qty, locale, 0)]]} note={text.note} /></>;
}

function PalletTool({ locale }: { locale: Exclude<SiteLocale, "en"> }) {
  const text = coreToolCopy(locale); const regional = locale === "ja" ? { label: "JPR T11 · 110 × 110 cm", l: 110, w: 110, base: 14 } : locale === "zh" ? { label: "120 × 100 cm", l: 120, w: 100, base: 15 } : { label: "EPAL · 120 × 80 cm", l: 120, w: 80, base: 14.4 };
  const [cartonL, setCartonL] = useState("40"); const [cartonW, setCartonW] = useState("30"); const [cartonH, setCartonH] = useState("25"); const [quantity, setQuantity] = useState("120"); const [maxHeight, setMaxHeight] = useState("165"); const first = Math.floor(regional.l / numeric(cartonL)) * Math.floor(regional.w / numeric(cartonW)); const second = Math.floor(regional.l / numeric(cartonW)) * Math.floor(regional.w / numeric(cartonL)); const perLayer = Math.max(first, second); const layers = numeric(cartonH) ? Math.floor(Math.max(numeric(maxHeight) - regional.base, 0) / numeric(cartonH)) : 0; const perPallet = perLayer * layers; const pallets = perPallet ? Math.ceil(numeric(quantity) / perPallet) : 0;
  return <><div className="calc-card"><div className="calc-card-header"><h2>{text.pallet}</h2><span className="live-badge">{text.results}</span></div><div className="guided-promise"><span>{text.palletType}: {regional.label}</span><strong>{text.title}</strong></div><div className="calc-form"><div className="field-grid"><Field label={`${text.carton} ${text.length}`} value={cartonL} setValue={setCartonL} unit="cm" /><Field label={`${text.carton} ${text.width}`} value={cartonW} setValue={setCartonW} unit="cm" /><Field label={`${text.carton} ${text.height}`} value={cartonH} setValue={setCartonH} unit="cm" /><Field label={text.quantity} value={quantity} setValue={setQuantity} unit="×" step="1" /><Field label={text.maxHeight} value={maxHeight} setValue={setMaxHeight} unit="cm" /></div></div></div><Result heading={text.results} primary={`${formatted(pallets, locale, 0)} ${text.palletsRequired}`} rows={[[text.cartonsLayer, formatted(perLayer, locale, 0)], [text.cartonsPallet, formatted(perPallet, locale, 0)], [text.maxHeight, formatted(layers, locale, 0)], [text.quantity, formatted(numeric(quantity), locale, 0)]]} note={text.note} /></>;
}

function LclTool({ locale }: { locale: Exclude<SiteLocale, "en"> }) {
  const text = coreToolCopy(locale); const [length, setLength] = useState("100"); const [width, setWidth] = useState("80"); const [height, setHeight] = useState("80"); const [quantity, setQuantity] = useState("10"); const [weight, setWeight] = useState("42"); const cbm = numeric(length) * numeric(width) * numeric(height) * numeric(quantity) / 1_000_000; const tonnes = numeric(weight) * numeric(quantity) / 1000; const wm = Math.max(cbm, tonnes);
  return <><div className="calc-card"><div className="calc-card-header"><h2>{text.lcl}</h2><span className="live-badge">{text.results}</span></div><div className="guided-promise"><span>{text.description}</span><strong>{text.title}</strong></div><div className="calc-form"><div className="field-grid"><Field label={text.length} value={length} setValue={setLength} unit="cm" /><Field label={text.width} value={width} setValue={setWidth} unit="cm" /><Field label={text.height} value={height} setValue={setHeight} unit="cm" /><Field label={text.quantity} value={quantity} setValue={setQuantity} unit="×" step="1" /><Field label={text.weight} value={weight} setValue={setWeight} unit="kg" /></div></div></div><Result heading={text.results} primary={`${formatted(wm, locale, 3)} W/M`} rows={[[text.cbm, `${formatted(cbm, locale, 3)} m³`], [text.tonnes, `${formatted(tonnes, locale, 3)} t`], [text.wm, `${formatted(wm, locale, 3)} W/M`], [text.quantity, formatted(numeric(quantity), locale, 0)]]} note={text.note} /></>;
}
