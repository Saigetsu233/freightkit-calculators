"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { trackAnalyticsEvent } from "./Analytics";
import { dutchRoadFreightStandards } from "../lib/locales";

type PalletPreset = "euro" | "block" | "custom";

const presets = {
  euro: { label: "Europallet (EPAL 1) · 120 × 80 cm", length: "120", width: "80" },
  block: { label: "Blokpallet (EPAL 2) · 120 × 100 cm", length: "120", width: "100" },
  custom: { label: "Eigen afmetingen", length: "120", width: "80" },
} as const;

function valueOf(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function format(value: number, digits = 2) {
  return new Intl.NumberFormat("nl-NL", { maximumFractionDigits: digits }).format(value);
}

export function DutchLoadMeterCalculator() {
  const [preset, setPreset] = useState<PalletPreset>("euro");
  const [length, setLength] = useState("120");
  const [width, setWidth] = useState("80");
  const [quantity, setQuantity] = useState("10");
  const [layers, setLayers] = useState("1");
  const [trailerWidth, setTrailerWidth] = useState(String(dutchRoadFreightStandards.trailerWorkingWidthMetres));
  const [copied, setCopied] = useState(false);
  const inputStarted = useRef(false);
  const completionTimer = useRef<number | null>(null);

  const result = useMemo(() => {
    const floorArea = valueOf(length) / 100 * (valueOf(width) / 100) * valueOf(quantity);
    const safeLayers = Math.max(Math.floor(valueOf(layers)), 1);
    const usableWidth = Math.max(valueOf(trailerWidth), .01);
    const loadMetres = floorArea / usableWidth / safeLayers;
    return {
      floorArea,
      loadMetres,
      trailerShare: loadMetres / dutchRoadFreightStandards.referenceTrailerLengthMetres * 100,
      euroPlaces: floorArea / .96 / safeLayers,
    };
  }, [length, width, quantity, layers, trailerWidth]);

  useEffect(() => {
    trackAnalyticsEvent("tool_open", "nl-laadmeter-calculator");
    trackAnalyticsEvent("calculator_visible", "nl-laadmeter-calculator");
    return () => {
      if (completionTimer.current) window.clearTimeout(completionTimer.current);
    };
  }, []);

  function trackCalculation() {
    if (!inputStarted.current) {
      inputStarted.current = true;
      trackAnalyticsEvent("input_started", "nl-laadmeter-calculator");
    }
    if (completionTimer.current) window.clearTimeout(completionTimer.current);
    completionTimer.current = window.setTimeout(() => trackAnalyticsEvent("calculation_completed", "nl-laadmeter-calculator"), 700);
  }

  function updatePreset(next: PalletPreset) {
    setPreset(next);
    if (next === "custom") return;
    setLength(presets[next].length);
    setWidth(presets[next].width);
    trackCalculation();
  }

  function update(setter: (value: string) => void, value: string) {
    setter(value);
    trackCalculation();
  }

  async function copyResult() {
    const summary = `Laadmeters: ${format(result.loadMetres)} LDM. Vloeroppervlak: ${format(result.floorArea)} m². Aandeel van 13,6 m trailer: ${format(result.trailerShare, 1)}%.`;
    try {
      await navigator.clipboard.writeText(summary);
      trackAnalyticsEvent("copy_result", "nl-laadmeter-calculator");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div data-calculator-root="nl-laadmeter-calculator">
      <div className="calc-card">
        <div className="calc-card-header"><h2>Vul uw zending in</h2><span className="live-badge">Direct resultaat</span></div>
        <div className="guided-promise"><span>Voorbeeld is al ingevuld</span><strong>Vervang alleen wat u weet</strong><p>De calculator gebruikt Nederlandse getalnotatie en Europese logistieke standaardmaten.</p></div>
        <div className="calc-form"><div className="field-grid">
          <div className="field field-wide"><label htmlFor="nl-pallet">Laadeenheid</label><select id="nl-pallet" value={preset} onChange={(event) => updatePreset(event.target.value as PalletPreset)}>{Object.entries(presets).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}</select></div>
          <div className="field"><label htmlFor="nl-length">Lengte</label><div className="input-pair"><input id="nl-length" type="number" min="0" inputMode="decimal" value={length} onChange={(event) => { setPreset("custom"); update(setLength, event.target.value); }} /><span className="input-unit">cm</span></div></div>
          <div className="field"><label htmlFor="nl-width">Breedte</label><div className="input-pair"><input id="nl-width" type="number" min="0" inputMode="decimal" value={width} onChange={(event) => { setPreset("custom"); update(setWidth, event.target.value); }} /><span className="input-unit">cm</span></div></div>
          <div className="field"><label htmlFor="nl-quantity">Aantal</label><input id="nl-quantity" type="number" min="0" step="1" inputMode="numeric" value={quantity} onChange={(event) => update(setQuantity, event.target.value)} /></div>
          <div className="field"><label htmlFor="nl-layers">Stapelbare lagen</label><input id="nl-layers" type="number" min="1" step="1" inputMode="numeric" value={layers} onChange={(event) => update(setLayers, event.target.value)} /><small>Gebruik 1 als de goederen niet stapelbaar zijn.</small></div>
          <div className="field field-wide"><label htmlFor="nl-trailer-width">Bruikbare trailerbreedte</label><div className="input-pair"><input id="nl-trailer-width" type="number" min="0.1" step="0.01" inputMode="decimal" value={trailerWidth} onChange={(event) => update(setTrailerWidth, event.target.value)} /><span className="input-unit">m</span></div><small>2,40 m is de gebruikelijke rekenbreedte voor LDM; pas dit aan volgens uw vervoerder.</small></div>
        </div></div>
      </div>
      <aside className="result-card" aria-live="polite">
        <p className="result-label">Benodigde laadruimte</p>
        <p className="result-primary">{format(result.loadMetres)} LDM</p>
        <div className="result-grid">
          <div className="result-metric"><span>Vloeroppervlak</span><strong>{format(result.floorArea)} m²</strong></div>
          <div className="result-metric"><span>Van een trailer van 13,6 m</span><strong>{format(result.trailerShare, 1)}%</strong></div>
          <div className="result-metric"><span>Europalletplaatsen</span><strong>{format(result.euroPlaces, 1)}</strong></div>
          <div className="result-metric"><span>Rekenbreedte</span><strong>{format(valueOf(trailerWidth))} m</strong></div>
        </div>
        <p className="result-note">Planningsschatting voor rechthoekige vloerplaatsen. Controleer stapelbaarheid, laadplan, aslasten en de werkelijke binnenmaten bij uw vervoerder.</p>
        <div className="result-actions"><button type="button" className="copy-button" onClick={copyResult}>{copied ? "Gekopieerd ✓" : "Kopieer resultaat"}</button><button type="button" className="copy-button" onClick={() => window.print()}>Resultaat afdrukken</button></div>
      </aside>
    </div>
  );
}
