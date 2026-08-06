export type FreightQuestion = {
  slug: string;
  title: string;
  description: string;
  answer: string;
  tool: string;
  toolLabel: string;
  steps: string[];
  related: string[];
};

export const freightQuestions: FreightQuestion[] = [
  {
    slug: "how-to-calculate-dimensional-weight",
    title: "How do I calculate dimensional weight for FedEx, UPS, DHL, or USPS?",
    description: "Use finished package dimensions, the divisor for the exact service, and actual packed weight to find the planning chargeable weight.",
    answer: "Multiply the outside length, width, and height of the finished parcel, divide by the carrier or contract divisor, and compare the result with actual packed weight. The larger eligible weight normally controls before the carrier's measurement and billing-rounding rules.",
    tool: "dimensional-weight-calculator",
    toolLabel: "Dimensional Weight Calculator",
    steps: ["Measure the sealed outside parcel, not the product or an empty carton.", "Select the unit system and divisor that match the carrier service and rate card.", "Compare dimensional weight with scale weight and apply the per-parcel rounding rule.", "Run a packaging test if dimensional weight controls the quote."],
    related: ["/topics/dimensional-weight", "/guides/dimensional-weight-carrier-divisors", "/guides/actual-weight-vs-dimensional-weight"],
  },
  {
    slug: "how-many-boxes-fit-on-a-pallet",
    title: "How many boxes fit on a pallet?",
    description: "Calculate whole cartons per layer, full layers, finished height, gross load weight, and the limit that controls the pallet plan.",
    answer: "Test both right-angle carton orientations on the usable pallet footprint, keep whole cartons only, multiply the best layer count by full layers, then cap that geometric count by height, gross weight, pallet rating, stability, and customer or transport rules.",
    tool: "pallet-load-calculator",
    toolLabel: "Pallet Loading Calculator",
    steps: ["Enter the actual pallet footprint and carton outside dimensions.", "Compare both orientations and retain only full rows and full layers.", "Subtract the pallet base and required clearance from any total-height limit.", "Record the lowest approved limit and verify the pattern with a physical load trial."],
    related: ["/topics/pallet-loading", "/guides/standard-pallet-sizes-carton-fit", "/guides/pallet-height-weight-stability-limits"],
  },
  {
    slug: "how-is-lcl-chargeable-volume-calculated",
    title: "How is LCL chargeable volume calculated?",
    description: "Calculate CBM and gross metric tonnes for multiple cargo lines, then compare them under the quoted weight-or-measure rule.",
    answer: "Calculate each carton, crate, or pallet line from finished outside dimensions and quantity, add total CBM, convert gross kilograms to metric tonnes, and compare the two numbers. A common W/M basis uses the larger number before quoted minimums, rounding, and local fees.",
    tool: "lcl-chargeable-volume-calculator",
    toolLabel: "LCL W/M Calculator",
    steps: ["Create one line per handling-unit type and avoid double-counting palletised cargo.", "Total outside volume in cubic metres and gross weight in kilograms.", "Compare CBM with gross metric tonnes under the forwarder's written W/M rule.", "Add minimums and fixed origin, destination, documentation, customs, and inland charges separately."],
    related: ["/topics/lcl-weight-measure", "/guides/calculate-lcl-wm-multiple-cartons", "/guides/lcl-minimum-charges-local-fees"],
  },
  {
    slug: "actual-or-dimensional-weight-for-shipping",
    title: "Should I use actual weight or dimensional weight for shipping?",
    description: "Compare scale weight and cube weight per parcel and identify the packaging change that can actually lower a billable result.",
    answer: "Use both. Actual weight comes from the packed parcel on a scale; dimensional weight comes from finished outside cube divided by the service divisor. The service rule commonly starts with the larger eligible result, then applies its rounding and minimums.",
    tool: "dimensional-weight-calculator",
    toolLabel: "Compare Actual vs Dimensional Weight",
    steps: ["Record actual packed weight and outside dimensions for every package type.", "Calculate dimensional weight with the exact service divisor and units.", "Find the break-even cube where dimensional weight equals scale weight.", "Test a smaller package only if damage, labour, and material costs remain acceptable."],
    related: ["/topics/dimensional-weight", "/guides/actual-weight-vs-dimensional-weight", "/guides/dimensional-weight-packaging-audit"],
  },
  {
    slug: "compare-lcl-and-pallet-shipping-cost",
    title: "How do I compare LCL and pallet shipping cost?",
    description: "Build a comparable shipment scope before choosing between loose LCL cargo, palletised freight, or a parcel service.",
    answer: "Compare the same origin, destination, Incoterm, currency, validity, and delivery scope. Calculate the physical volume and gross weight, then add the chargeable W/M minimums, pallet or CFS handling, documents, customs, destination fees, inland delivery, and storage exposure instead of comparing headline ocean rates alone.",
    tool: "lcl-chargeable-volume-calculator",
    toolLabel: "Build an LCL Quote Check",
    steps: ["Use the real tender form: loose cartons, crates, or pallet envelopes.", "Calculate CBM and gross metric tonnes without double-counting.", "List every fee by unit: W/M, shipment, document, pallet, or actual cost.", "Compare all-in cost and transit or handling constraints, not just the base rate."],
    related: ["/topics/lcl-weight-measure", "/guides/lcl-minimum-charges-local-fees", "/guides/cbm-vs-weight-ton-vs-wm-lcl"],
  },
];

export function getFreightQuestion(slug: string) {
  return freightQuestions.find((question) => question.slug === slug);
}
