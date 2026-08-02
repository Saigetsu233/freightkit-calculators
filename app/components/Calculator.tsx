"use client";

import { useMemo, useState } from "react";

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
      <button type="button" className="copy-button" onClick={copyResult}>{copied ? "Copied to clipboard ✓" : "Copy result summary"}</button>
    </aside>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="calc-card"><div className="calc-card-header"><h2>Your inputs</h2><span className="live-badge">Live result</span></div><div className="calc-form"><div className="field-grid">{children}</div></div></div>;
}

function DimensionalWeight() {
  const [system, setSystem] = useState("metric"); const [length, setLength] = useState("40"); const [width, setWidth] = useState("30"); const [height, setHeight] = useState("25"); const [actual, setActual] = useState("8"); const [quantity, setQuantity] = useState("1"); const [metricDivisor, setMetricDivisor] = useState("5000"); const [imperialDivisor, setImperialDivisor] = useState("139");
  const metric = system === "metric"; const divisor = metric ? n(metricDivisor) : n(imperialDivisor); const qty = n(quantity); const dimPer = divisor ? n(length) * n(width) * n(height) / divisor : 0; const actualTotal = n(actual) * qty; const dimTotal = dimPer * qty; const unit = metric ? "kg" : "lb"; const chargeable = Math.max(dimTotal, actualTotal);
  return <><Frame><SelectField label="Measurement system" value={system} onChange={setSystem} options={[{value:"metric",label:"Metric — cm / kg"},{value:"imperial",label:"Imperial — in / lb"}]} wide /><NumberField label="Length" value={length} onChange={setLength} unit={metric ? "cm" : "in"} /><NumberField label="Width" value={width} onChange={setWidth} unit={metric ? "cm" : "in"} /><NumberField label="Height" value={height} onChange={setHeight} unit={metric ? "cm" : "in"} /><NumberField label="Actual weight / parcel" value={actual} onChange={setActual} unit={unit} /><NumberField label="Number of parcels" value={quantity} onChange={setQuantity} step="1" />{metric ? <SelectField label="DIM divisor" value={metricDivisor} onChange={setMetricDivisor} options={[{value:"5000",label:"5,000 cm³/kg"},{value:"6000",label:"6,000 cm³/kg"}]} /> : <SelectField label="DIM divisor" value={imperialDivisor} onChange={setImperialDivisor} options={[{value:"139",label:"139 in³/lb"},{value:"166",label:"166 in³/lb"}]} />}</Frame><ResultPanel label="Estimated chargeable weight" primary={`${fmt(chargeable)} ${unit}`} metrics={[{label:"Dimensional / parcel",value:`${fmt(dimPer)} ${unit}`},{label:"Actual / parcel",value:`${fmt(n(actual))} ${unit}`},{label:"Dimensional total",value:`${fmt(dimTotal)} ${unit}`},{label:"Weight basis",value:dimTotal > actualTotal ? "Dimensional" : "Actual"}]} note="The greater of actual and dimensional weight is shown before carrier-specific rounding." /></>;
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

function PalletLoad() {
  const [palletL,setPalletL]=useState("120"); const [palletW,setPalletW]=useState("100"); const [usableH,setUsableH]=useState("150"); const [cartonL,setCartonL]=useState("40"); const [cartonW,setCartonW]=useState("30"); const [cartonH,setCartonH]=useState("25"); const [cartonWeight,setCartonWeight]=useState("12"); const [maxWeight,setMaxWeight]=useState("1000");
  const orientationA=(n(cartonL)&&n(cartonW))?Math.floor(n(palletL)/n(cartonL))*Math.floor(n(palletW)/n(cartonW)):0; const orientationB=(n(cartonL)&&n(cartonW))?Math.floor(n(palletL)/n(cartonW))*Math.floor(n(palletW)/n(cartonL)):0; const perLayer=Math.max(orientationA,orientationB); const layers=n(cartonH)?Math.floor(n(usableH)/n(cartonH)):0; const spatial=perLayer*layers; const byWeight=n(cartonWeight)?Math.floor(n(maxWeight)/n(cartonWeight)):0; const count=Math.min(spatial,byWeight); const actualLayers=perLayer?Math.ceil(count/perLayer):0;
  return <><Frame><NumberField label="Pallet length" value={palletL} onChange={setPalletL} unit="cm"/><NumberField label="Pallet width" value={palletW} onChange={setPalletW} unit="cm"/><NumberField label="Usable load height" value={usableH} onChange={setUsableH} unit="cm" hint="Height available for cartons only."/><NumberField label="Maximum load weight" value={maxWeight} onChange={setMaxWeight} unit="kg"/><NumberField label="Carton length" value={cartonL} onChange={setCartonL} unit="cm"/><NumberField label="Carton width" value={cartonW} onChange={setCartonW} unit="cm"/><NumberField label="Carton height" value={cartonH} onChange={setCartonH} unit="cm"/><NumberField label="Carton weight" value={cartonWeight} onChange={setCartonWeight} unit="kg"/></Frame><ResultPanel label="Estimated pallet capacity" primary={`${fmt(count,0)} cartons`} metrics={[{label:"Cartons / layer",value:fmt(perLayer,0)},{label:"Layers used",value:`${actualLayers} of ${layers}`},{label:"Loaded carton weight",value:`${fmt(count*n(cartonWeight),0)} kg`},{label:"Limiting factor",value:byWeight<spatial?"Weight":"Space"}]} note="Check pallet rating, compression strength, stack stability, and transport regulations separately." /></>;
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

export function Calculator({ slug }: { slug: string }) {
  const calculators: Record<string, React.ReactNode> = {
    "dimensional-weight-calculator": <DimensionalWeight />, "cbm-calculator": <CbmCalculator />, "carton-fit-calculator": <CartonFit />, "pallet-load-calculator": <PalletLoad />, "container-loading-calculator": <ContainerLoading />, "package-girth-calculator": <PackageGirth />, "shipping-unit-converter": <UnitConverter />, "corrugated-box-cost-calculator": <BoxCost />, "shipping-cost-estimator": <ShippingCost />, "ecommerce-margin-calculator": <MarginCalculator />,
  };
  return calculators[slug] ?? null;
}
