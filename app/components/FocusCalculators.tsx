"use client";

import { useId, useMemo, useState } from "react";
import { trackAnalyticsEvent } from "./Analytics";

type Metric = { label: string; value: string };

function numberValue(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function formatNumber(value: number, digits = 2) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(value);
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

function roundUp(value: number, increment: number) {
  return increment > 0 ? Math.ceil((value - Number.EPSILON) / increment) * increment : value;
}

function ProNumberField({ label, value, onChange, unit, hint, step = "any" }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  hint?: string;
  step?: string;
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className={unit ? "input-pair" : undefined}>
        <input id={id} type="number" min="0" step={step} inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} />
        {unit ? <span className="input-unit" aria-hidden="true">{unit}</span> : null}
      </div>
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}

function ProSelectField({ label, value, onChange, options, wide = false }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  wide?: boolean;
}) {
  const id = useId();
  return (
    <div className={`field${wide ? " field-wide" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  );
}

function ProFrame({ title = "Your inputs", children }: { title?: string; children: React.ReactNode }) {
  return <div className="calc-card"><div className="calc-card-header"><h2>{title}</h2><span className="live-badge">Live result</span></div><div className="calc-form"><div className="field-grid">{children}</div></div></div>;
}

function OptionalFields({ title, children }: { title: string; children: React.ReactNode }) {
  return <details className="advanced-fields"><summary>{title}<span>Optional</span></summary><div className="advanced-field-grid">{children}</div></details>;
}

function ProResult({ label, primary, metrics, note }: { label: string; primary: string; metrics: Metric[]; note: string }) {
  const [copied, setCopied] = useState(false);
  const summary = `${label}: ${primary}. ${metrics.map((metric) => `${metric.label}: ${metric.value}`).join(". ")}.`;

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(summary);
      trackAnalyticsEvent("copy_result", window.location.pathname.replace(/^\/(tools|embed)\//, ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <aside className="result-card" aria-live="polite">
      <p className="result-label">{label}</p>
      <p className="result-primary">{primary}</p>
      <div className="result-grid">
        {metrics.map((metric) => <div className="result-metric" key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong></div>)}
      </div>
      <p className="result-note">{note}</p>
      <div className="result-actions"><button type="button" className="copy-button" onClick={copyResult}>{copied ? "Copied to clipboard ✓" : "Copy result summary"}</button><button type="button" className="copy-button" onClick={() => window.print()}>Print result</button></div>
    </aside>
  );
}

const dimPresets = {
  "dhl-metric": { label: "DHL Express — metric ÷ 5,000", system: "metric", divisor: 5000, rounding: .5 },
  "fedex-us": { label: "FedEx — US/international ÷ 139", system: "imperial", divisor: 139, rounding: 1 },
  "ups-daily": { label: "UPS Daily Rates — ÷ 139", system: "imperial", divisor: 139, rounding: 1 },
  "ups-retail": { label: "UPS Retail Rates — ÷ 166", system: "imperial", divisor: 166, rounding: 1 },
  "usps": { label: "USPS — ÷ 166 (eligibility rules apply)", system: "imperial", divisor: 166, rounding: 1 },
  "custom-metric": { label: "Custom metric rule", system: "metric", divisor: 5000, rounding: 0 },
  "custom-imperial": { label: "Custom imperial rule", system: "imperial", divisor: 139, rounding: 0 },
} as const;

export function DimensionalWeightPro() {
  const [presetKey, setPresetKey] = useState<keyof typeof dimPresets>("dhl-metric");
  const [length, setLength] = useState("40");
  const [width, setWidth] = useState("30");
  const [height, setHeight] = useState("25");
  const [actual, setActual] = useState("8");
  const [quantity, setQuantity] = useState("1");
  const [customDivisor, setCustomDivisor] = useState("5000");
  const [rounding, setRounding] = useState("preset");
  const preset = dimPresets[presetKey];
  const metric = preset.system === "metric";
  const isCustom = presetKey.startsWith("custom");
  const divisor = isCustom ? numberValue(customDivisor) : preset.divisor;
  const roundingIncrement = rounding === "preset" ? preset.rounding : numberValue(rounding);
  const dimPer = divisor ? numberValue(length) * numberValue(width) * numberValue(height) / divisor : 0;
  const rawChargeablePer = Math.max(dimPer, numberValue(actual));
  const chargeablePer = roundUp(rawChargeablePer, roundingIncrement);
  const qty = Math.max(Math.floor(numberValue(quantity)), 0);
  const total = chargeablePer * qty;
  const unit = metric ? "kg" : "lb";

  function changePreset(value: string) {
    const next = value as keyof typeof dimPresets;
    setPresetKey(next);
    setCustomDivisor(String(dimPresets[next].divisor));
    setRounding("preset");
  }

  return <>
    <ProFrame>
      <ProSelectField label="Carrier / rate preset" value={presetKey} onChange={changePreset} options={Object.entries(dimPresets).map(([value, item]) => ({ value, label: item.label }))} wide />
      <ProNumberField label="Length" value={length} onChange={setLength} unit={metric ? "cm" : "in"} />
      <ProNumberField label="Width" value={width} onChange={setWidth} unit={metric ? "cm" : "in"} />
      <ProNumberField label="Height" value={height} onChange={setHeight} unit={metric ? "cm" : "in"} />
      <ProNumberField label="Actual weight / parcel" value={actual} onChange={setActual} unit={unit} />
      <OptionalFields title="Add parcel count, divisor or rounding">
        <ProNumberField label="Number of identical parcels" value={quantity} onChange={setQuantity} step="1" />
        {isCustom ? <ProNumberField label="Custom DIM divisor" value={customDivisor} onChange={setCustomDivisor} unit={metric ? "cm³/kg" : "in³/lb"} /> : <div className="field"><label>DIM divisor</label><div className="readout-field">{formatNumber(divisor, 0)} {metric ? "cm³/kg" : "in³/lb"}</div></div>}
        <ProSelectField label="Chargeable-weight rounding" value={rounding} onChange={setRounding} options={[
          { value: "preset", label: `Preset (${preset.rounding ? `up to ${preset.rounding} ${unit}` : "no rounding"})` },
          { value: "0", label: "No rounding" },
          { value: "0.5", label: `Round up to 0.5 ${unit}` },
          { value: "1", label: `Round up to 1 ${unit}` },
        ]} />
      </OptionalFields>
    </ProFrame>
    <ProResult label="Estimated chargeable weight" primary={`${formatNumber(total)} ${unit}`} metrics={[
      { label: "Dimensional / parcel", value: `${formatNumber(dimPer)} ${unit}` },
      { label: "Actual / parcel", value: `${formatNumber(numberValue(actual))} ${unit}` },
      { label: "Chargeable / parcel", value: `${formatNumber(chargeablePer)} ${unit}` },
      { label: "Weight basis", value: dimPer > numberValue(actual) ? "Dimensional" : "Actual" },
    ]} note="Preset rules are planning references. Confirm service eligibility, measurement rounding, divisor, and billing increments on your current rate card." />
  </>;
}

const palletPresets = {
  euro: { label: "EUR / EPAL — 120 × 80 cm", length: 120, width: 80, base: 14.4 },
  industrial: { label: "Industrial / ISO — 120 × 100 cm", length: 120, width: 100, base: 15 },
  gma: { label: "GMA North America — 48 × 40 in", length: 121.92, width: 101.6, base: 14.4 },
  half: { label: "Half Euro — 80 × 60 cm", length: 80, width: 60, base: 14.4 },
  custom: { label: "Custom pallet", length: 120, width: 100, base: 15 },
} as const;

function PalletPattern({ across, deep, orientation }: { across: number; deep: number; orientation: string }) {
  const visibleAcross = Math.min(across, 12);
  const visibleDeep = Math.min(deep, 8);
  const cellCount = Math.max(visibleAcross * visibleDeep, 1);
  return (
    <div className="pattern-card">
      <div><span>Layer pattern</span><strong>{across} × {deep} · {orientation}</strong></div>
      <div className="pallet-pattern" style={{ gridTemplateColumns: `repeat(${Math.max(visibleAcross, 1)}, minmax(0, 1fr))` }} aria-label={`${across} by ${deep} carton layer pattern`}>
        {Array.from({ length: cellCount }, (_, index) => <span key={index} />)}
      </div>
      {(visibleAcross !== across || visibleDeep !== deep) ? <small>Preview condensed; totals use the full pattern.</small> : null}
    </div>
  );
}

export function PalletLoadPro() {
  const [presetKey, setPresetKey] = useState<keyof typeof palletPresets>("industrial");
  const [palletLength, setPalletLength] = useState("120");
  const [palletWidth, setPalletWidth] = useState("100");
  const [baseHeight, setBaseHeight] = useState("15");
  const [maxTotalHeight, setMaxTotalHeight] = useState("165");
  const [maxWeight, setMaxWeight] = useState("1000");
  const [cartonLength, setCartonLength] = useState("40");
  const [cartonWidth, setCartonWidth] = useState("30");
  const [cartonHeight, setCartonHeight] = useState("25");
  const [cartonWeight, setCartonWeight] = useState("12");

  function changePreset(value: string) {
    const next = value as keyof typeof palletPresets;
    const preset = palletPresets[next];
    setPresetKey(next);
    if (next !== "custom") {
      setPalletLength(String(preset.length));
      setPalletWidth(String(preset.width));
      setBaseHeight(String(preset.base));
    }
  }

  const pattern = useMemo(() => {
    const pL = numberValue(palletLength); const pW = numberValue(palletWidth);
    const cL = numberValue(cartonLength); const cW = numberValue(cartonWidth);
    const options = [
      { across: cL ? Math.floor(pL / cL) : 0, deep: cW ? Math.floor(pW / cW) : 0, orientation: `${formatNumber(cL, 1)} × ${formatNumber(cW, 1)} cm` },
      { across: cW ? Math.floor(pL / cW) : 0, deep: cL ? Math.floor(pW / cL) : 0, orientation: `${formatNumber(cW, 1)} × ${formatNumber(cL, 1)} cm` },
    ].map((item) => ({ ...item, count: item.across * item.deep }));
    return options.sort((a, b) => b.count - a.count)[0];
  }, [palletLength, palletWidth, cartonLength, cartonWidth]);

  const usableHeight = Math.max(numberValue(maxTotalHeight) - numberValue(baseHeight), 0);
  const maxLayers = numberValue(cartonHeight) ? Math.floor(usableHeight / numberValue(cartonHeight)) : 0;
  const spatialCapacity = pattern.count * maxLayers;
  const weightCapacity = numberValue(cartonWeight) ? Math.floor(numberValue(maxWeight) / numberValue(cartonWeight)) : 0;
  const totalCartons = Math.min(spatialCapacity, weightCapacity);
  const usedLayers = pattern.count ? Math.ceil(totalCartons / pattern.count) : 0;
  const finishedHeight = numberValue(baseHeight) + usedLayers * numberValue(cartonHeight);
  const footprintUtilisation = numberValue(palletLength) * numberValue(palletWidth)
    ? pattern.count * numberValue(cartonLength) * numberValue(cartonWidth) / (numberValue(palletLength) * numberValue(palletWidth)) * 100
    : 0;

  return <>
    <ProFrame>
      <ProSelectField label="Pallet preset" value={presetKey} onChange={changePreset} options={Object.entries(palletPresets).map(([value, item]) => ({ value, label: item.label }))} wide />
      <ProNumberField label="Pallet length" value={palletLength} onChange={(value) => { setPresetKey("custom"); setPalletLength(value); }} unit="cm" />
      <ProNumberField label="Pallet width" value={palletWidth} onChange={(value) => { setPresetKey("custom"); setPalletWidth(value); }} unit="cm" />
      <ProNumberField label="Carton length" value={cartonLength} onChange={setCartonLength} unit="cm" />
      <ProNumberField label="Carton width" value={cartonWidth} onChange={setCartonWidth} unit="cm" />
      <ProNumberField label="Carton height" value={cartonHeight} onChange={setCartonHeight} unit="cm" />
      <OptionalFields title="Add height, weight and pallet constraints">
        <ProNumberField label="Pallet base height" value={baseHeight} onChange={setBaseHeight} unit="cm" />
        <ProNumberField label="Maximum total height" value={maxTotalHeight} onChange={setMaxTotalHeight} unit="cm" hint="Includes the pallet base." />
        <ProNumberField label="Maximum cargo weight" value={maxWeight} onChange={setMaxWeight} unit="kg" />
        <ProNumberField label="Gross carton weight" value={cartonWeight} onChange={setCartonWeight} unit="kg" />
      </OptionalFields>
      <div className="field-wide"><PalletPattern across={pattern.across} deep={pattern.deep} orientation={pattern.orientation} /></div>
    </ProFrame>
    <ProResult label="Estimated pallet capacity" primary={`${formatNumber(totalCartons, 0)} cartons`} metrics={[
      { label: "Cartons / layer", value: formatNumber(pattern.count, 0) },
      { label: "Layers used", value: `${usedLayers} of ${maxLayers}` },
      { label: "Finished height", value: `${formatNumber(finishedHeight, 1)} cm` },
      { label: "Loaded cargo weight", value: `${formatNumber(totalCartons * numberValue(cartonWeight), 0)} kg` },
      { label: "Footprint use", value: `${formatNumber(footprintUtilisation, 1)}%` },
      { label: "Limiting factor", value: weightCapacity < spatialCapacity ? "Weight" : "Height / footprint" },
    ]} note="Geometry is not a safety approval. Verify pallet rating, carton compression, stability, overhang policy, handling equipment, and transport limits." />
  </>;
}

type CargoLine = { id: number; description: string; length: string; width: string; height: string; quantity: string; weightEach: string };

export function LclChargePro() {
  const [lines, setLines] = useState<CargoLine[]>([
    { id: 1, description: "Cartons", length: "100", width: "80", height: "80", quantity: "10", weightEach: "420" },
  ]);
  const [minimumUnits, setMinimumUnits] = useState("1");
  const [rate, setRate] = useState("58");
  const [origin, setOrigin] = useState("145");
  const [destination, setDestination] = useState("260");
  const [documents, setDocuments] = useState("65");
  const [otherPerWm, setOtherPerWm] = useState("0");

  function updateLine(id: number, field: keyof CargoLine, value: string) {
    setLines((current) => current.map((line) => line.id === id ? { ...line, [field]: value } : line));
  }

  function addLine() {
    setLines((current) => [...current, { id: Math.max(...current.map((line) => line.id), 0) + 1, description: `Cargo ${current.length + 1}`, length: "100", width: "100", height: "100", quantity: "1", weightEach: "100" }]);
  }

  const totals = useMemo(() => lines.reduce((result, line) => {
    const quantity = numberValue(line.quantity);
    result.cbm += numberValue(line.length) * numberValue(line.width) * numberValue(line.height) * quantity / 1_000_000;
    result.kg += numberValue(line.weightEach) * quantity;
    result.pieces += quantity;
    return result;
  }, { cbm: 0, kg: 0, pieces: 0 }), [lines]);
  const tonnes = totals.kg / 1000;
  const rawUnits = Math.max(totals.cbm, tonnes);
  const chargeableUnits = Math.max(rawUnits, numberValue(minimumUnits));
  const variableRate = numberValue(rate) + numberValue(otherPerWm);
  const ocean = chargeableUnits * numberValue(rate);
  const wmSurcharges = chargeableUnits * numberValue(otherPerWm);
  const fixedFees = numberValue(origin) + numberValue(destination) + numberValue(documents);
  const total = ocean + wmSurcharges + fixedFees;

  return <>
      <ProFrame title="Your inputs · cargo lines & quote">
      <div className="cargo-lines field-wide">
        <div className="cargo-line cargo-line-head" aria-hidden="true"><span>Description</span><span>L × W × H (cm)</span><span>Pieces</span><span>kg / piece</span><span /></div>
        {lines.map((line) => <div className="cargo-line" key={line.id}>
          <label><span>Description</span><input value={line.description} onChange={(event) => updateLine(line.id, "description", event.target.value)} /></label>
          <div className="cargo-dimensions">
            {(["length", "width", "height"] as const).map((field) => <label key={field}><span>{field}</span><input type="number" min="0" inputMode="decimal" value={line[field]} onChange={(event) => updateLine(line.id, field, event.target.value)} /></label>)}
          </div>
          <label><span>Pieces</span><input type="number" min="0" step="1" inputMode="numeric" value={line.quantity} onChange={(event) => updateLine(line.id, "quantity", event.target.value)} /></label>
          <label><span>kg / piece</span><input type="number" min="0" inputMode="decimal" value={line.weightEach} onChange={(event) => updateLine(line.id, "weightEach", event.target.value)} /></label>
          <button type="button" className="line-remove" onClick={() => setLines((current) => current.filter((item) => item.id !== line.id))} disabled={lines.length === 1} aria-label={`Remove ${line.description}`}>×</button>
        </div>)}
        <button type="button" className="add-line" onClick={addLine}>+ Add another cargo line</button>
      </div>
      <ProNumberField label="Minimum chargeable W/M" value={minimumUnits} onChange={setMinimumUnits} unit="units" />
      <ProNumberField label="Ocean rate / W/M" value={rate} onChange={setRate} unit="$" />
      <OptionalFields title="Add surcharges and local charges">
        <ProNumberField label="Other surcharge / W/M" value={otherPerWm} onChange={setOtherPerWm} unit="$" />
        <ProNumberField label="Origin fixed charges" value={origin} onChange={setOrigin} unit="$" />
        <ProNumberField label="Destination fixed charges" value={destination} onChange={setDestination} unit="$" />
        <ProNumberField label="Documentation / shipment" value={documents} onChange={setDocuments} unit="$" />
      </OptionalFields>
    </ProFrame>
    <ProResult label="Estimated all-in LCL charges" primary={`$${formatMoney(total)}`} metrics={[
      { label: "Shipment volume", value: `${formatNumber(totals.cbm, 3)} CBM` },
      { label: "Gross weight", value: `${formatNumber(totals.kg, 1)} kg` },
      { label: "Chargeable W/M", value: `${formatNumber(chargeableUnits, 3)} units` },
      { label: "Charging basis", value: numberValue(minimumUnits) > rawUnits ? "Minimum" : totals.cbm >= tonnes ? "Volume" : "Weight" },
      { label: "Variable charges", value: `$${formatMoney(chargeableUnits * variableRate)}` },
      { label: "Fixed charges", value: `$${formatMoney(fixedFees)}` },
    ]} note="All monetary inputs must use one currency. Your forwarder’s tariff controls minimums, rounding, density rules, and which local charges apply." />
  </>;
}
