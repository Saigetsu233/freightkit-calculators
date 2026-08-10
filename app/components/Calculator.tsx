"use client";

import { useEffect, useMemo, useState } from "react";
import { DimensionalWeightPro, LclChargePro, PalletLoadPro } from "./FocusCalculators";
import { trackAnalyticsEvent } from "./Analytics";

type Metric = { label: string; value: string };

function n(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function fmt(value: number, digits = 2) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(value);
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

function encodeShareState(values: Array<{ value: string; checked?: boolean }>) {
  const bytes = new TextEncoder().encode(JSON.stringify(values));
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeShareState(value: string): Array<{ value: string; checked?: boolean }> {
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - value.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const decoded = JSON.parse(new TextDecoder().decode(bytes));
    return Array.isArray(decoded) ? decoded.filter((field): field is { value: string; checked?: boolean } => typeof field?.value === "string") : [];
  } catch {
    return [];
  }
}

function NumberField({ label, value, onChange, unit, step = "any", hint, wide = false }: {
  label: string; value: string; onChange: (value: string) => void; unit?: string; step?: string; hint?: string; wide?: boolean;
}) {
  return (
    <div className={`field${wide ? " field-wide" : ""}`}>
      <label>{label}</label>
      {unit ? (
        <div className="input-pair">
          <input type="number" min="0" step={step} inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} />
          <select value={unit} aria-label={`${label} unit`} disabled><option>{unit}</option></select>
        </div>
      ) : (
        <input type="number" min="0" step={step} inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} />
      )}
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}

function SelectField({ label, value, onChange, options, wide = false }: {
  label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }>; wide?: boolean;
}) {
  return (
    <div className={`field${wide ? " field-wide" : ""}`}>
      <label>{label}</label>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  );
}

function ResultPanel({ label, primary, metrics, note }: { label: string; primary: string; metrics: Metric[]; note: string }) {
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

  async function copyDecisionCard() {
    const title = document.querySelector("h1")?.textContent?.trim() ?? label;
    const card = [title, `${label}: ${primary}`, ...metrics.map((metric) => `${metric.label}: ${metric.value}`), `Source: ${window.location.origin}${window.location.pathname}`].join("\n");
    try {
      await navigator.clipboard.writeText(card);
      trackAnalyticsEvent("decision_card_copy", window.location.pathname.replace(/^\/(tools|embed)\//, ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function shareLink() {
    const root = document.querySelector<HTMLElement>("[data-calculator-root]");
    const values = Array.from(root?.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input,select") ?? []).map((element) => ({
      value: element.value,
      ...(element instanceof HTMLInputElement && element.type === "checkbox" ? { checked: element.checked } : {}),
    }));
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("share", encodeShareState(values));
    try {
      await navigator.clipboard.writeText(url.toString());
      trackAnalyticsEvent("share_link_copy", window.location.pathname.replace(/^\/(tools|embed)\//, ""));
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
      <div className="result-actions"><button type="button" className="copy-button" onClick={copyResult}>{copied ? "Copied to clipboard ✓" : "Copy result summary"}</button><button type="button" className="copy-button" onClick={copyDecisionCard}>Copy decision card</button><button type="button" className="copy-button" onClick={shareLink}>Share this estimate</button><button type="button" className="copy-button" onClick={() => window.print()}>Print result</button></div>
    </aside>
  );
}

type NextStep = { href: string; title: string; description: string };

function CalculatorNextSteps({ steps }: { steps: NextStep[] }) {
  if (!steps.length) return null;
  return <section className="calculator-next-steps" aria-label="Related next steps"><span className="calculator-kicker">After this calculation</span><div>{steps.map((step) => <a href={step.href} key={step.href}><strong>{step.title}</strong><span>{step.description}</span><b>Continue →</b></a>)}</div></section>;
}

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="calc-card"><div className="calc-card-header"><h2>Tell us what you know</h2><span className="live-badge">Live result</span></div><div className="guided-promise"><span>Answer ordinary shipping questions</span><strong>No freight expertise needed</strong><p>Use measurements, quantities or costs you already have. The worked example is ready to use, and ShipMathLab handles the formula and unit conversion while you edit.</p></div><div className="calc-form"><div className="field-grid">{children}</div></div></div>;
}

function CbmCalculator() {
  const [unit, setUnit] = useState("cm"); const [length, setLength] = useState("60"); const [width, setWidth] = useState("40"); const [height, setHeight] = useState("35"); const [quantity, setQuantity] = useState("24");
  const factors: Record<string, number> = { cm: .01, m: 1, in: .0254, ft: .3048 }; const total = n(length) * n(width) * n(height) * Math.pow(factors[unit], 3) * n(quantity);
  return <><Frame><SelectField label="Dimension unit" value={unit} onChange={setUnit} options={[{value:"cm",label:"Centimetres (cm)"},{value:"m",label:"Metres (m)"},{value:"in",label:"Inches (in)"},{value:"ft",label:"Feet (ft)"}]} wide /><NumberField label="Length" value={length} onChange={setLength} unit={unit} /><NumberField label="Width" value={width} onChange={setWidth} unit={unit} /><NumberField label="Height" value={height} onChange={setHeight} unit={unit} /><NumberField label="Quantity" value={quantity} onChange={setQuantity} step="1" /></Frame><ResultPanel label="Total shipment volume" primary={`${fmt(total, 3)} m³`} metrics={[{label:"Cubic feet",value:`${fmt(total * 35.3147, 2)} ft³`},{label:"Litres",value:`${fmt(total * 1000, 1)} L`},{label:"Volume / carton",value:`${fmt(total / Math.max(n(quantity),1), 4)} m³`},{label:"Cartons",value:fmt(n(quantity),0)}]} note="Volume uses outside carton dimensions and does not add pallet or loading clearance." /></>;
}

const rotations = (a: number, b: number, c: number) => [[a,b,c],[a,c,b],[b,a,c],[b,c,a],[c,a,b],[c,b,a]];

function CartonFit() {
  const [boxL,setBoxL]=useState("60"); const [boxW,setBoxW]=useState("40"); const [boxH,setBoxH]=useState("40"); const [itemL,setItemL]=useState("18"); const [itemW,setItemW]=useState("12"); const [itemH,setItemH]=useState("8");
  const best = useMemo(() => rotations(n(itemL),n(itemW),n(itemH)).map(([l,w,h])=>({l,w,h,x:l?Math.floor(n(boxL)/l):0,y:w?Math.floor(n(boxW)/w):0,z:h?Math.floor(n(boxH)/h):0})).map(r=>({...r,count:r.x*r.y*r.z})).sort((a,b)=>b.count-a.count)[0], [boxL,boxW,boxH,itemL,itemW,itemH]);
  const cartonVol=n(boxL)*n(boxW)*n(boxH); const used=best.count*best.l*best.w*best.h; const utilization=cartonVol ? used/cartonVol*100 : 0;
  return <><Frame><NumberField label="Carton length" value={boxL} onChange={setBoxL} unit="cm"/><NumberField label="Carton width" value={boxW} onChange={setBoxW} unit="cm"/><NumberField label="Carton height" value={boxH} onChange={setBoxH} unit="cm"/><span/><NumberField label="Item length" value={itemL} onChange={setItemL} unit="cm"/><NumberField label="Item width" value={itemW} onChange={setItemW} unit="cm"/><NumberField label="Item height" value={itemH} onChange={setItemH} unit="cm"/></Frame><ResultPanel label="Best straight-row fit" primary={`${fmt(best.count,0)} items`} metrics={[{label:"Arrangement",value:`${best.x} × ${best.y} × ${best.z}`},{label:"Item orientation",value:`${fmt(best.l)} × ${fmt(best.w)} × ${fmt(best.h)} cm`},{label:"Volume utilisation",value:`${fmt(utilization,1)}%`},{label:"Rotations checked",value:"6"}]} note="This is an orthogonal grid estimate. Add real clearance and packing material before production." /></>;
}

function ContainerLoading() {
  const presets: Record<string,{label:string;l:number;w:number;h:number}>={"20std":{label:"20ft standard",l:589.8,w:235.2,h:239.3},"40std":{label:"40ft standard",l:1203.2,w:235.2,h:239.3},"40hc":{label:"40ft high cube",l:1203.2,w:235.2,h:269.8}}; const [preset,setPreset]=useState("20std"); const [cartonL,setCartonL]=useState("60"); const [cartonW,setCartonW]=useState("40"); const [cartonH,setCartonH]=useState("35"); const box=presets[preset];
  const best=useMemo(()=>rotations(n(cartonL),n(cartonW),n(cartonH)).map(([l,w,h])=>({l,w,h,x:l?Math.floor(box.l/l):0,y:w?Math.floor(box.w/w):0,z:h?Math.floor(box.h/h):0})).map(r=>({...r,count:r.x*r.y*r.z})).sort((a,b)=>b.count-a.count)[0],[box,cartonL,cartonW,cartonH]); const containerVol=box.l*box.w*box.h; const used=best.count*best.l*best.w*best.h;
  return <><Frame><SelectField label="Container type" value={preset} onChange={setPreset} options={Object.entries(presets).map(([value,item])=>({value,label:item.label}))} wide/><NumberField label="Carton length" value={cartonL} onChange={setCartonL} unit="cm"/><NumberField label="Carton width" value={cartonW} onChange={setCartonW} unit="cm"/><NumberField label="Carton height" value={cartonH} onChange={setCartonH} unit="cm"/></Frame><ResultPanel label="Simple carton capacity" primary={`${fmt(best.count,0)} cartons`} metrics={[{label:"Grid",value:`${best.x} × ${best.y} × ${best.z}`},{label:"Best orientation",value:`${fmt(best.l)} × ${fmt(best.w)} × ${fmt(best.h)} cm`},{label:"Volume utilisation",value:`${fmt(containerVol?used/containerVol*100:0,1)}%`},{label:"Container volume",value:`${fmt(containerVol/1e6,2)} m³`}]} note="Representative internal dimensions are used. Confirm the exact equipment specification before loading." /></>;
}

function PackageGirth() {
  const [unit,setUnit]=useState("in"); const [a,setA]=useState("36"); const [b,setB]=useState("20"); const [c,setC]=useState("18"); const [limit,setLimit]=useState("130"); const sorted=[n(a),n(b),n(c)].sort((x,y)=>y-x); const total=sorted[0]+2*(sorted[1]+sorted[2]); const remaining=n(limit)-total;
  return <><Frame><SelectField label="Measurement unit" value={unit} onChange={setUnit} options={[{value:"in",label:"Inches (in)"},{value:"cm",label:"Centimetres (cm)"}]} wide/><NumberField label="Dimension A" value={a} onChange={setA} unit={unit}/><NumberField label="Dimension B" value={b} onChange={setB} unit={unit}/><NumberField label="Dimension C" value={c} onChange={setC} unit={unit}/><NumberField label="Service limit" value={limit} onChange={setLimit} unit={unit}/></Frame><ResultPanel label="Length plus girth" primary={`${fmt(total,1)} ${unit}`} metrics={[{label:"Length (longest side)",value:`${fmt(sorted[0],1)} ${unit}`},{label:"Girth",value:`${fmt(2*(sorted[1]+sorted[2]),1)} ${unit}`},{label:"Entered limit",value:`${fmt(n(limit),1)} ${unit}`},{label:"Limit check",value:remaining>=0?`${fmt(remaining,1)} ${unit} under`:`${fmt(Math.abs(remaining),1)} ${unit} over`}]} note="Measure the finished parcel at its widest points and follow your carrier’s rounding method." /></>;
}

const conversionGroups = {
  length: { label:"Length", units:{ mm:{label:"Millimetres",factor:.001},cm:{label:"Centimetres",factor:.01},m:{label:"Metres",factor:1},in:{label:"Inches",factor:.0254},ft:{label:"Feet",factor:.3048} } },
  mass: { label:"Mass", units:{ g:{label:"Grams",factor:.001},kg:{label:"Kilograms",factor:1},oz:{label:"Ounces",factor:.028349523125},lb:{label:"Pounds",factor:.45359237} } },
  volume: { label:"Volume", units:{ ml:{label:"Millilitres",factor:.001},l:{label:"Litres",factor:1},m3:{label:"Cubic metres",factor:1000},floz:{label:"US fluid ounces",factor:.0295735296},gal:{label:"US gallons",factor:3.785411784},ft3:{label:"Cubic feet",factor:28.316846592} } },
} as const;

function UnitConverter() {
  const [group,setGroup]=useState<keyof typeof conversionGroups>("length"); const [from,setFrom]=useState("cm"); const [to,setTo]=useState("in"); const [value,setValue]=useState("100"); const units=conversionGroups[group].units as Record<string,{label:string;factor:number}>; const result=n(value)*(units[from]?.factor??1)/(units[to]?.factor??1);
  function changeGroup(next:keyof typeof conversionGroups){ setGroup(next); const keys=Object.keys(conversionGroups[next].units); setFrom(keys[0]); setTo(keys[1]); }
  const options=Object.entries(units).map(([key,item])=>({value:key,label:`${item.label} (${key})`}));
  return <><Frame><SelectField label="Measurement type" value={group} onChange={(v)=>changeGroup(v as keyof typeof conversionGroups)} options={Object.entries(conversionGroups).map(([value,item])=>({value,label:item.label}))} wide/><NumberField label="Value" value={value} onChange={setValue}/><SelectField label="From" value={from} onChange={setFrom} options={options}/><SelectField label="To" value={to} onChange={setTo} options={options}/></Frame><ResultPanel label="Converted value" primary={`${fmt(result,6)} ${to}`} metrics={[{label:"Input",value:`${fmt(n(value),6)} ${from}`},{label:"Measurement",value:conversionGroups[group].label},{label:"Conversion factor",value:fmt((units[from]?.factor??1)/(units[to]?.factor??1),8)},{label:"Precision",value:"Full internal"}]} note="The display is rounded, but calculations use the full conversion factor shown in the method section." /></>;
}

function BoxCost() {
  const [length,setLength]=useState("40"); const [width,setWidth]=useState("30"); const [height,setHeight]=useState("25"); const [joint,setJoint]=useState("4"); const [waste,setWaste]=useState("8"); const [quantity,setQuantity]=useState("500"); const [rate,setRate]=useState("1.25"); const blankL=2*(n(length)+n(width))+n(joint); const blankW=n(height)+n(width); const rawArea=blankL*blankW/10000; const adjusted=rawArea*(1+n(waste)/100); const total=adjusted*n(quantity)*n(rate);
  return <><Frame><NumberField label="Inside length" value={length} onChange={setLength} unit="cm"/><NumberField label="Inside width" value={width} onChange={setWidth} unit="cm"/><NumberField label="Inside depth / height" value={height} onChange={setHeight} unit="cm"/><NumberField label="Manufacturer joint" value={joint} onChange={setJoint} unit="cm"/><NumberField label="Waste allowance" value={waste} onChange={setWaste} unit="%"/><NumberField label="Quantity" value={quantity} onChange={setQuantity} step="1"/><NumberField label="Material price / m²" value={rate} onChange={setRate} unit="$" wide/></Frame><ResultPanel label="Estimated material cost" primary={`$${money(total)}`} metrics={[{label:"Blank size",value:`${fmt(blankL,1)} × ${fmt(blankW,1)} cm`},{label:"Adjusted area / box",value:`${fmt(adjusted,3)} m²`},{label:"Material / batch",value:`${fmt(adjusted*n(quantity),1)} m²`},{label:"Material cost / box",value:`$${fmt(n(quantity)?total/n(quantity):0,3)}`}]} note="Material only. Add converting, printing, tooling, freight, margin, and your supplier’s production allowances." /></>;
}

function ShippingCost() {
  const [length,setLength]=useState("40"); const [width,setWidth]=useState("30"); const [height,setHeight]=useState("25"); const [actual,setActual]=useState("4.5"); const [divisor,setDivisor]=useState("5000"); const [rate,setRate]=useState("3.20"); const [fuel,setFuel]=useState("12"); const [handling,setHandling]=useState("1.50"); const [quantity,setQuantity]=useState("3"); const dim=n(divisor)?n(length)*n(width)*n(height)/n(divisor):0; const chargeable=Math.max(dim,n(actual)); const base=chargeable*n(rate); const per=(base*(1+n(fuel)/100))+n(handling); const total=per*n(quantity);
  return <><Frame><NumberField label="Length" value={length} onChange={setLength} unit="cm"/><NumberField label="Width" value={width} onChange={setWidth} unit="cm"/><NumberField label="Height" value={height} onChange={setHeight} unit="cm"/><NumberField label="Actual weight / parcel" value={actual} onChange={setActual} unit="kg"/><SelectField label="DIM divisor" value={divisor} onChange={setDivisor} options={[{value:"5000",label:"5,000 cm³/kg"},{value:"6000",label:"6,000 cm³/kg"}]}/><NumberField label="Rate / chargeable kg" value={rate} onChange={setRate} unit="$"/><NumberField label="Fuel surcharge" value={fuel} onChange={setFuel} unit="%"/><NumberField label="Handling / parcel" value={handling} onChange={setHandling} unit="$"/><NumberField label="Number of parcels" value={quantity} onChange={setQuantity} step="1" wide/></Frame><ResultPanel label="Estimated shipment cost" primary={`$${money(total)}`} metrics={[{label:"Chargeable / parcel",value:`${fmt(chargeable,2)} kg`},{label:"Base freight / parcel",value:`$${money(base)}`},{label:"All-in / parcel",value:`$${money(per)}`},{label:"Weight basis",value:dim>n(actual)?"Dimensional":"Actual"}]} note="Use the rate and surcharge from your own quote. Carrier minimums, taxes, duties, and accessorial fees are not included." /></>;
}

function MarginCalculator() {
  const [price,setPrice]=useState("79"); const [product,setProduct]=useState("23"); const [shipping,setShipping]=useState("8.50"); const [packaging,setPackaging]=useState("1.20"); const [market,setMarket]=useState("12"); const [payment,setPayment]=useState("2.9"); const [ads,setAds]=useState("9"); const [other,setOther]=useState("1"); const percent=(n(market)+n(payment))/100; const fees=n(price)*percent; const fixed=n(product)+n(shipping)+n(packaging)+n(ads)+n(other); const profit=n(price)-fixed-fees; const margin=n(price)?profit/n(price)*100:0; const breakEven=percent<1?fixed/(1-percent):Infinity; const returnOnCost=fixed+fees?profit/(fixed+fees)*100:0;
  return <><Frame><NumberField label="Selling price" value={price} onChange={setPrice} unit="$"/><NumberField label="Product cost" value={product} onChange={setProduct} unit="$"/><NumberField label="Outbound shipping" value={shipping} onChange={setShipping} unit="$"/><NumberField label="Packaging" value={packaging} onChange={setPackaging} unit="$"/><NumberField label="Marketplace fee" value={market} onChange={setMarket} unit="%"/><NumberField label="Payment fee" value={payment} onChange={setPayment} unit="%"/><NumberField label="Advertising / order" value={ads} onChange={setAds} unit="$"/><NumberField label="Other order costs" value={other} onChange={setOther} unit="$"/></Frame><ResultPanel label="Estimated profit / order" primary={`${profit<0?"−":""}$${money(Math.abs(profit))}`} metrics={[{label:"Contribution margin",value:`${fmt(margin,1)}%`},{label:"Percentage fees",value:`$${money(fees)}`},{label:"Break-even price",value:`$${money(breakEven)}`},{label:"Return on order cost",value:`${fmt(returnOnCost,1)}%`}]} note="Before income tax and overhead. Enter returns, discounts, storage, or other variable costs in ‘Other’ when relevant." /></>;
}

function FreightDensity() {
  const [length,setLength]=useState("120"); const [width,setWidth]=useState("100"); const [height,setHeight]=useState("110"); const [quantity,setQuantity]=useState("2"); const [weight,setWeight]=useState("620");
  const volume=n(length)*n(width)*n(height)*n(quantity)/1e6; const kgm3=volume?n(weight)/volume:0; const lbft3=kgm3*0.06242796;
  return <><Frame><NumberField label="Unit length" value={length} onChange={setLength} unit="cm"/><NumberField label="Unit width" value={width} onChange={setWidth} unit="cm"/><NumberField label="Unit height" value={height} onChange={setHeight} unit="cm"/><NumberField label="Number of units" value={quantity} onChange={setQuantity} step="1"/><NumberField label="Total gross weight" value={weight} onChange={setWeight} unit="kg" wide/></Frame><ResultPanel label="Shipment density" primary={`${fmt(kgm3,1)} kg/m³`} metrics={[{label:"Imperial density",value:`${fmt(lbft3,2)} lb/ft³`},{label:"Total volume",value:`${fmt(volume,3)} m³`},{label:"Gross weight",value:`${fmt(n(weight),1)} kg`},{label:"Shipping units",value:fmt(n(quantity),0)}]} note="Physical density only. Do not treat this result as an NMFC class assignment." /></>;
}

function AirChargeableWeight() {
  const [length,setLength]=useState("80"); const [width,setWidth]=useState("60"); const [height,setHeight]=useState("50"); const [pieces,setPieces]=useState("4"); const [gross,setGross]=useState("120"); const [divisor,setDivisor]=useState("6000");
  const volumeWeight=n(divisor)?n(length)*n(width)*n(height)*n(pieces)/n(divisor):0; const chargeable=Math.max(n(gross),volumeWeight); const cube=n(length)*n(width)*n(height)*n(pieces)/1e6;
  return <><Frame><NumberField label="Piece length" value={length} onChange={setLength} unit="cm"/><NumberField label="Piece width" value={width} onChange={setWidth} unit="cm"/><NumberField label="Piece height" value={height} onChange={setHeight} unit="cm"/><NumberField label="Pieces" value={pieces} onChange={setPieces} step="1"/><NumberField label="Total gross weight" value={gross} onChange={setGross} unit="kg"/><SelectField label="Volume divisor" value={divisor} onChange={setDivisor} options={[{value:"6000",label:"6,000 cm³/kg"},{value:"5000",label:"5,000 cm³/kg"}]}/></Frame><ResultPanel label="Estimated chargeable weight" primary={`${fmt(chargeable,1)} kg`} metrics={[{label:"Volume weight",value:`${fmt(volumeWeight,1)} kg`},{label:"Gross weight",value:`${fmt(n(gross),1)} kg`},{label:"Shipment volume",value:`${fmt(cube,3)} m³`},{label:"Weight basis",value:volumeWeight>n(gross)?"Volumetric":"Gross"}]} note="Confirm whether your forwarder rounds per piece or on the shipment total." /></>;
}

function LoadMetres() {
  const [length,setLength]=useState("1.2"); const [width,setWidth]=useState("0.8"); const [quantity,setQuantity]=useState("10"); const [trailerWidth,setTrailerWidth]=useState("2.4"); const [layers,setLayers]=useState("1");
  const floorArea=n(length)*n(width)*n(quantity)/Math.max(n(layers),1); const ldm=n(trailerWidth)?floorArea/n(trailerWidth):0;
  return <><Frame><NumberField label="Unit length" value={length} onChange={setLength} unit="m"/><NumberField label="Unit width" value={width} onChange={setWidth} unit="m"/><NumberField label="Units" value={quantity} onChange={setQuantity} step="1"/><NumberField label="Safely stackable layers" value={layers} onChange={setLayers} step="1"/><NumberField label="Usable trailer width" value={trailerWidth} onChange={setTrailerWidth} unit="m" wide/></Frame><ResultPanel label="Estimated load metres" primary={`${fmt(ldm,2)} LDM`} metrics={[{label:"Effective floor area",value:`${fmt(floorArea,2)} m²`},{label:"Unstacked area",value:`${fmt(n(length)*n(width)*n(quantity),2)} m²`},{label:"Trailer width",value:`${fmt(n(trailerWidth),2)} m`},{label:"Stacking layers",value:fmt(n(layers),0)}]} note="A layout or carrier rule may produce a different chargeable LDM than pure floor-area conversion." /></>;
}

function LandedCost() {
  const [unitCost,setUnitCost]=useState("18"); const [quantity,setQuantity]=useState("500"); const [freight,setFreight]=useState("1850"); const [insurance,setInsurance]=useState("120"); const [dutyRate,setDutyRate]=useState("6.5"); const [taxRate,setTaxRate]=useState("10"); const [other,setOther]=useState("340");
  const goods=n(unitCost)*n(quantity); const customs=goods+n(freight)+n(insurance); const duty=customs*n(dutyRate)/100; const tax=(customs+duty)*n(taxRate)/100; const total=customs+duty+tax+n(other); const per=n(quantity)?total/n(quantity):0;
  return <><Frame><NumberField label="Unit purchase cost" value={unitCost} onChange={setUnitCost} unit="$"/><NumberField label="Quantity" value={quantity} onChange={setQuantity} step="1"/><NumberField label="International freight" value={freight} onChange={setFreight} unit="$"/><NumberField label="Insurance" value={insurance} onChange={setInsurance} unit="$"/><NumberField label="Duty rate" value={dutyRate} onChange={setDutyRate} unit="%"/><NumberField label="Import tax rate" value={taxRate} onChange={setTaxRate} unit="%"/><NumberField label="Brokerage and other fees" value={other} onChange={setOther} unit="$" wide/></Frame><ResultPanel label="Estimated landed cost" primary={`$${money(total)}`} metrics={[{label:"Landed cost / unit",value:`$${money(per)}`},{label:"Goods value",value:`$${money(goods)}`},{label:"Duty",value:`$${money(duty)}`},{label:"Import tax",value:`$${money(tax)}`}]} note="This example tax base includes customs value plus duty. Replace it with your jurisdiction's method before use." /></>;
}

function ReorderPoint() {
  const [daily,setDaily]=useState("18"); const [lead,setLead]=useState("21"); const [safety,setSafety]=useState("120"); const [onHand,setOnHand]=useState("620"); const demand=n(daily)*n(lead); const point=demand+n(safety); const days=n(daily)?n(onHand)/n(daily):0;
  return <><Frame><NumberField label="Average daily demand" value={daily} onChange={setDaily} unit="units"/><NumberField label="Lead time" value={lead} onChange={setLead} unit="days"/><NumberField label="Safety stock" value={safety} onChange={setSafety} unit="units"/><NumberField label="Current on-hand stock" value={onHand} onChange={setOnHand} unit="units"/></Frame><ResultPanel label="Reorder point" primary={`${fmt(point,0)} units`} metrics={[{label:"Lead-time demand",value:`${fmt(demand,0)} units`},{label:"Safety stock",value:`${fmt(n(safety),0)} units`},{label:"Current days on hand",value:`${fmt(days,1)} days`},{label:"Action now",value:n(onHand)<=point?"Reorder":"Monitor"}]} note="Review demand, lead time, open orders, and safety stock regularly instead of treating this as a permanent setting." /></>;
}

function Eoq() {
  const [demand,setDemand]=useState("12000"); const [orderCost,setOrderCost]=useState("45"); const [holdCost,setHoldCost]=useState("3.6"); const qty=n(holdCost)?Math.sqrt(2*n(demand)*n(orderCost)/n(holdCost)):0; const orders=qty?n(demand)/qty:0; const cycle=orders?365/orders:0; const annual=qty?(n(demand)/qty*n(orderCost))+(qty/2*n(holdCost)):0;
  return <><Frame><NumberField label="Annual demand" value={demand} onChange={setDemand} unit="units"/><NumberField label="Cost per order" value={orderCost} onChange={setOrderCost} unit="$"/><NumberField label="Annual holding cost / unit" value={holdCost} onChange={setHoldCost} unit="$" wide/></Frame><ResultPanel label="Economic order quantity" primary={`${fmt(qty,0)} units`} metrics={[{label:"Orders / year",value:fmt(orders,1)},{label:"Average cycle",value:`${fmt(cycle,1)} days`},{label:"Average cycle stock",value:`${fmt(qty/2,0)} units`},{label:"Relevant annual cost",value:`$${money(annual)}`}]} note="Round to a practical pack or supplier quantity and test minimum-order and discount scenarios separately." /></>;
}

function StorageCost() {
  const [pallets,setPallets]=useState("24"); const [months,setMonths]=useState("3"); const [rate,setRate]=useState("22"); const [inbound,setInbound]=useState("8.5"); const [outbound,setOutbound]=useState("9.5"); const [admin,setAdmin]=useState("75"); const storage=n(pallets)*n(months)*n(rate); const handling=n(pallets)*(n(inbound)+n(outbound)); const total=storage+handling+n(admin);
  return <><Frame><NumberField label="Pallets" value={pallets} onChange={setPallets} step="1"/><NumberField label="Storage months" value={months} onChange={setMonths}/><NumberField label="Monthly rate / pallet" value={rate} onChange={setRate} unit="$"/><NumberField label="Inbound handling / pallet" value={inbound} onChange={setInbound} unit="$"/><NumberField label="Outbound handling / pallet" value={outbound} onChange={setOutbound} unit="$"/><NumberField label="Administration and other" value={admin} onChange={setAdmin} unit="$"/></Frame><ResultPanel label="Estimated warehouse cost" primary={`$${money(total)}`} metrics={[{label:"Storage",value:`$${money(storage)}`},{label:"Handling",value:`$${money(handling)}`},{label:"Cost / pallet",value:`$${money(n(pallets)?total/n(pallets):0)}`},{label:"Cost / pallet-month",value:`$${money(n(pallets)&&n(months)?total/(n(pallets)*n(months)):0)}`}]} note="Add pick fees, minimums, surcharges, and taxes to the administration field when they apply." /></>;
}

function PalletStackHeight() {
  const [palletL,setPalletL]=useState("120"); const [palletW,setPalletW]=useState("100"); const [base,setBase]=useState("15"); const [cartonL,setCartonL]=useState("40"); const [cartonW,setCartonW]=useState("30"); const [cartonH,setCartonH]=useState("25"); const [layers,setLayers]=useState("5"); const [limit,setLimit]=useState("160"); const a=n(cartonL)&&n(cartonW)?Math.floor(n(palletL)/n(cartonL))*Math.floor(n(palletW)/n(cartonW)):0; const b=n(cartonL)&&n(cartonW)?Math.floor(n(palletL)/n(cartonW))*Math.floor(n(palletW)/n(cartonL)):0; const per=Math.max(a,b); const finished=n(base)+n(cartonH)*n(layers); const clearance=n(limit)-finished;
  return <><Frame><NumberField label="Pallet length" value={palletL} onChange={setPalletL} unit="cm"/><NumberField label="Pallet width" value={palletW} onChange={setPalletW} unit="cm"/><NumberField label="Pallet base height" value={base} onChange={setBase} unit="cm"/><NumberField label="Maximum total height" value={limit} onChange={setLimit} unit="cm"/><NumberField label="Carton length" value={cartonL} onChange={setCartonL} unit="cm"/><NumberField label="Carton width" value={cartonW} onChange={setCartonW} unit="cm"/><NumberField label="Carton height" value={cartonH} onChange={setCartonH} unit="cm"/><NumberField label="Layers" value={layers} onChange={setLayers} step="1"/></Frame><ResultPanel label="Finished pallet height" primary={`${fmt(finished,1)} cm`} metrics={[{label:"Cartons / layer",value:fmt(per,0)},{label:"Total cartons",value:fmt(per*n(layers),0)},{label:"Height clearance",value:`${clearance<0?"−":""}${fmt(Math.abs(clearance),1)} cm`},{label:"Limit check",value:clearance>=0?"Within limit":"Over limit"}]} note="This is a column-stack estimate and does not prove the load is stable or compression-safe." /></>;
}

function PackagingWaste() {
  const [purchased,setPurchased]=useState("1200"); const [good,setGood]=useState("1035"); const [recovered,setRecovered]=useState("35"); const [unitCost,setUnitCost]=useState("1.45"); const waste=Math.max(n(purchased)-n(good)-n(recovered),0); const rate=n(purchased)?waste/n(purchased)*100:0; const yieldRate=n(purchased)?n(good)/n(purchased)*100:0;
  return <><Frame><NumberField label="Material purchased" value={purchased} onChange={setPurchased} unit="units"/><NumberField label="Material in good output" value={good} onChange={setGood} unit="units"/><NumberField label="Recoverable scrap" value={recovered} onChange={setRecovered} unit="units"/><NumberField label="Material cost / unit" value={unitCost} onChange={setUnitCost} unit="$"/></Frame><ResultPanel label="Net packaging waste" primary={`${fmt(rate,1)}%`} metrics={[{label:"Net waste quantity",value:`${fmt(waste,1)} units`},{label:"Good-output yield",value:`${fmt(yieldRate,1)}%`},{label:"Waste cost",value:`$${money(waste*n(unitCost))}`},{label:"Recovered share",value:`${fmt(n(purchased)?n(recovered)/n(purchased)*100:0,1)}%`}]} note="Keep all three material entries in the same unit. Recoverable scrap is excluded from net waste here." /></>;
}

export function Calculator({ slug, nextSteps = [] }: { slug: string; nextSteps?: NextStep[] }) {
  const [hasInteracted, setHasInteracted] = useState(false);
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(`[data-calculator-root="${slug}"]`);
    if (!root) return;
    trackAnalyticsEvent("calculator_visible", slug);
    const shared = new URLSearchParams(window.location.search).get("share");
    if (shared) {
      window.requestAnimationFrame(() => {
        const fields = decodeShareState(shared);
        const elements = Array.from(root.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input,select"));
        fields.forEach((field, index) => {
          const element = elements[index];
          if (!element) return;
          if (element instanceof HTMLInputElement && element.type === "checkbox") {
            const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "checked")?.set;
            setter?.call(element, field.checked === true);
            element.dispatchEvent(new Event("change", { bubbles: true }));
            return;
          }
          const prototype = element instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
          const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
          setter?.call(element, field.value);
          element.dispatchEvent(new Event(element instanceof HTMLSelectElement ? "change" : "input", { bubbles: true }));
        });
      });
    }
    let sentInputStarted = false;
    const markInteracted = () => {
      setHasInteracted(true);
      if (!sentInputStarted) {
        sentInputStarted = true;
        trackAnalyticsEvent("input_started", slug);
      }
    };
    root.addEventListener("input", markInteracted);
    root.addEventListener("change", markInteracted);
    return () => { root.removeEventListener("input", markInteracted); root.removeEventListener("change", markInteracted); };
  }, [slug]);
  const calculators: Record<string, React.ReactNode> = {
    "dimensional-weight-calculator": <DimensionalWeightPro />, "cbm-calculator": <CbmCalculator />, "carton-fit-calculator": <CartonFit />, "pallet-load-calculator": <PalletLoadPro />, "container-loading-calculator": <ContainerLoading />, "package-girth-calculator": <PackageGirth />, "shipping-unit-converter": <UnitConverter />, "corrugated-box-cost-calculator": <BoxCost />, "shipping-cost-estimator": <ShippingCost />, "ecommerce-margin-calculator": <MarginCalculator />,
    "freight-density-calculator": <FreightDensity />, "air-freight-chargeable-weight-calculator": <AirChargeableWeight />, "lcl-chargeable-volume-calculator": <LclChargePro />, "load-meter-calculator": <LoadMetres />, "landed-cost-calculator": <LandedCost />, "reorder-point-calculator": <ReorderPoint />, "eoq-calculator": <Eoq />, "warehouse-storage-cost-calculator": <StorageCost />, "pallet-stack-height-calculator": <PalletStackHeight />, "packaging-waste-calculator": <PackagingWaste />,
  };
  const calculator = calculators[slug];
  if (!calculator) return null;
  return <div data-calculator-root={slug}>{calculator}{hasInteracted ? <CalculatorNextSteps steps={nextSteps} /> : null}</div>;
}
