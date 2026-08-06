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
};
