"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { trackAnalyticsEvent } from "./Analytics";
import type { RegionalFreightConfig } from "../lib/regional-freight";

function validNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function RegionalFreightCalculator({ config }: { config: RegionalFreightConfig }) {
  const first = config.pallets[0];
  const [preset, setPreset] = useState(first.key);
  const [length, setLength] = useState(String(first.length));
  const [width, setWidth] = useState(String(first.width));
  const [quantity, setQuantity] = useState("10");
  const [layers, setLayers] = useState("1");
  const [workingWidth, setWorkingWidth] = useState(String(config.planningWidth));
  const [copied, setCopied] = useState(false);
  const inputStarted = useRef(false);
  const completionTimer = useRef<number | null>(null);
  const analyticsPage = `${config.locale}-regional-freight-calculator`;

  const result = useMemo(() => {
    const safeLayers = Math.max(Math.floor(validNumber(layers)), 1);
    const safeWidth = Math.max(validNumber(workingWidth), 0.01);
    const floorArea = validNumber(length) / 100 * (validNumber(width) / 100) * validNumber(quantity);
    const loadLength = floorArea / safeWidth / safeLayers;
    const firstPalletArea = first.length / 100 * (first.width / 100);
    return {
      floorArea,
      loadLength,
      vehicleShare: loadLength / config.referenceVehicleLength * 100,
      palletEquivalents: floorArea / firstPalletArea / safeLayers,
    };
  }, [config.referenceVehicleLength, first.length, first.width, layers, length, quantity, width, workingWidth]);

  function format(value: number, digits = 2) {
    return new Intl.NumberFormat(config.intlLocale, { maximumFractionDigits: digits }).format(value);
  }

  useEffect(() => {
    trackAnalyticsEvent("tool_open", analyticsPage);
    trackAnalyticsEvent("calculator_visible", analyticsPage);
    return () => {
      if (completionTimer.current) window.clearTimeout(completionTimer.current);
    };
  }, [analyticsPage]);

  function trackCalculation() {
    if (!inputStarted.current) {
      inputStarted.current = true;
      trackAnalyticsEvent("input_started", analyticsPage);
    }
    if (completionTimer.current) window.clearTimeout(completionTimer.current);
    completionTimer.current = window.setTimeout(() => trackAnalyticsEvent("calculation_completed", analyticsPage), 700);
  }

  function update(setter: (value: string) => void, value: string) {
    setter(value);
    trackCalculation();
  }

  function updatePreset(key: string) {
    setPreset(key);
    const selected = config.pallets.find((item) => item.key === key);
    if (selected) {
      setLength(String(selected.length));
      setWidth(String(selected.width));
    }
    trackCalculation();
  }

  async function copyResult() {
    try {
      const summary = config.copySummary
        .replace("{length}", format(result.loadLength))
        .replace("{area}", format(result.floorArea))
        .replace("{share}", format(result.vehicleShare, 1));
      await navigator.clipboard.writeText(summary);
      trackAnalyticsEvent("copy_result", analyticsPage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div data-calculator-root={analyticsPage}>
      <div className="calc-card">
        <div className="calc-card-header"><h2>{config.calculatorTitle}</h2><span className="live-badge">{config.liveResult}</span></div>
        <div className="guided-promise"><span>{config.exampleTitle}</span><strong>{config.exampleStrong}</strong><p>{config.exampleCopy}</p></div>
        <div className="calc-form"><div className="field-grid">
          <div className="field field-wide"><label htmlFor={`${config.locale}-pallet`}>{config.loadUnitLabel}</label><select id={`${config.locale}-pallet`} value={preset} onChange={(event) => updatePreset(event.target.value)}>{config.pallets.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}<option value="custom">{config.customLabel}</option></select></div>
          <div className="field"><label htmlFor={`${config.locale}-length`}>{config.lengthLabel}</label><div className="input-pair"><input id={`${config.locale}-length`} type="number" min="0" inputMode="decimal" value={length} onChange={(event) => { setPreset("custom"); update(setLength, event.target.value); }} /><span className="input-unit">cm</span></div></div>
          <div className="field"><label htmlFor={`${config.locale}-width`}>{config.widthLabel}</label><div className="input-pair"><input id={`${config.locale}-width`} type="number" min="0" inputMode="decimal" value={width} onChange={(event) => { setPreset("custom"); update(setWidth, event.target.value); }} /><span className="input-unit">cm</span></div></div>
          <div className="field"><label htmlFor={`${config.locale}-quantity`}>{config.quantityLabel}</label><input id={`${config.locale}-quantity`} type="number" min="0" step="1" inputMode="numeric" value={quantity} onChange={(event) => update(setQuantity, event.target.value)} /></div>
          <div className="field"><label htmlFor={`${config.locale}-layers`}>{config.layersLabel}</label><input id={`${config.locale}-layers`} type="number" min="1" step="1" inputMode="numeric" value={layers} onChange={(event) => update(setLayers, event.target.value)} /><small>{config.layersHelp}</small></div>
          <div className="field field-wide"><label htmlFor={`${config.locale}-working-width`}>{config.workingWidthLabel}</label><div className="input-pair"><input id={`${config.locale}-working-width`} type="number" min="0.1" step="0.01" inputMode="decimal" value={workingWidth} onChange={(event) => update(setWorkingWidth, event.target.value)} /><span className="input-unit">m</span></div><small>{config.workingWidthHelp}</small></div>
        </div></div>
      </div>
      <aside className="result-card" aria-live="polite">
        <p className="result-label">{config.resultLabel}</p>
        <p className="result-primary">{format(result.loadLength)} {config.resultUnit}</p>
        <div className="result-grid">
          <div className="result-metric"><span>{config.floorAreaLabel}</span><strong>{format(result.floorArea)} m²</strong></div>
          <div className="result-metric"><span>{config.vehicleShareLabel}</span><strong>{format(result.vehicleShare, 1)}%</strong></div>
          <div className="result-metric"><span>{config.palletEquivalentLabel}</span><strong>{format(result.palletEquivalents, 1)}</strong></div>
          <div className="result-metric"><span>{config.calculationWidthLabel}</span><strong>{format(validNumber(workingWidth))} m</strong></div>
        </div>
        <p className="result-note">{config.resultNote}</p>
        <div className="result-actions"><button type="button" className="copy-button" onClick={copyResult}>{copied ? config.copiedLabel : config.copyLabel}</button><button type="button" className="copy-button" onClick={() => window.print()}>{config.printLabel}</button></div>
      </aside>
    </div>
  );
}
