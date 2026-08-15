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

function ProFrame({ title = "Tell us what you know", guidance, children }: { title?: string; guidance: string; children: React.ReactNode }) {
  return <div className="calc-card"><div className="calc-card-header"><h2>{title}</h2><span className="live-badge">Updates live</span></div><div className="guided-promise"><span>Example values are filled in</span><strong>Replace them with your shipment details</strong><p>{guidance}</p></div><div className="calc-form"><div className="field-grid">{children}</div></div></div>;
}

function OptionalFields({ title, children }: { title: string; children: React.ReactNode }) {
  return <details className="advanced-fields"><summary>{title}<span>Optional</span></summary><div className="advanced-field-grid">{children}</div></details>;
}

function ProResult({ label, primary, metrics, note, children }: { label: string; primary: string; metrics: Metric[]; note: string; children?: React.ReactNode }) {
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
      {children}
      <p className="result-note">{note}</p>
      <div className="result-actions"><button type="button" className="copy-button" onClick={copyResult}>{copied ? "Copied to clipboard ✓" : "Copy result summary"}</button><button type="button" className="copy-button" onClick={() => window.print()}>Print result</button></div>
    </aside>
  );
}

const carrierRules = [
  { key: "fedex", carrier: "FedEx", service: "Common U.S. parcel planning", imperialDivisor: 139, metricDivisor: 5000, imperialRounding: 1, metricRounding: .5 },
  { key: "ups-daily", carrier: "UPS Daily", service: "Account / daily-rate planning", imperialDivisor: 139, metricDivisor: 5000, imperialRounding: 1, metricRounding: .5 },
  { key: "ups-retail", carrier: "UPS Retail", service: "Retail-rate planning", imperialDivisor: 166, metricDivisor: 6000, imperialRounding: 1, metricRounding: 1 },
  { key: "usps", carrier: "USPS", service: "2026 competitive-product DIM factor", imperialDivisor: 139, metricDivisor: 5000, imperialRounding: 1, metricRounding: 1 },
  { key: "dhl", carrier: "DHL Express", service: "International express planning", imperialDivisor: 139, metricDivisor: 5000, imperialRounding: 1, metricRounding: .5 },
] as const;

const packagePresets = {
  custom: { label: "Enter my own package", metric: [40, 30, 25, 8], imperial: [16, 12, 10, 18] },
  small: { label: "Small parcel · about a shoe box", metric: [33, 20, 12, 2], imperial: [13, 8, 5, 4.5] },
  medium: { label: "Medium shipping box", metric: [45, 35, 25, 6], imperial: [18, 14, 10, 13] },
  large: { label: "Large lightweight box", metric: [60, 45, 40, 8], imperial: [24, 18, 16, 18] },
} as const;

export function DimensionalWeightPro() {
  const [system, setSystem] = useState<"imperial" | "metric">("imperial");
  const [packagePreset, setPackagePreset] = useState<keyof typeof packagePresets>("custom");
  const [length, setLength] = useState("16");
  const [width, setWidth] = useState("12");
  const [height, setHeight] = useState("10");
  const [actual, setActual] = useState("18");
  const [quantity, setQuantity] = useState("1");
  const [customDivisor, setCustomDivisor] = useState("");
  const metric = system === "metric";
  const qty = Math.max(Math.floor(numberValue(quantity)), 0);
  const unit = metric ? "kg" : "lb";
  const volume = numberValue(length) * numberValue(width) * numberValue(height);

  function applyPackagePreset(key: keyof typeof packagePresets, nextSystem = system) {
    setPackagePreset(key);
    if (key === "custom") return;
    const [nextLength, nextWidth, nextHeight, nextWeight] = packagePresets[key][nextSystem];
    setLength(String(nextLength));
    setWidth(String(nextWidth));
    setHeight(String(nextHeight));
    setActual(String(nextWeight));
  }

  function changeSystem(next: string) {
    const nextSystem = next as "imperial" | "metric";
    if (nextSystem === system) return;
    const lengthFactor = nextSystem === "metric" ? 2.54 : 1 / 2.54;
    const weightFactor = nextSystem === "metric" ? 0.453592 : 2.20462;
    setLength(String(Number((numberValue(length) * lengthFactor).toFixed(2))));
    setWidth(String(Number((numberValue(width) * lengthFactor).toFixed(2))));
    setHeight(String(Number((numberValue(height) * lengthFactor).toFixed(2))));
    setActual(String(Number((numberValue(actual) * weightFactor).toFixed(2))));
    setSystem(nextSystem);
    setPackagePreset("custom");
  }

  const comparisons = useMemo(() => carrierRules.map((rule) => {
    const divisor = metric ? rule.metricDivisor : rule.imperialDivisor;
    const rounding = metric ? rule.metricRounding : rule.imperialRounding;
    const dimensional = divisor ? volume / divisor : 0;
    const billable = roundUp(Math.max(dimensional, numberValue(actual)), rounding);
    return { ...rule, divisor, dimensional, billable, total: billable * qty, basis: dimensional > numberValue(actual) ? "DIM" : "Actual", penalty: Math.max(0, billable - numberValue(actual)) };
  }), [metric, volume, actual, qty]);

  const custom = numberValue(customDivisor) > 0 ? (() => {
    const dimensional = volume / numberValue(customDivisor);
    const billable = Math.max(dimensional, numberValue(actual));
    return { carrier: "Your contract", service: "Custom divisor", divisor: numberValue(customDivisor), dimensional, billable, total: billable * qty, basis: dimensional > numberValue(actual) ? "DIM" : "Actual", penalty: Math.max(0, billable - numberValue(actual)) };
  })() : null;
  const shownComparisons = custom ? [...comparisons, custom] : comparisons;
  const totals = shownComparisons.map((item) => item.total);
  const minimum = Math.min(...totals);
  const maximum = Math.max(...totals);
  const strictDivisor = metric ? 5000 : 139;
  const targetVolume = numberValue(actual) * strictDivisor;
  const shrinkPerSide = volume > targetVolume && volume > 0 ? (1 - Math.cbrt(targetVolume / volume)) * 100 : 0;
  const primary = Math.abs(maximum - minimum) < .001 ? `${formatNumber(minimum)} ${unit}` : `${formatNumber(minimum)}–${formatNumber(maximum)} ${unit}`;

  return <>
    <ProFrame title="Enter the package once" guidance="Use the finished outside dimensions and scale weight. We compare FedEx, UPS Daily, UPS Retail, USPS and DHL automatically—no divisor knowledge required.">
      <ProSelectField label="Measurement units" value={system} onChange={changeSystem} options={[{ value: "imperial", label: "Inches and pounds" }, { value: "metric", label: "Centimetres and kilograms" }]} />
      <ProSelectField label="Start with a common package" value={packagePreset} onChange={(value) => applyPackagePreset(value as keyof typeof packagePresets)} options={Object.entries(packagePresets).map(([value, item]) => ({ value, label: item.label }))} />
      <ProNumberField label="Packed parcel length" value={length} onChange={setLength} unit={metric ? "cm" : "in"} />
      <ProNumberField label="Packed parcel width" value={width} onChange={setWidth} unit={metric ? "cm" : "in"} />
      <ProNumberField label="Packed parcel height" value={height} onChange={setHeight} unit={metric ? "cm" : "in"} />
      <ProNumberField label="Scale weight for one parcel" value={actual} onChange={setActual} unit={unit} />
      <p className="quick-assumption field-wide"><strong>What happens next:</strong> each carrier row calculates dimensional weight, compares it with the scale weight, applies its planning increment, and shows the likely billable weight.</p>
      <OptionalFields title="Add parcel count or a contract divisor">
        <ProNumberField label="Number of identical parcels" value={quantity} onChange={setQuantity} step="1" />
        <ProNumberField label="Negotiated DIM divisor, if known" value={customDivisor} onChange={setCustomDivisor} unit={metric ? "cm³/kg" : "in³/lb"} hint="Leave blank to compare public planning rules only." />
      </OptionalFields>
    </ProFrame>
    <ProResult label={qty > 1 ? "Likely billed-weight range · shipment" : "Likely billed-weight range · parcel"} primary={primary} metrics={[
      { label: "Scale weight / parcel", value: `${formatNumber(numberValue(actual))} ${unit}` },
      { label: "Packages", value: formatNumber(qty, 0) },
      { label: "Strict DIM threshold", value: shrinkPerSide > 0 ? `Shrink each side ≈ ${formatNumber(shrinkPerSide, 1)}%` : "Actual weight already competitive" },
      { label: "Compared", value: `${shownComparisons.length} billing rules` },
    ]} note="These rows compare billable weight, not shipping price. Service eligibility, zone, negotiated terms, measurement rounding, minimums and surcharges can change the invoice.">
      <div className="carrier-comparison" role="table" aria-label="Carrier dimensional weight comparison">
        <div className="carrier-row carrier-head" role="row"><span>Carrier</span><span>DIM</span><span>Billable</span><span>Basis</span></div>
        {shownComparisons.map((item) => <div className="carrier-row" role="row" key={`${item.carrier}-${item.service}`}>
          <span><strong>{item.carrier}</strong><small>{item.service} · ÷ {formatNumber(item.divisor, 0)}</small></span>
          <span>{formatNumber(item.dimensional)} {unit}</span>
          <span><strong>{formatNumber(item.total)} {unit}</strong>{qty > 1 ? <small>{formatNumber(item.billable)} each</small> : null}</span>
          <span className={item.basis === "DIM" ? "basis-dim" : "basis-actual"}>{item.basis}{item.penalty > 0 ? <small>+{formatNumber(item.penalty)} {unit}</small> : null}</span>
        </div>)}
      </div>
    </ProResult>
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
    <ProFrame guidance="Pick a familiar pallet and enter the outside size of one sealed carton. The example already includes editable height and weight limits, so you can get a complete plan without knowing pallet formulas.">
      <ProSelectField label="Which pallet are you using?" value={presetKey} onChange={changePreset} options={Object.entries(palletPresets).map(([value, item]) => ({ value, label: item.label }))} wide />
      <ProNumberField label="Packed carton length" value={cartonLength} onChange={setCartonLength} unit="cm" />
      <ProNumberField label="Packed carton width" value={cartonWidth} onChange={setCartonWidth} unit="cm" />
      <ProNumberField label="Packed carton height" value={cartonHeight} onChange={setCartonHeight} unit="cm" />
      <ProNumberField label="Weight of one packed carton" value={cartonWeight} onChange={setCartonWeight} unit="kg" />
      <p className="quick-assumption field-wide"><strong>Planning limits in use:</strong> {formatNumber(numberValue(maxTotalHeight), 1)} cm total height and {formatNumber(numberValue(maxWeight), 0)} kg cargo. Change these only if your warehouse or carrier gave you different limits.</p>
      <OptionalFields title="Change pallet size or transport limits">
        <ProNumberField label="Pallet length" value={palletLength} onChange={(value) => { setPresetKey("custom"); setPalletLength(value); }} unit="cm" />
        <ProNumberField label="Pallet width" value={palletWidth} onChange={(value) => { setPresetKey("custom"); setPalletWidth(value); }} unit="cm" />
        <ProNumberField label="Pallet base height" value={baseHeight} onChange={setBaseHeight} unit="cm" />
        <ProNumberField label="Maximum total height" value={maxTotalHeight} onChange={setMaxTotalHeight} unit="cm" hint="Includes the pallet base." />
        <ProNumberField label="Maximum cargo weight" value={maxWeight} onChange={setMaxWeight} unit="kg" />
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
    { id: 1, description: "Cartons", length: "100", width: "80", height: "80", quantity: "10", weightEach: "42" },
  ]);
  const [minimumUnits, setMinimumUnits] = useState("1");
  const [rate, setRate] = useState("0");
  const [origin, setOrigin] = useState("0");
  const [destination, setDestination] = useState("0");
  const [documents, setDocuments] = useState("0");
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
  const hasPricing = variableRate > 0 || fixedFees > 0;

  return <>
      <ProFrame guidance="Enter the outside size, number and packed weight of each cargo type. We convert the shipment to CBM and tonnes, compare them and calculate W/M automatically. Quote prices are optional." title="Tell us what you know · cargo">
      <div className="cargo-lines field-wide">
        <div className="cargo-line cargo-line-head" aria-hidden="true"><span>Cargo type</span><span>Outside size (cm)</span><span>Pieces</span><span>Packed kg each</span><span /></div>
        {lines.map((line) => <div className="cargo-line" key={line.id}>
          <label><span>Cargo type</span><input value={line.description} onChange={(event) => updateLine(line.id, "description", event.target.value)} /></label>
          <div className="cargo-dimensions">
            {(["length", "width", "height"] as const).map((field) => <label key={field}><span>{field}</span><input type="number" min="0" inputMode="decimal" value={line[field]} onChange={(event) => updateLine(line.id, field, event.target.value)} /></label>)}
          </div>
          <label><span>Pieces</span><input type="number" min="0" step="1" inputMode="numeric" value={line.quantity} onChange={(event) => updateLine(line.id, "quantity", event.target.value)} /></label>
          <label><span>Packed kg each</span><input type="number" min="0" inputMode="decimal" value={line.weightEach} onChange={(event) => updateLine(line.id, "weightEach", event.target.value)} /></label>
          <button type="button" className="line-remove" onClick={() => setLines((current) => current.filter((item) => item.id !== line.id))} disabled={lines.length === 1} aria-label={`Remove ${line.description}`}>×</button>
        </div>)}
        <button type="button" className="add-line" onClick={addLine}>+ Add another cargo line</button>
      </div>
      <p className="quick-assumption field-wide"><strong>Planning rule in use:</strong> the larger of total CBM or metric tonnes, with a 1 W/M minimum. Open the quote section only if you have prices from a forwarder.</p>
      <OptionalFields title="Add quote pricing or change the minimum">
        <ProNumberField label="Minimum chargeable W/M" value={minimumUnits} onChange={setMinimumUnits} unit="units" />
        <ProNumberField label="Ocean rate / W/M" value={rate} onChange={setRate} unit="$" />
        <ProNumberField label="Other surcharge / W/M" value={otherPerWm} onChange={setOtherPerWm} unit="$" />
        <ProNumberField label="Origin fixed charges" value={origin} onChange={setOrigin} unit="$" />
        <ProNumberField label="Destination fixed charges" value={destination} onChange={setDestination} unit="$" />
        <ProNumberField label="Documentation / shipment" value={documents} onChange={setDocuments} unit="$" />
      </OptionalFields>
    </ProFrame>
    <ProResult label="Estimated chargeable LCL quantity" primary={`${formatNumber(chargeableUnits, 3)} W/M`} metrics={[
      { label: "Shipment volume", value: `${formatNumber(totals.cbm, 3)} CBM` },
      { label: "Gross weight", value: `${formatNumber(totals.kg, 1)} kg` },
      { label: "Charging basis", value: numberValue(minimumUnits) > rawUnits ? "Minimum" : totals.cbm >= tonnes ? "Volume" : "Weight" },
      { label: "Minimum used", value: `${formatNumber(minimumUnits, 3)} W/M` },
      { label: "All-in quote estimate", value: hasPricing ? `$${formatMoney(total)}` : "Add quote prices if needed" },
      { label: "Pieces entered", value: formatNumber(totals.pieces, 0) },
    ]} note="This gives you the physical W/M basis without requiring a freight quote. Your forwarder’s tariff still controls minimums, rounding, density rules and local charges." />
  </>;
}
