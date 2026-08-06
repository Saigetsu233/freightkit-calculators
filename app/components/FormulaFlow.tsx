const flows: Record<string, { eyebrow: string; title: string; reviewed: string; steps: Array<{ label: string; detail: string }> }> = {
  "dimensional-weight-calculator": {
    eyebrow: "DIM-weight decision flow",
    title: "Measure, divide, compare, then round",
    reviewed: "FedEx, UPS, DHL and USPS public guidance reviewed August 6, 2026",
    steps: [
      { label: "Outer dimensions", detail: "Measure the finished parcel at its widest points" },
      { label: "Volume", detail: "Length × width × height" },
      { label: "Divisor", detail: "Use the service and rate-card rule that actually applies" },
      { label: "DIM weight", detail: "Package volume ÷ divisor" },
      { label: "Compare", detail: "Use the greater of dimensional and actual weight" },
      { label: "Round", detail: "Apply the carrier billing increment per package" },
    ],
  },
  "pallet-load-calculator": {
    eyebrow: "Pallet-capacity flow",
    title: "Check footprint, height, and weight separately",
    reviewed: "EPAL and ISO pallet references reviewed August 6, 2026",
    steps: [
      { label: "Pallet preset", detail: "Euro, GMA, industrial, or verified custom size" },
      { label: "Two orientations", detail: "Test straight rows at 0° and 90°" },
      { label: "Per layer", detail: "Keep the larger whole-carton grid" },
      { label: "Height limit", detail: "Subtract the pallet base and divide by carton height" },
      { label: "Weight limit", detail: "Maximum load weight ÷ carton gross weight" },
      { label: "Capacity", detail: "Use the lowest applicable whole-carton limit" },
    ],
  },
  "lcl-chargeable-volume-calculator": {
    eyebrow: "LCL W/M audit flow",
    title: "Rebuild the quote before comparing the total",
    reviewed: "Maersk LCL terminology and public tariff guidance reviewed August 6, 2026",
    steps: [
      { label: "Cargo lines", detail: "Calculate total cubic metres and gross kilograms" },
      { label: "Metric tonnes", detail: "Gross kilograms ÷ 1,000" },
      { label: "W/M", detail: "Use the greater of CBM and metric tonnes" },
      { label: "Minimum", detail: "Apply the quoted minimum chargeable unit" },
      { label: "Variable fees", detail: "Multiply chargeable W/M by every per-unit line" },
      { label: "All-in estimate", detail: "Add origin, destination, documentation, and fixed fees" },
    ],
  },
};

export function FormulaFlow({ slug }: { slug: string }) {
  const flow = flows[slug];
  if (!flow) return null;
  return <section className="shell formula-flow" aria-label={`${flow.title} diagram`}><div className="flow-heading"><div><p className="eyebrow">{flow.eyebrow}</p><h2>{flow.title}</h2></div><p>{flow.reviewed}</p></div><ol>{flow.steps.map((step, index) => <li key={step.label}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step.label}</strong><p>{step.detail}</p></li>)}</ol></section>;
}
