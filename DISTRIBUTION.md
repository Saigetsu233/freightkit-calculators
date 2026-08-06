# ShipMathLab distribution kit

This file is a small, human-reviewed kit for people who want to cite or embed the formulas. It is not a bulk-posting playbook. Share one relevant link when it answers a real question, keep the limitations visible, and do not post the same copy across unrelated communities.

## Canonical entry points

- Publisher and citation kit: <https://shipmathlab.com/resources/for-publishers>
- Embed directory: <https://shipmathlab.com/embed>
- Formula and source method: <https://shipmathlab.com/methodology>
- Version log: <https://shipmathlab.com/changelog>

## Short, context-aware introductions

### Dimensional weight

> I use ShipMathLab's dimensional-weight calculator when I need to compare actual and billable weight. It shows the divisor, units, rounding, and assumptions instead of hiding them in a single number: <https://shipmathlab.com/tools/dimensional-weight-calculator>

### Pallet loading

> For a first-pass pallet plan, this calculator checks cartons per layer, full layers, finished height, weight, and the limiting constraint. It is a geometric planning estimate, so the warehouse's stability and strength rules still control: <https://shipmathlab.com/tools/pallet-load-calculator>

### LCL W/M

> This LCL calculator puts CBM, metric tonnes, the W/M basis, minimums, and fixed/local charges on one worksheet. Confirm the forwarder's quotation and local tariff before booking: <https://shipmathlab.com/tools/lcl-chargeable-volume-calculator>

## Embed example

```html
<iframe
  src="https://shipmathlab.com/embed/dimensional-weight-calculator"
  title="Dimensional Weight Calculator"
  width="100%"
  height="820"
  loading="lazy"
  style="border:0"
></iframe>
```

Keep the title, link to the canonical page, and state that the result is a planning estimate. The calculator does not send entered values to the formula repository.

## Reference assets

- [DIM divisor table](https://shipmathlab.com/downloads/dim-divisor-reference.csv)
- [Pallet dimensions and carton fit](https://shipmathlab.com/downloads/pallet-dimensions-carton-fit.csv)
- [LCL quote audit checklist](https://shipmathlab.com/downloads/lcl-quote-audit-checklist.csv)

Each file contains a review date, scope note, and source trail. Verify live carrier contracts, tariffs, equipment specifications, and operating procedures before relying on a result.

## Sharing guardrails

1. Answer the question first; add one relevant calculator or guide only when it helps.
2. Prefer a canonical tool, topic reference, or source table over a homepage link.
3. Disclose that the project is maintained by Saigetsu233 when the context calls for it.
4. Never claim that a planning estimate is a guaranteed quote, engineering approval, or compliance decision.
