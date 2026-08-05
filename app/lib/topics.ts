export type TopicQuestion = {
  question: string;
  answer: string;
  guide?: string;
};

export type TopicDefinition = {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  description: string;
  quickAnswer: string;
  formula: string;
  workedExample: string;
  relatedTool: string;
  guideSlugs: string[];
  questions: TopicQuestion[];
  sources: Array<{ label: string; url: string }>;
};

export const topics: TopicDefinition[] = [
  {
    slug: "dimensional-weight",
    title: "Dimensional Weight: Formula, Divisors & Worked Examples",
    shortTitle: "Dimensional weight",
    category: "Parcel shipping",
    description: "A practical reference for DIM weight, chargeable weight, carrier divisors, measurement rules, rounding, and multi-parcel examples.",
    quickAnswer: "Dimensional weight converts parcel volume into a billing weight. Multiply the finished outside length, width, and height, divide by the factor specified for the carrier service, then compare that result with actual packed weight. The larger value is normally the starting chargeable weight before the applicable rounding and eligibility rules are applied.",
    formula: "Dimensional weight = length × width × height ÷ divisor; chargeable weight = max(actual weight, dimensional weight)",
    workedExample: "A 20 × 16 × 12 inch parcel has 3,840 cubic inches. At a divisor of 139, dimensional weight is 27.63 lb. If actual packed weight is 24 lb and the service rounds chargeable weight up to whole pounds, the planning result is 28 lb per parcel.",
    relatedTool: "dimensional-weight-calculator",
    guideSlugs: ["dimensional-weight-carrier-divisors", "dimensional-weight-rounding-examples", "dimensional-weight-packaging-audit"],
    questions: [
      { question: "What is dimensional weight?", answer: "Dimensional weight is a calculated billing weight based on the outside volume of a parcel. It lets a carrier compare the space a parcel occupies with its actual scale weight." },
      { question: "Which dimensional-weight divisor should I use?", answer: "Use the divisor stated for the exact carrier, service, rate type, account, and destination. Public examples such as 139, 166, or 5,000 are useful presets but are not universal contract terms.", guide: "dimensional-weight-carrier-divisors" },
      { question: "Is chargeable weight actual or dimensional weight?", answer: "It is commonly the larger of actual packed weight and dimensional weight, followed by the service's measurement and billing-rounding rules." },
      { question: "Should I round each parcel or the shipment total?", answer: "Follow the carrier's stated sequence. Many parcel calculations apply measurement and chargeable-weight rounding per package before multiplying the quantity.", guide: "dimensional-weight-rounding-examples" },
      { question: "How can packaging reduce dimensional-weight charges?", answer: "Measure finished parcels, rank high-volume SKUs by billed-weight gap, test smaller packs, and verify that freight savings exceed material, labour, and damage-risk changes.", guide: "dimensional-weight-packaging-audit" },
    ],
    sources: [
      { label: "FedEx dimensional weight guidance", url: "https://www.fedex.com/en-us/shipping/packaging/what-is-dimensional-weight.html" },
      { label: "UPS dimensional weight guidance", url: "https://developer.ups.com/us/en/support/shipping-support/shipping-dimensions-weight" },
      { label: "DHL volumetric weight guidance", url: "https://www.dhl.com/discover/en-gb/ship-with-dhl/products-and-services/weight-and-dimensions" },
    ],
  },
  {
    slug: "pallet-loading",
    title: "Pallet Loading: Cartons per Layer, Height & Weight Limits",
    shortTitle: "Pallet loading",
    category: "Warehouse planning",
    description: "Plan a transparent pallet load using pallet footprint, carton rotation, full layers, total height, cargo weight, and operational limits.",
    quickAnswer: "A pallet load is controlled by the lowest approved capacity created by footprint, height, weight, pallet rating, carton strength, stability, handling equipment, and the transport lane. Start by testing both right-angle carton orientations, calculate full layers, then cap the geometric total by every applicable weight and safety limit.",
    formula: "Total cartons = min(cartons per layer × full layers, floor(maximum cargo weight ÷ gross carton weight))",
    workedExample: "On a 120 × 100 cm pallet, a 40 × 30 cm carton fits nine per layer in the best simple straight-row orientation. With a 165 cm total-height limit, a 15 cm pallet base, and 25 cm cartons, six full layers fit geometrically: 54 cartons before weight, strength, and stability limits.",
    relatedTool: "pallet-load-calculator",
    guideSlugs: ["standard-pallet-sizes-carton-fit", "pallet-height-weight-stability-limits", "build-a-pallet-loading-plan"],
    questions: [
      { question: "How many cartons fit on a pallet?", answer: "Test both 90-degree carton orientations on the usable pallet footprint, keep whole cartons only, multiply the best layer count by full layers, then apply weight and operating limits." },
      { question: "Does pallet height include the pallet base?", answer: "If the lane specifies a maximum total loaded height, include the pallet base, caps, slip sheets, and any required clearance before calculating full carton layers.", guide: "pallet-height-weight-stability-limits" },
      { question: "Which standard pallet size should I use?", answer: "Use the pallet required by the real pool, customer, rack, and transport lane. Common presets are starting points, not substitutes for the physical pallet specification.", guide: "standard-pallet-sizes-carton-fit" },
      { question: "Is the orientation with the most cartons always safe?", answer: "No. Geometry does not assess compression alignment, interlocking, wrap, overhang, load centre, pallet rating, or route vibration. Approve the pattern through the applicable warehouse and safety process." },
      { question: "What should a pallet loading plan contain?", answer: "Record the pallet type, cartons per layer, layer count, total cartons, finished height, cargo weight, orientation, stabilisation method, revision date, and an approved pattern or photograph.", guide: "build-a-pallet-loading-plan" },
    ],
    sources: [
      { label: "EPAL Euro pallet specifications", url: "https://www.epal-pallets.org/eu-en/load-carriers/epal-euro-pallet" },
      { label: "ISO 6780 pallet dimensions overview", url: "https://www.iso.org/standard/30524.html" },
    ],
  },
  {
    slug: "lcl-weight-measure",
    title: "LCL Weight or Measure: CBM, Revenue Tons & Local Fees",
    shortTitle: "LCL weight or measure",
    category: "Ocean freight",
    description: "Calculate LCL weight or measure across cartons, crates, and pallets, then turn a base W/M rate into an all-in quote comparison.",
    quickAnswer: "For a common LCL weight-or-measure calculation, total the shipment volume in cubic metres and gross weight in metric tonnes. The larger value is the raw W/M quantity. Apply the quoted minimum and rounding, multiply by the applicable per-W/M charges, then add fixed origin, documentation, destination, and inland fees.",
    formula: "Raw W/M = max(total CBM, gross metric tonnes); chargeable W/M = max(raw W/M, quoted minimum)",
    workedExample: "Ten crates measuring 100 × 80 × 80 cm and weighing 420 kg each total 6.4 CBM and 4.2 metric tonnes. Under a common 1 CBM versus 1,000 kg comparison, volume controls at 6.4 W/M units before minimums, rounding, and local charges.",
    relatedTool: "lcl-chargeable-volume-calculator",
    guideSlugs: ["calculate-lcl-wm-multiple-cartons", "understand-lcl-weight-or-measure", "lcl-minimum-charges-local-fees"],
    questions: [
      { question: "What does W/M mean in LCL freight?", answer: "W/M means weight or measure. A common basis compares shipment cubic metres with gross metric tonnes and uses the larger quantity, subject to the tariff or quotation." },
      { question: "How do I calculate LCL CBM for multiple cartons?", answer: "Calculate each handling-unit type separately using finished outside dimensions and quantity, convert each result to cubic metres, and add the lines once without double-counting palletised cargo.", guide: "calculate-lcl-wm-multiple-cartons" },
      { question: "When does weight control instead of volume?", answer: "Under a 1 CBM to 1,000 kg comparison, gross metric tonnes control when that number is greater than total CBM. The quoted density or revenue-ton rule may differ." },
      { question: "How does a minimum W/M charge work?", answer: "Compare the raw W/M result with the minimum stated for each affected fee line. A shipment below a one-W/M minimum may be billed at one unit for that line.", guide: "lcl-minimum-charges-local-fees" },
      { question: "Why is an LCL invoice higher than the ocean rate?", answer: "Origin handling, documentation, security, consolidation, destination CFS, delivery order, customs services, storage, and inland transport can outweigh the headline ocean charge.", guide: "lcl-minimum-charges-local-fees" },
    ],
    sources: [
      { label: "Maersk LCL weight and measure terms", url: "https://terms.maersk.com/LCL" },
      { label: "Maersk LCL CBM support", url: "https://www.maersk.com/fr-fr/support/faqs/how-can-calculate-my-lcl-cbm-volumes" },
    ],
  },
];

export function getTopic(slug: string) {
  return topics.find((topic) => topic.slug === slug);
}

export function getTopicForTool(toolSlug: string) {
  return topics.find((topic) => topic.relatedTool === toolSlug);
}
