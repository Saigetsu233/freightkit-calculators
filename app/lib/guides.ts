export type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  relatedTool: string;
  takeaway: string;
  sections: GuideSection[];
  checklist: string[];
  sources?: Array<{ label: string; url: string }>;
};

export const guides: Guide[] = [
  {
    slug: "dimensional-weight-packaging-audit",
    title: "A practical dimensional-weight packaging audit",
    description: "Find cartons that are quietly increasing parcel charges, then test changes without weakening the pack.",
    category: "Parcel",
    readTime: "7 min",
    relatedTool: "dimensional-weight-calculator",
    takeaway: "Audit the gap between actual and dimensional weight at SKU level, starting with high-volume parcels where the billed-weight gap is largest.",
    sections: [
      { heading: "Start with the billed-weight gap", paragraphs: ["A dimensional-weight audit is not a hunt for the smallest possible box. It is a search for avoidable empty cube that repeatedly turns into billed weight. Export a month of parcel data, record the outside dimensions actually tendered, and compare scale weight with the dimensional calculation from the applicable rate card.", "Rank shipments by annualised cost opportunity: billed-weight gap multiplied by shipment count and the relevant rate per weight step. This keeps attention on a carton that ships 8,000 times, not an unusual parcel that appeared twice."], bullets: ["Use finished outside dimensions, including bulges.", "Keep each carrier, service, and divisor separate.", "Capture the billed rounding step, not only the raw result."] },
      { heading: "Test a controlled packaging change", paragraphs: ["For the top candidates, measure the product arrangement, cushioning, void fill, inserts, and required clearance. Test a smaller stock carton, a different orientation, or a made-to-size carton. Recalculate the dimensional result before ordering packaging.", "A saving is only real if the pack still survives handling and the operational change is repeatable. Run a short packing trial, record damage and packing time, and confirm that the scanner or manifest receives the new dimensions."], bullets: ["Compare material and labour changes with freight savings.", "Test the packed sample, not an empty carton.", "Update master data after approval."] },
      { heading: "Worked example", paragraphs: ["A 50 × 40 × 30 cm parcel has 60,000 cm³ of cube. At a 5,000 divisor, dimensional weight is 12 kg. If the product weighs 7 kg, the initial billed-weight basis is 12 kg before rounding. Reducing height to 22 cm lowers dimensional weight to 8.8 kg. The operational question is whether that 3.2 kg gap crosses enough billing steps, often enough, to pay for the packaging change."] },
    ],
    checklist: ["Current outside dimensions", "Actual scale weight", "Contract divisor and rounding", "Monthly parcel count", "Pack test result", "Packaging and labour delta"],
    sources: [{ label: "FedEx dimensional weight overview", url: "https://www.fedex.com/en-us/shipping/packaging/what-is-dimensional-weight.html" }],
  },
  {
    slug: "how-to-calculate-cbm-for-freight",
    title: "How to calculate CBM for a freight quote",
    description: "Turn carton or crate dimensions into a defensible total-volume figure for air, ocean, and road quotes.",
    category: "Freight",
    readTime: "6 min",
    relatedTool: "cbm-calculator",
    takeaway: "Convert every handling unit to metres, multiply length by width by height, then multiply by quantity and keep unlike packages on separate lines.",
    sections: [
      { heading: "Measure the shipping unit", paragraphs: ["CBM means cubic metres. Measure the outside of the packed carton, crate, or palletised load at its longest, widest, and highest points. Internal product dimensions understate the space a carrier must reserve.", "Convert centimetres to metres before multiplying, or divide the cubic-centimetre result by 1,000,000. For mixed shipments, calculate each package type separately and add the volumes."], bullets: ["60 × 40 × 35 cm = 0.084 m³ per carton.", "24 identical cartons = 2.016 m³ total.", "Round only after adding line totals."] },
      { heading: "Add what the carrier must handle", paragraphs: ["If cartons ship on pallets, quote the palletised outside dimensions rather than the carton sum when the pallet creates empty space, overhang, or extra height. Irregular loads should be measured as the smallest rectangular envelope that contains the load unless the carrier provides another method.", "Volume is not the same as chargeable volume. Air freight compares volumetric and gross weight; LCL ocean freight commonly compares cubic metres with metric tonnes; road carriers may use load metres or pallet spaces. Give the forwarder both volume and gross weight."] },
      { heading: "Make the quote reproducible", paragraphs: ["Keep a packing line for every handling-unit type: description, dimensions, unit, quantity, volume per unit, total volume, weight per unit, and total gross weight. This small table prevents most unit and quantity errors and makes later invoice checks possible."] },
    ],
    checklist: ["Packed outside dimensions", "Dimension unit", "Handling-unit quantity", "Pallet overhang and height", "Gross weight", "Separate lines for mixed packages"],
  },
  {
    slug: "build-a-pallet-loading-plan",
    title: "Build a pallet loading plan before the warehouse starts",
    description: "Estimate layers, height, weight, and carton count while keeping the safety checks visible.",
    category: "Warehouse",
    readTime: "8 min",
    relatedTool: "pallet-load-calculator",
    takeaway: "A pallet plan must pass footprint, height, weight, stability, and carton-strength checks; the smallest of those limits controls the load.",
    sections: [
      { heading: "Calculate the geometric ceiling", paragraphs: ["Start with the usable pallet footprint and test both 90-degree carton orientations. Multiply the best whole-carton count per layer by the number of full layers allowed by the load-height limit. This gives a geometric ceiling, not yet a safe capacity.", "Include pallet base height when the transport limit is a total height. Do not count a partial layer unless the warehouse has a documented mixed-layer pattern."], bullets: ["No overhang unless the operation explicitly allows it.", "Reserve height for caps, edge boards, or dunnage.", "Use finished carton dimensions."] },
      { heading: "Apply weight and strength limits", paragraphs: ["Divide the allowed load weight by gross carton weight and round down. Compare that number with the geometric ceiling. Then verify the pallet's rated capacity, racking condition, forklift handling, vehicle limits, and the bottom cartons' compression performance.", "Interlocking patterns can improve stability but often reduce vertical compression strength. Column stacking can improve compression alignment but may require stretch wrap, corner boards, or other stabilisation. Treat the pattern as an operational standard, not an illustration." ] },
      { heading: "Issue a one-page load specification", paragraphs: ["The approved specification should show pallet type, cartons per layer, layers, total cartons, finished height, load weight, orientation, wrap method, and a photo or simple pattern. Add a revision date so old instructions do not survive a packaging change."] },
    ],
    checklist: ["Pallet size and rating", "Carton outside dimensions", "Gross carton weight", "Height and weight limits", "Stability method", "Warehouse trial and sign-off"],
    sources: [{ label: "EPAL pallet specifications", url: "https://www.epal-pallets.org/eu-en/load-carriers/epal-euro-pallet" }],
  },
  {
    slug: "choose-a-master-carton-size",
    title: "Choose a master carton size with fewer guesses",
    description: "Move from product dimensions to a testable carton specification and avoid paying for unused cube.",
    category: "Packaging",
    readTime: "7 min",
    relatedTool: "carton-fit-calculator",
    takeaway: "Start with the product arrangement and protection system, then add controlled clearance and validate the packed sample.",
    sections: [
      { heading: "Design around the packed product", paragraphs: ["Product dimensions alone are not carton dimensions. Define how many sale units belong in a master carton, their allowed orientations, retail-pack protection, dividers, bags, pads, and required handling clearance. Record the resulting product block before adding board allowances.", "Use a carton-fit calculation to compare simple right-angle patterns, but remember it assumes a perfect grid. Bottles, pouches, handles, and nested parts can require a physical mock-up or packaging CAD." ] },
      { heading: "Compare the whole-system cost", paragraphs: ["A smaller carton can reduce corrugated area, void fill, pallet count, dimensional parcel weight, and container cube. It can also increase packing time, damage, or the number of cartons per order. Model those changes together.", "Prefer a small set of stock sizes when the logistics saving from a custom size is weak. Prefer a custom size when shipment frequency and cube savings comfortably exceed tooling, inventory, and changeover cost."], bullets: ["Calculate cost per shipped unit, not cost per carton.", "Check pallet and parcel implications.", "Avoid a dimension that sits just above a carrier threshold."] },
      { heading: "Approve with evidence", paragraphs: ["Pack representative products at normal line speed, measure finished outside dimensions and gross weight, and run the applicable handling or transit test. Record pass criteria before the trial. A carton is approved only when product protection and operational repeatability are acceptable." ] },
    ],
    checklist: ["Units per carton", "Product orientation", "Protection materials", "Finished outside size", "Packing time", "Damage-test result"],
  },
  {
    slug: "container-loading-estimate-checklist",
    title: "A container-loading estimate you can actually challenge",
    description: "Use carton capacity calculations as an upper bound, then subtract the constraints that software cannot see.",
    category: "Ocean freight",
    readTime: "8 min",
    relatedTool: "container-loading-calculator",
    takeaway: "A single-SKU rectangular grid is a ceiling; door opening, weight distribution, mixed cargo, bracing, and the real container control the plan.",
    sections: [
      { heading: "Calculate an upper bound", paragraphs: ["For identical rectangular cartons, test all six axis-aligned orientations against representative internal length, width, and height. Whole-number counts along each axis produce a simple capacity. Compare the best count with volume utilisation to spot obviously unrealistic arrangements.", "The highest mathematical count may be hard to load, may place labels incorrectly, or may create weak carton orientation. Keep at least one operationally workable alternative." ] },
      { heading: "Subtract real constraints", paragraphs: ["Confirm the equipment type and the carrier's actual container specification. Door openings can be smaller than internal dimensions. Floor features, lashing points, moisture controls, dunnage, and load bracing consume space. Heavy cargo may reach payload or axle constraints long before filling the cube.", "Mixed-SKU loading is a three-dimensional packing problem with business rules: unloading sequence, compatibility, crush risk, lot separation, and customs access. Use specialist planning or a physical load plan for high-value moves."], bullets: ["Check payload and verified gross mass requirements.", "Keep the centre of gravity and floor loading reasonable.", "Reserve access and bracing space where required."] },
      { heading: "Close the loop", paragraphs: ["After loading, record actual carton count, unused space, loading time, and exceptions. Update the planning factor for the next shipment instead of repeatedly quoting the theoretical maximum." ] },
    ],
    checklist: ["Exact container type", "Internal and door dimensions", "Cargo gross weight", "Load sequence", "Bracing and dunnage", "Actual load feedback"],
    sources: [{ label: "Hapag-Lloyd container information", url: "https://www.hapag-lloyd.com/en/services-information/cargo-fleet/container.html" }],
  },
  {
    slug: "landed-cost-model-for-imports",
    title: "Build a landed-cost model for an import order",
    description: "Put product, freight, customs, tax, and clearance charges on one auditable per-unit basis.",
    category: "Commerce",
    readTime: "8 min",
    relatedTool: "landed-cost-calculator",
    takeaway: "Separate commercial value, logistics, duty, recoverable tax, and non-recoverable fees so pricing decisions are based on the right cost.",
    sections: [
      { heading: "Define the cost boundary", paragraphs: ["Landed cost should answer a specific question: what has one sellable unit cost by the time it reaches a named place and condition? State the destination, Incoterm, currency, and whether warehouse receiving is included.", "Collect the supplier invoice, international freight, insurance, origin charges not included by the supplier, brokerage, duty, import tax, port or airport charges, inland transport, inspection, and bank or currency costs." ] },
      { heading: "Keep tax logic explicit", paragraphs: ["Customs value and the import-tax base vary by jurisdiction and product. Duty may apply to a value that includes freight and insurance; import tax may apply after duty. Some taxes may be recoverable and should not be buried in inventory cost. Confirm the treatment with a qualified broker or adviser.", "For multi-SKU orders, allocate shared charges using a driver that matches the cost: value for insurance or duty-related charges, weight for heavy freight, volume for cube-driven freight, or a hybrid method."], bullets: ["Keep source currency and exchange rate visible.", "Separate estimates from final entry documents.", "Version tariff classifications and duty rates."] },
      { heading: "Reconcile estimate to actual", paragraphs: ["After clearance, replace estimates with invoice and entry figures. Record the variance by cost category. The next purchase order should use current rates plus a contingency based on observed variance, not an unexplained percentage." ] },
    ],
    checklist: ["Named cost boundary", "Incoterm and currency", "Customs value method", "Duty and tax treatment", "Allocation driver", "Estimate-to-actual reconciliation"],
  },
  {
    slug: "understand-lcl-weight-or-measure",
    title: "Understand LCL weight or measure before comparing quotes",
    description: "Calculate the basic W/M unit and identify the local charges that often dominate a small ocean shipment.",
    category: "Ocean freight",
    readTime: "6 min",
    relatedTool: "lcl-chargeable-volume-calculator",
    takeaway: "The larger of cubic metres and metric tonnes is often the starting chargeable quantity, but the full quote includes minimums and local fees.",
    sections: [
      { heading: "Calculate the base W/M quantity", paragraphs: ["For a common LCL weight-or-measure comparison, calculate total shipment volume in cubic metres and total gross weight in metric tonnes. The larger number becomes the base revenue-ton or W/M quantity. A 6.4 CBM shipment weighing 4.2 tonnes is volume-driven at 6.4 units.", "This is only a model. The quotation or tariff controls the actual minimum, unit definition, density rule, and rounding." ] },
      { heading: "Compare all-in quotes", paragraphs: ["Ocean freight can be a small part of the invoice. Put origin handling, documentation, export clearance, consolidation, destination handling, deconsolidation, delivery order, customs brokerage, storage risk, and inland transport on the comparison sheet.", "Check whether fees are per shipment, per W/M, per document, or subject to a minimum. Align currency and exchange-rate assumptions before ranking options."], bullets: ["Compare the same Incoterm and endpoints.", "Record free-time and storage exposure.", "Ask which charges are payable at destination."] },
      { heading: "Audit the invoice", paragraphs: ["Keep the quoted measurements and fees beside the final bill of lading and invoice. If the warehouse remeasures cargo, request the measurement record. Reconcile every difference before using the old quote as a future budget." ] },
    ],
    checklist: ["CBM", "Gross metric tonnes", "Minimum W/M", "Origin charges", "Destination charges", "Currency and validity"],
  },
  {
    slug: "air-freight-chargeable-weight-workflow",
    title: "Air freight chargeable weight: a quote-check workflow",
    description: "Compare gross and volumetric weight without losing track of divisor, piece count, and rounding.",
    category: "Air freight",
    readTime: "7 min",
    relatedTool: "air-freight-chargeable-weight-calculator",
    takeaway: "Use packed dimensions, total all pieces consistently, and apply the exact divisor and rounding method from the forwarder.",
    sections: [
      { heading: "Prepare consistent measurements", paragraphs: ["List each package type with finished length, width, height, piece count, and gross weight. Keep dimensions and weight in the unit system required by the quote. For centimetres and kilograms, volumetric weight is often modelled by dividing cubic centimetres by 6,000, but the applicable contract may differ.", "Compare shipment gross weight with shipment volumetric weight unless the forwarder applies rules at piece level. The higher basis normally becomes chargeable weight before minimums and rounding." ] },
      { heading: "Avoid common quote errors", paragraphs: ["Do not mix net product weight with packed gross weight. Do not multiply dimensions by pieces twice. Do not round each intermediate cube unless the tariff requires it. Oversize pieces, non-stackable cargo, dangerous goods, and density minimums can create additional charges outside the formula."], bullets: ["Photograph and measure the packed piece.", "Ask whether dimensions are rounded up.", "Confirm divisor, minimum, and pivot weight."] },
      { heading: "Use chargeable weight as a design signal", paragraphs: ["If volumetric weight consistently exceeds gross weight, prioritise cube reduction. If gross weight controls, a smaller carton may still improve handling but may not change the base air-freight charge. Test the saving against packaging and operational cost." ] },
    ],
    checklist: ["Packed dimensions by piece type", "Total gross weight", "Divisor", "Rounding method", "Minimum charge", "Special handling rules"],
    sources: [{ label: "DHL volumetric weight explainer", url: "https://www.dhl.com/discover/en-global/logistics-advice/import-export-advice/what-is-volumetric-weight" }],
  },
  {
    slug: "set-a-reorder-point",
    title: "Set a reorder point without hiding the assumptions",
    description: "Turn demand, lead time, and safety stock into a trigger that planners can review and improve.",
    category: "Inventory",
    readTime: "7 min",
    relatedTool: "reorder-point-calculator",
    takeaway: "A reorder point is lead-time demand plus safety stock; its quality depends on fresh demand and lead-time data.",
    sections: [
      { heading: "Choose the planning inputs", paragraphs: ["Use the same time unit for demand and lead time. If demand is daily, convert supplier lead time to calendar or working days consistently. Calculate an average from a period that reflects the current business, and flag promotions, stockouts, or one-off orders that distort it.", "Safety stock is not a random cushion. It should cover the service risk created by demand and lead-time variability, subject to working-capital and obsolescence limits." ] },
      { heading: "Calculate and operationalise the trigger", paragraphs: ["Multiply average daily demand by average replenishment lead time, then add safety stock. For 18 units per day, 21 days, and 120 units of safety stock, the reorder point is 498 units.", "Your system should compare the trigger with inventory position, not blindly with shelf stock. Inventory position commonly considers on-hand, open supply, reservations, and backorders."], bullets: ["State whether lead time includes review and receiving.", "Round order quantities to real pack sizes.", "Create an exception for demand spikes."] },
      { heading: "Review on a schedule", paragraphs: ["Fast movers and unreliable suppliers deserve frequent review. Track stockouts, excess stock, actual lead time, and forecast error. A trigger that is never recalibrated becomes an undocumented guess." ] },
    ],
    checklist: ["Demand history window", "Lead-time definition", "Safety-stock method", "Inventory-position logic", "Pack and MOQ rules", "Review frequency"],
  },
  {
    slug: "when-eoq-is-useful",
    title: "When EOQ is useful—and when it is not",
    description: "Use economic order quantity as a transparent baseline, then test the real constraints it leaves out.",
    category: "Inventory",
    readTime: "7 min",
    relatedTool: "eoq-calculator",
    takeaway: "EOQ balances ordering and holding cost under restrictive assumptions; use it as a baseline, not an automatic purchase quantity.",
    sections: [
      { heading: "Understand the trade-off", paragraphs: ["Ordering small quantities frequently increases ordering, receiving, and transport activity. Ordering large quantities increases average inventory, capital, storage, insurance, shrinkage, and obsolescence exposure. The classic EOQ formula finds the point where the modelled annual ordering and holding costs balance.", "The three inputs are annual demand, cost per order, and annual holding cost per unit. Holding cost should reflect the costs that truly change with inventory, not simply a convenient percentage." ] },
      { heading: "Challenge the assumptions", paragraphs: ["EOQ assumes steady demand and lead time, immediate replenishment, no shortages, stable unit cost, and no quantity discounts. Real purchasing adds supplier MOQs, case packs, container utilisation, expiry, seasonality, capacity, and cash constraints.", "Calculate the EOQ, then compare nearby feasible quantities. The annual cost curve around EOQ is often shallow, so a practical pack quantity can be nearly as economical while fitting operations better."], bullets: ["Round to supplier and logistics units.", "Test discount breaks on total annual cost.", "Cap quantities for shelf life or obsolescence."] },
      { heading: "Pair EOQ with a timing rule", paragraphs: ["EOQ suggests how much to order; a reorder point suggests when. Use both only after defining safety stock and inventory position. Track results and revise input costs instead of treating the first answer as permanent." ] },
    ],
    checklist: ["Annual demand", "Incremental order cost", "Holding cost per unit-year", "MOQ and pack size", "Discount tiers", "Shelf-life and cash limits"],
  },
  {
    slug: "compare-freight-quotes",
    title: "Compare freight quotes on an all-in basis",
    description: "Normalise scope, currency, chargeable units, and accessorial fees before choosing the lowest-looking rate.",
    category: "Freight",
    readTime: "8 min",
    relatedTool: "shipping-cost-estimator",
    takeaway: "A fair comparison uses the same shipment facts, endpoints, service scope, currency, and risk assumptions for every provider.",
    sections: [
      { heading: "Freeze the shipment facts", paragraphs: ["Issue one quote request with origin and destination, collection and delivery requirements, Incoterm, ready date, commodity, package count, dimensions, gross weight, stackability, special handling, and desired service. Quote differences are meaningless if carriers price different facts.", "Record the validity period and the chargeable basis returned by each provider. If a carrier changes dimensions or weight, resolve that difference before comparing price." ] },
      { heading: "Build the all-in column", paragraphs: ["Separate base freight, fuel, security, documentation, terminal or hub charges, pickup, delivery, customs services, residential or remote surcharges, appointment fees, and taxes. Convert all amounts using one visible exchange rate.", "Add expected risk costs where material: storage caused by short free time, demurrage exposure, failed delivery, or a service level that increases stockout risk. Do not hide these as an arbitrary markup."], bullets: ["Use cost per chargeable kg, CBM, pallet, or shipment.", "Compare transit definition and frequency.", "Keep exclusions beside the total."] },
      { heading: "Score service separately", paragraphs: ["Price is one column. Add schedule reliability, claims history, communication, data quality, capacity, and exception handling as separate criteria. This prevents a subjective service preference from being disguised inside the cost calculation." ] },
    ],
    checklist: ["Common quote brief", "Chargeable basis", "All fixed and variable fees", "Currency and validity", "Transit definition", "Exclusions and risk"],
  },
  {
    slug: "protect-ecommerce-margin-from-shipping",
    title: "Protect ecommerce margin from shipping and returns",
    description: "Calculate contribution per order before discounts, free-shipping promises, and ad spend scale losses.",
    category: "Commerce",
    readTime: "7 min",
    relatedTool: "ecommerce-margin-calculator",
    takeaway: "Use contribution margin after product, fulfilment, shipping, payment, marketplace, advertising, and expected return costs—not gross margin alone.",
    sections: [
      { heading: "Build the order-level cost stack", paragraphs: ["Start with selling price after discount. Subtract product cost, inbound allocation, pick-and-pack, packaging, outbound shipping, fixed payment fees, percentage marketplace and payment fees, and variable advertising cost. Add an expected return cost based on the return rate and loss per return.", "Keep fixed business overhead separate when the question is whether one more order contributes cash. Include allocated overhead when the question is whether a product or channel is sustainable overall." ] },
      { heading: "Test the promises customers see", paragraphs: ["Free shipping is a price structure, not a free cost. Compare a delivered price with a product-plus-shipping price and measure conversion, average order value, and contribution. For discounts, percentage fees fall with revenue but most fulfilment costs do not.", "Run scenarios for parcel zones, dimensional weight, multi-item orders, and return rates. A single average can hide a region or SKU that loses money."], bullets: ["Model the actual payment fee structure.", "Use packed parcel data by SKU or order type.", "Treat ad cost as a distribution, not a guarantee."] },
      { heading: "Set a stop rule", paragraphs: ["Define a minimum contribution per order or contribution margin before launching a promotion. Review actual cohort performance after enough orders, including refunds and shipping adjustments, then stop or reprice offers that miss the rule." ] },
    ],
    checklist: ["Net selling price", "All fulfilment costs", "Percentage and fixed fees", "Ad cost per order", "Expected return loss", "Minimum contribution rule"],
  },
  {
    slug: "reduce-packaging-waste-with-yield-data",
    title: "Reduce packaging waste with a simple yield record",
    description: "Separate good-output usage, recoverable scrap, and true loss so improvement work starts with evidence.",
    category: "Packaging",
    readTime: "6 min",
    relatedTool: "packaging-waste-calculator",
    takeaway: "Measure purchased input, material in good output, and recoverable scrap in one unit; investigate the remaining loss by cause.",
    sections: [
      { heading: "Create a material balance", paragraphs: ["Choose a consistent unit such as kilograms, square metres, sheets, or linear metres. For each run, record opening usable stock plus receipts, material used in accepted output, separately recoverable scrap, and closing usable stock. The unexplained balance is the first signal to investigate.", "Do not mix trim that is credited by a recycler with contaminated waste or inventory-count error. Those categories have different financial and environmental actions." ] },
      { heading: "Attach a cause to loss", paragraphs: ["Tag setup sheets, print or cut defects, changeover remnants, damaged stock, design trim, overproduction, and unexplained variance. Pareto the cost, not only the quantity, because high-spec material can make a small loss expensive.", "Run one controlled improvement at a time: nesting change, setup standard, incoming inspection, storage protection, or operator instruction. Compare yield over enough runs to separate the change from normal variation."], bullets: ["Use standard output quantity and material specification.", "Keep rework from being counted twice.", "Verify scales and inventory adjustments."] },
      { heading: "Turn yield into money", paragraphs: ["Multiply net waste by the relevant material cost and subtract real scrap recovery. Add disposal, downtime, and replacement freight if they change. This produces a savings ceiling against which tooling or process investment can be judged." ] },
    ],
    checklist: ["Common measurement unit", "Opening and closing stock", "Good-output usage", "Recoverable scrap", "Waste cause", "Net cost and improvement owner"],
  },
  {
    slug: "audit-a-warehouse-storage-quote",
    title: "Audit a warehouse storage quote before signing",
    description: "Translate pallet rates, handling, minimums, and long-term surcharges into a realistic monthly scenario.",
    category: "Warehouse",
    readTime: "7 min",
    relatedTool: "warehouse-storage-cost-calculator",
    takeaway: "Model inventory over time and keep storage, handling, fulfilment, minimums, and exception fees separate.",
    sections: [
      { heading: "Define the billing unit", paragraphs: ["Storage may be billed per pallet position, cubic metre, bin, square foot, or item, and may use daily, weekly, or monthly snapshots. Ask how partial periods, peak inventory, and non-standard pallets are treated.", "Create a month-by-month pallet forecast rather than multiplying the opening inventory by an annual rate. Include expected receipts, sales, seasonal peaks, and slow-moving stock." ] },
      { heading: "Add movement and service fees", paragraphs: ["Inbound and outbound pallet handling, container unloading, labelling, put-away, pick-and-pack, cartons, order fees, returns, cycle counts, EDI, account management, and carrier handoff may outweigh storage. Capture which services are included and the minimum monthly invoice.", "Long-term storage, oversized items, hazardous goods, weekend labour, and urgent orders often have separate rates. Mark each as included, excluded, or scenario-dependent."], bullets: ["Use a representative order profile.", "Model a peak and a normal month.", "Check annual price increases and exit charges."] },
      { heading: "Compare cost with operating fit", paragraphs: ["Normalise total cost per order, per unit, and per pallet-month, but score cut-off times, accuracy, integrations, claims, and capacity separately. The cheapest model is not useful if the service cannot support the promise made to customers." ] },
    ],
    checklist: ["Billing unit and timing", "Inventory forecast", "Handling events", "Order profile", "Minimums and surcharges", "Exit and transition costs"],
  },
  {
    slug: "freight-density-and-classification",
    title: "Freight density is a measurement, not a classification answer",
    description: "Calculate physical density correctly and know when the carrier's product or class rules still control the quote.",
    category: "Freight",
    readTime: "6 min",
    relatedTool: "freight-density-calculator",
    takeaway: "Density is gross weight divided by outside cube; classification can also depend on handling, stowability, liability, and current tariff rules.",
    sections: [
      { heading: "Calculate physical density", paragraphs: ["Measure the full shipping unit—including pallet, overhang, and load height—and total gross weight. Divide kilograms by cubic metres for kg/m³, or pounds by cubic feet for lb/ft³. Mixed pieces can be totalled if their combined weight and combined outside volume are both complete.", "Reweigh or remeasure when packaging changes. Small dimension errors on a large shipment can materially change density." ] },
      { heading: "Keep classification separate", paragraphs: ["Some transport tariffs use density as one input, but a density result does not by itself determine a commodity description, freight class, or rate. Handling difficulty, stowability, liability, value, packaging, and specific product provisions may matter.", "Use the carrier's current tariff, your contract, and an accurate commodity description. If classification affects a material quote, ask the carrier or a qualified specialist to confirm it in writing."], bullets: ["Do not label a density lookup as a guaranteed class.", "Keep the measurement record and photographs.", "Use gross, not net, shipment weight."] },
      { heading: "Use density operationally", paragraphs: ["Even where it does not set the rate, density helps compare packaging options, trailer cube, warehouse utilisation, and unusually light or heavy loads. Treat it as a consistent physical KPI." ] },
    ],
    checklist: ["Full outside cube", "Total gross weight", "Current commodity description", "Applicable tariff or contract", "Carrier confirmation", "Measurement record"],
  },
  {
    slug: "turn-packaging-calculations-into-sop",
    title: "Turn a packaging calculation into a warehouse SOP",
    description: "Bridge the gap between a correct spreadsheet answer and a repeatable pack on the floor.",
    category: "Operations",
    readTime: "7 min",
    relatedTool: "pallet-stack-height-calculator",
    takeaway: "A useful SOP states inputs, pattern, limits, checks, ownership, and revision control in a form the packer can execute.",
    sections: [
      { heading: "Freeze the approved inputs", paragraphs: ["Record the product or SKU, packaging revision, carton specification, pack quantity, pallet type, label position, and transport limit used in the calculation. If any input changes, the old result should be considered unapproved.", "Convert the calculation into a visible specification: carton orientation, units per carton, cartons per layer, number of layers, maximum finished height and weight, and any cap, wrap, strap, or corner protection." ] },
      { heading: "Design checks at the point of work", paragraphs: ["Give operators a simple go/no-go check: count, pattern, overhang, height, weight, label scan, and stability. Show a photograph or clear pattern drawing of a correct load. State what to do when a carton is swollen, damaged, or a product does not fit.", "Assign one role to approve exceptions. Uncontrolled workarounds destroy the assumptions that made the calculation useful."], bullets: ["Use language and units the team uses daily.", "Keep critical limits prominent.", "Place the current revision at the workstation."] },
      { heading: "Verify the standard", paragraphs: ["Observe several real packs, measure the result, and compare damage, time, and transport feedback. Review after a product, supplier, board grade, pallet, vehicle, or carrier change. Retire obsolete instructions so the warehouse has one source of truth." ] },
    ],
    checklist: ["SKU and revision", "Pack and layer pattern", "Height and weight limits", "Stabilisation method", "Exception owner", "Trial and review date"],
  },
  {
    slug: "dimensional-weight-carrier-divisors",
    title: "Dimensional-weight divisors for FedEx, UPS, DHL, and USPS",
    description: "Compare common parcel DIM factors without treating a public rule as a substitute for your service contract.",
    category: "Parcel",
    readTime: "8 min",
    relatedTool: "dimensional-weight-calculator",
    takeaway: "The formula is stable, but divisor, eligibility, measurement rounding, and billing increments depend on carrier, service, account, and destination.",
    sections: [
      { heading: "Start with the carrier and rate type", paragraphs: ["For inches and pounds, FedEx publishes a divisor of 139 for US, Puerto Rico, and international shipments. UPS publishes 139 for Daily Rates and 166 for Retail Rates. USPS examples use 166 when dimensional-weight eligibility applies. DHL Express commonly publishes 5,000 for centimetres and kilograms.", "These are useful presets, not a promise that every shipment is billed that way. Contracted factors, product eligibility, cubic-volume thresholds, international lanes, and special services can change the applicable rule."], bullets: ["Match the unit system to the divisor.", "Record service and rate type beside the result.", "Keep a custom-divisor option for contracted rules."] },
      { heading: "Calculate one parcel before the shipment total", paragraphs: ["Measure the finished outside length, width, and height. Multiply those dimensions and divide by the applicable factor. Compare that result with the actual packed weight, then apply the carrier's rounding rule. For multiple identical parcels, calculate the chargeable weight of one parcel consistently before multiplying by quantity unless the contract specifies shipment-level treatment.", "A 20 × 16 × 12 inch parcel has 3,840 cubic inches. Dividing by 139 gives 27.63 lb; dividing by 166 gives 23.13 lb. A divisor choice can therefore change the planning result before rates or surcharges are applied."] },
      { heading: "Store the evidence used for a quote", paragraphs: ["Keep the carrier source or rate-card revision, the measured dimensions, actual weight, factor, rounding method, and calculation date. When an invoice differs, this record makes it possible to distinguish a measurement correction from a pricing-rule difference."] },
    ],
    checklist: ["Carrier and service", "Rate type", "Finished outside dimensions", "Actual weight", "DIM divisor", "Rounding and eligibility rule"],
    sources: [
      { label: "FedEx dimensional weight guidance", url: "https://www.fedex.com/en-us/shipping/packaging/what-is-dimensional-weight.html" },
      { label: "UPS dimensions and weight guidance", url: "https://developer.ups.com/us/en/support/shipping-support/shipping-dimensions-weight" },
      { label: "DHL weight and dimensions guidance", url: "https://www.dhl.com/discover/en-gb/ship-with-dhl/products-and-services/weight-and-dimensions" },
      { label: "USPS dimensional weight example", url: "https://pe.usps.com/QSG_Archive/NHTML/QSG_Archive_20250119/Q201e.htm" },
    ],
  },
  {
    slug: "dimensional-weight-rounding-examples",
    title: "Dimensional-weight rounding: worked parcel examples",
    description: "See why measuring and rounding at the correct step can change billed weight across a multi-parcel shipment.",
    category: "Parcel",
    readTime: "7 min",
    relatedTool: "dimensional-weight-calculator",
    takeaway: "Apply dimension and weight rounding in the order stated by the carrier; rounding only the final shipment total can understate a per-package charge.",
    sections: [
      { heading: "Separate measurement rounding from weight rounding", paragraphs: ["A carrier may first round each outside dimension, then calculate dimensional weight, then round the resulting chargeable weight to a billing increment. Those are separate operations. A calculator that rounds only the final displayed number may not reproduce the invoice.", "For example, dimensions of 19.6 × 15.6 × 11.6 inches may become 20 × 16 × 12 inches under a whole-inch measurement rule. At a 139 divisor, the rounded-dimension cube produces 27.63 lb before chargeable-weight rounding."] },
      { heading: "Compare per-parcel and shipment rounding", paragraphs: ["If the applicable rule rounds 27.63 lb up to 28 lb per parcel, ten identical parcels produce a 280 lb dimensional basis. Multiplying the unrounded result first produces 276.3 lb, which is not the same billing model.", "Actual weight must go through the same contract check. If each parcel weighs 29 lb, actual weight controls; if each weighs 24 lb, dimensional weight controls in this example."], bullets: ["Do not round intermediate cube without a stated rule.", "Do not combine unlike parcel types.", "Keep quantity outside the per-parcel comparison unless instructed otherwise."] },
      { heading: "Turn discrepancies into a repeatable check", paragraphs: ["When the carrier invoice differs, compare measured dimensions, manifest dimensions, factor, actual weight, and rounding sequence one at a time. Save one confirmed example for each carrier service so future packaging changes can be tested against a known method."] },
    ],
    checklist: ["Measurement rounding", "DIM divisor", "Per-package calculation", "Chargeable increment", "Quantity treatment", "Confirmed invoice example"],
    sources: [
      { label: "UPS dimensions and weight guidance", url: "https://developer.ups.com/us/en/support/shipping-support/shipping-dimensions-weight" },
      { label: "FedEx dimensional weight guidance", url: "https://www.fedex.com/en-us/shipping/packaging/what-is-dimensional-weight.html" },
    ],
  },
  {
    slug: "standard-pallet-sizes-carton-fit",
    title: "Standard pallet sizes and carton-fit examples",
    description: "Compare Euro, industrial, GMA, and half-pallet footprints before fixing a carton or layer pattern.",
    category: "Warehouse",
    readTime: "8 min",
    relatedTool: "pallet-load-calculator",
    takeaway: "Choose the pallet used by the actual lane and customer, then test both carton rotations with finished outside dimensions and no assumed overhang.",
    sections: [
      { heading: "Choose the operational pallet, not the convenient preset", paragraphs: ["Common planning footprints include 1,200 × 800 mm Euro pallets, 1,200 × 1,000 mm industrial pallets, and approximately 48 × 40 inch GMA pallets. A preset saves typing, but the physical pallet, pool specification, customer requirement, and racking system control the approved dimensions.", "Record pallet base height as well as footprint. A transport limit stated as total loaded height includes the pallet, caps, and other stabilisation materials."] },
      { heading: "Test both right-angle carton orientations", paragraphs: ["For a 1,200 × 1,000 mm pallet and a 400 × 300 mm carton, one straight-row orientation fits 3 × 3 cartons while the rotated orientation fits 4 × 2. The better simple pattern is nine cartons per layer, but a mixed pattern or packaging-design tool may find another arrangement.", "Footprint utilisation is a useful signal, not a safety score. A high percentage can still leave an unstable edge, block labels, or conflict with automated handling."], bullets: ["Use finished carton dimensions.", "Prohibit overhang unless explicitly approved.", "Trial the pattern at normal packing speed."] },
      { heading: "Connect the pattern to downstream limits", paragraphs: ["Multiply cartons per layer by complete layers, then cap the result by load weight, finished height, pallet rating, carton compression, and handling constraints. The smallest approved limit becomes the operating quantity."] },
    ],
    checklist: ["Actual pallet specification", "Pallet base height", "Carton outside dimensions", "Both rotations", "Overhang policy", "Warehouse trial"],
    sources: [
      { label: "EPAL Euro pallet specifications", url: "https://www.epal-pallets.org/eu-en/load-carriers/epal-euro-pallet" },
      { label: "ISO 6780 pallet dimensions", url: "https://www.iso.org/standard/30524.html" },
    ],
  },
  {
    slug: "pallet-height-weight-stability-limits",
    title: "Pallet height, weight, and stability limits: what controls the load?",
    description: "Turn a geometric carton count into a usable pallet specification by applying the constraints that geometry leaves out.",
    category: "Warehouse",
    readTime: "8 min",
    relatedTool: "pallet-load-calculator",
    takeaway: "The approved pallet quantity is the lowest limit created by footprint, height, weight, pallet capacity, carton strength, stability, and the transport lane.",
    sections: [
      { heading: "Calculate the height ceiling correctly", paragraphs: ["Subtract pallet base, cap, slip sheets, and required clearance from the maximum total height before dividing by carton height. Round down to full layers. If a customer requires a fixed layer count or label orientation, that operating rule may control before the geometric limit.", "A 165 cm total-height limit, 15 cm pallet base, and 25 cm cartons allow six full layers before other constraints. The finished height is 165 cm, leaving no unrecorded clearance."] },
      { heading: "Apply every weight rating", paragraphs: ["Compare gross carton total with the pallet's rated capacity, rack or floor limits, forklift capacity at the relevant load centre, vehicle payload, and any customer limit. A 1,000 kg planning cap with 12 kg cartons limits the load to 83 cartons even if geometry fits more.", "Use gross packed carton weight and include stabilisation materials when the margin is small."], bullets: ["Do not use pallet capacity as a carton-compression rating.", "Check dynamic and racking conditions separately.", "Record the limiting constraint on the load sheet."] },
      { heading: "Approve stability with a physical standard", paragraphs: ["Column stacking, interlocking, stretch wrap, straps, corner boards, coefficient of friction, load-centre position, and route vibration affect stability. A calculator can expose the proposed pattern and totals, but a competent trial and documented acceptance criteria must approve the load."] },
    ],
    checklist: ["Total-height definition", "Cargo and pallet weight", "Pallet rating", "Carton compression", "Stabilisation method", "Transport and customer limits"],
    sources: [{ label: "EPAL Euro pallet specifications", url: "https://www.epal-pallets.org/eu-en/load-carriers/epal-euro-pallet" }],
  },
  {
    slug: "calculate-lcl-wm-multiple-cartons",
    title: "How to calculate LCL W/M for multiple cartons, crates, and pallets",
    description: "Build cargo lines, total CBM and gross weight once, and apply weight or measure without double-counting quantity.",
    category: "Ocean freight",
    readTime: "8 min",
    relatedTool: "lcl-chargeable-volume-calculator",
    takeaway: "Calculate each handling-unit type separately, add total CBM and total gross kilograms, then compare shipment CBM with metric tonnes under the quoted W/M rule.",
    sections: [
      { heading: "Create one line per handling-unit type", paragraphs: ["For each carton, crate, or pallet type, record finished outside length, width, height, quantity, and gross weight per piece. Convert centimetres to metres or divide cubic centimetres by 1,000,000, then multiply volume and weight by quantity.", "Do not add carton cube and palletised cube for the same cargo. Once freight is tendered on pallets, use the palletised outside envelope when that is what the consolidator must handle."] },
      { heading: "Compare the shipment totals", paragraphs: ["Suppose ten 100 × 80 × 80 cm crates weigh 420 kg each. Total volume is 6.4 CBM and total gross weight is 4,200 kg, or 4.2 metric tonnes. Under a common 1 CBM to 1,000 kg W/M comparison, 6.4 is the larger number, so volume is the base charging measure.", "Add unlike lines before making the shipment-level comparison unless the tariff explicitly prices them separately."], bullets: ["Keep all dimensions in one unit.", "Use gross, not net, weight.", "Round according to the quote after totals are built."] },
      { heading: "Reconcile a warehouse remeasurement", paragraphs: ["Keep the line calculation with photographs or packing records. If the consolidator changes CBM or gross weight, request the measurement sheet and compare the affected line rather than disputing only the invoice total."] },
    ],
    checklist: ["Handling-unit types", "Finished dimensions", "Quantity", "Gross weight per piece", "Total CBM", "Total metric tonnes"],
    sources: [
      { label: "Maersk LCL weight and measure terms", url: "https://terms.maersk.com/LCL" },
      { label: "Maersk LCL CBM support", url: "https://www.maersk.com/fr-fr/support/faqs/how-can-calculate-my-lcl-cbm-volumes" },
    ],
  },
  {
    slug: "lcl-minimum-charges-local-fees",
    title: "LCL minimum charges and local fees: build an all-in estimate",
    description: "Separate W/M charges from shipment-level fees so a small LCL quote does not look cheaper than its invoice.",
    category: "Ocean freight",
    readTime: "8 min",
    relatedTool: "lcl-chargeable-volume-calculator",
    takeaway: "Apply the quoted minimum to the chargeable W/M quantity, then separate every per-W/M, per-shipment, document, origin, and destination charge.",
    sections: [
      { heading: "Apply the minimum to the right quantity", paragraphs: ["First calculate raw W/M as the larger of shipment CBM and gross metric tonnes under the quote's rule. Then compare that result with the minimum chargeable units. A 0.55 CBM, 180 kg shipment with a one-W/M minimum is charged on one unit for the affected rate item, not 0.55.", "Minimums can apply separately to ocean freight, CFS handling, pickup, or another tariff line. Do not assume one minimum automatically controls the entire invoice."] },
      { heading: "Classify every fee by its unit", paragraphs: ["Mark each quote line as per W/M, per CBM, per metric tonne, per shipment, per bill of lading, per document, or actual cost. Origin handling, export documentation, destination CFS, delivery order, customs services, security, fuel, and inland transport may use different units and currencies.", "Convert currency with one visible rate and state whether taxes are included. Keep destination charges visible because they often dominate a small shipment."], bullets: ["Align Incoterm and endpoints across quotes.", "Record rate validity and free time.", "Keep excluded customs and delivery costs beside the total."] },
      { heading: "Use the estimate to ask better questions", paragraphs: ["A transparent breakdown shows exactly which assumptions need confirmation: W/M factor, minimum, remeasurement policy, stackability, non-stackable multiplier, included local fees, currency, tax, and storage exposure. The calculator is valuable because it turns a low headline rate into a reproducible question list."] },
    ],
    checklist: ["Raw W/M", "Minimum by fee line", "Per-W/M charges", "Fixed shipment fees", "Origin and destination scope", "Currency, tax, and validity"],
    sources: [
      { label: "Maersk LCL weight and measure terms", url: "https://terms.maersk.com/LCL" },
      { label: "Maersk LCL local tariff example", url: "https://www.maersk.com/~/media_sc9/maersk/local-information/files/asia-pacific/korea/overview-useful-links/lcl-kr-local-tariff-for-export-import-updated-09-10-2024.pdf" },
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}

export function getGuidesForTool(toolSlug: string) {
  return guides.filter((guide) => guide.relatedTool === toolSlug);
}
