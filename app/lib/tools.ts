export type ToolDefinition = {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  tag: string;
  description: string;
  intro: string;
  formula: string;
  assumption: string;
};

export const tools: ToolDefinition[] = [
  {
    slug: "dimensional-weight-calculator",
    title: "Dimensional Weight Calculator",
    shortTitle: "Dimensional Weight",
    category: "Parcel",
    tag: "kg · lb",
    description: "Compare actual and volumetric weight to estimate the chargeable weight of a parcel.",
    intro: "Turn carton dimensions into dimensional weight, then compare it with the actual scale weight. Choose a metric or imperial divisor to match your carrier quote.",
    formula: "Dimensional weight = (length × width × height) ÷ divisor",
    assumption: "Carriers use different divisors by service, account, and destination. Confirm the divisor and rounding rules on your rate card before quoting.",
  },
  {
    slug: "cbm-calculator",
    title: "CBM & Volume Calculator",
    shortTitle: "CBM & Volume",
    category: "Freight",
    tag: "m³ · ft³",
    description: "Calculate shipment volume in cubic metres, cubic feet, and litres across common units.",
    intro: "Calculate total cubic volume for one carton or a full shipment. Enter dimensions in centimetres, metres, inches, or feet and compare three useful volume units.",
    formula: "Total volume = length × width × height × quantity",
    assumption: "This is external carton volume. It does not include pallet dimensions, protective overhang, or irregular packing space.",
  },
  {
    slug: "carton-fit-calculator",
    title: "Carton Fit Calculator",
    shortTitle: "Carton Fit",
    category: "Packing",
    tag: "6 rotations",
    description: "Find the best right-angle orientation for fitting identical items inside a master carton.",
    intro: "Test all six axis-aligned rotations of an item and find the arrangement that fits the highest whole-number quantity inside a carton.",
    formula: "Fit count = floor(box L ÷ item L) × floor(box W ÷ item W) × floor(box H ÷ item H)",
    assumption: "The estimate assumes rectangular items, straight rows, no nesting, no deformation, and no clearance or protective material.",
  },
  {
    slug: "pallet-load-calculator",
    title: "Pallet Load Calculator",
    shortTitle: "Pallet Load",
    category: "Warehouse",
    tag: "layers · weight",
    description: "Estimate cartons per layer, stack height, weight limit, and total cartons on a pallet.",
    intro: "Estimate a simple column-stacked pallet load using pallet footprint, usable load height, carton dimensions, carton weight, and maximum load weight.",
    formula: "Cartons = min(cartons per layer × layers, floor(max load weight ÷ carton weight))",
    assumption: "This planning estimate assumes no overhang and identical cartons. It does not assess compression strength, stability, local rules, or safe working load.",
  },
  {
    slug: "container-loading-calculator",
    title: "Container Loading Calculator",
    shortTitle: "Container Loading",
    category: "Freight",
    tag: "20ft · 40ft · HC",
    description: "Estimate axis-aligned carton capacity for 20ft, 40ft, and 40ft high-cube containers.",
    intro: "Compare six carton rotations against representative internal container dimensions to estimate a simple, uniform loading plan.",
    formula: "Capacity = max of six floor(container dimension ÷ carton dimension) combinations",
    assumption: "Container interiors vary by manufacturer. This simplified estimate excludes door clearance, weight distribution, pallets, mixed orientations, and loading constraints.",
  },
  {
    slug: "package-girth-calculator",
    title: "Package Length + Girth Calculator",
    shortTitle: "Length + Girth",
    category: "Parcel",
    tag: "carrier limits",
    description: "Calculate package length plus girth and compare it with a limit from your carrier.",
    intro: "Enter the three outside dimensions of a parcel. The longest side is treated as length and the other two sides form the girth.",
    formula: "Length + girth = longest side + 2 × (second side + shortest side)",
    assumption: "Carrier size limits and measurement rounding vary. Enter the limit shown in the applicable service guide or contract.",
  },
  {
    slug: "shipping-unit-converter",
    title: "Shipping Unit Converter",
    shortTitle: "Unit Converter",
    category: "Utility",
    tag: "length · mass · volume",
    description: "Convert the length, mass, and volume units used across international shipping documents.",
    intro: "Convert common metric and imperial measurements without leaving your packing workflow. Results update as you type.",
    formula: "Converted value = input value × source factor ÷ destination factor",
    assumption: "Conversions use standard mathematical factors. Displayed values are rounded for readability while calculations retain full precision.",
  },
  {
    slug: "corrugated-box-cost-calculator",
    title: "Corrugated Box Cost Calculator",
    shortTitle: "Box Cost Estimate",
    category: "Packaging",
    tag: "RSC estimate",
    description: "Estimate RSC corrugated blank area, material usage, waste, and a batch material cost.",
    intro: "Create a quick material estimate for a regular slotted container using box dimensions, manufacturer joint, waste allowance, quantity, and sheet price.",
    formula: "Blank area ≈ [2(L + W) + joint] × (H + W)",
    assumption: "This is a material-planning estimate for a basic RSC layout, not a production quote. Scores, trim, flute allowance, setup, printing, and labour are excluded.",
  },
  {
    slug: "shipping-cost-estimator",
    title: "Shipping Cost Estimator",
    shortTitle: "Shipping Cost",
    category: "Parcel",
    tag: "rate + surcharge",
    description: "Estimate a parcel charge from billable weight, per-kilo rate, fuel surcharge, and handling.",
    intro: "Combine actual weight and dimensional weight with your own contracted rate, surcharge, handling fee, and parcel quantity.",
    formula: "Total = [(chargeable weight × rate) × (1 + surcharge)] + handling",
    assumption: "The result excludes taxes, duties, remote-area fees, minimum charges, weight steps, and other carrier-specific adjustments.",
  },
  {
    slug: "ecommerce-margin-calculator",
    title: "Ecommerce Margin Calculator",
    shortTitle: "Ecommerce Margin",
    category: "Commerce",
    tag: "profit · break-even",
    description: "See profit, margin, fees, return on cost, and break-even price for an ecommerce order.",
    intro: "Combine product, shipping, packaging, marketplace, payment, advertising, and other order costs to see the true contribution margin.",
    formula: "Profit = selling price − fixed order costs − percentage fees",
    assumption: "The estimate is before income tax and overhead unless you enter those costs. Returns, discounts, and currency movement are not modelled.",
  },
];

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}
