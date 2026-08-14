export type PriorityToolContent = {
  searchLead: string;
  useWhen: string[];
  notFor: string[];
};

export const priorityToolContent: Record<string, PriorityToolContent> = {
  "dimensional-weight-calculator": {
    searchLead: "Compare the parcel's actual weight with dimensional weight before you accept a carrier quote or choose packaging.",
    useWhen: [
      "You need a quick FedEx, UPS, DHL or USPS divisor comparison.",
      "You want to see whether cube or scale weight controls the billable basis.",
      "You are checking a finished outside package, not the product alone.",
    ],
    notFor: [
      "A binding negotiated rate, accessorial fee or service-eligibility decision.",
      "Irregular freight that needs carrier measurement or dimensional inspection.",
      "Replacing the divisor and rounding rule shown on your current rate card.",
    ],
  },
  "pallet-load-calculator": {
    searchLead: "Estimate cartons per layer, layers, finished height and the weight limit that controls a pallet loading plan.",
    useWhen: [
      "You are comparing Euro, industrial, GMA or custom pallet footprints.",
      "You need a whole-carton orientation before a warehouse trial load.",
      "You want height, footprint and gross-weight constraints in one result.",
    ],
    notFor: [
      "Approving pallet stability, compression strength or safe working load.",
      "Mixed-carton nesting, interlocking patterns or overhang optimisation.",
      "Ignoring equipment clearance, wrap, straps or transport restrictions.",
    ],
  },
  "lcl-chargeable-volume-calculator": {
    searchLead: "Compare LCL chargeable CBM with metric tonnes, apply W/M minimums and expose fixed local charges in one estimate.",
    useWhen: [
      "A forwarder quotes ocean freight by weight or measure (W/M).",
      "Your shipment contains multiple carton, crate or pallet lines.",
      "You want to audit a quote before comparing the headline ocean rate.",
    ],
    notFor: [
      "Choosing a tariff, currency or local charge that is absent from the quote.",
      "Assuming every forwarder uses the same minimum, rounding or density rule.",
      "Treating an estimate as a booking confirmation or customs declaration.",
    ],
  },
  "cbm-calculator": {
    searchLead: "Calculate freight CBM from packed outside dimensions and quantity, with centimetre, metre, inch, and foot inputs converted automatically.",
    useWhen: [
      "You need total cubic metres for a freight quote or booking request.",
      "You have repeated cartons, crates, or pallets in one consistent size.",
      "You want CBM, cubic feet, litres, and volume per piece from the same inputs.",
    ],
    notFor: [
      "Assuming carton cube equals a larger palletised or irregular outside envelope.",
      "Choosing chargeable air or LCL weight without also entering gross weight.",
      "Replacing a carrier's measurement, minimum, or rounding rule.",
    ],
  },
  "landed-cost-calculator": {
    searchLead: "Turn supplier price, international freight, duty, import tax, clearance fees, and quantity into an all-in landed cost per unit.",
    useWhen: [
      "You are comparing suppliers or import scenarios on an all-in basis.",
      "You need to expose freight, duty, tax, brokerage, and other fees separately.",
      "You want a repeatable unit-cost estimate before setting a selling price.",
    ],
    notFor: [
      "Selecting a tariff code, origin rule, customs value, or tax base.",
      "Assuming one duty and import-tax method works in every jurisdiction.",
      "Replacing a customs broker's entry calculation or a binding government ruling.",
    ],
  },
};
