# FreightKit

FreightKit is a responsive English-language calculator site for packaging,
ecommerce, warehouse, inventory, and freight teams. It includes twenty interactive tools:

- dimensional weight
- CBM and shipment volume
- carton fit
- pallet load
- container loading
- package length plus girth
- shipping unit conversion
- corrugated box material cost
- shipping cost estimation
- ecommerce contribution margin
- freight density
- air-freight chargeable weight
- LCL weight-or-measure charges
- road-freight load metres
- import landed cost
- inventory reorder point
- economic order quantity
- warehouse storage cost
- pallet stack height
- packaging waste and yield

Every tool calculates locally in the browser, shows its method and assumptions,
and produces a copyable result summary. The site also includes sixteen original
working guides, a resources and workbook sales page, configurable checkout and
affiliate URLs, per-page metadata, a sitemap, robots rules, trust pages, responsive
layouts, and a purpose-built social sharing card.

Commercial links are configured through the variables documented in `.env.example`.
No payment, analytics, advertising, or affiliate provider is active in the private
review build.

## Local development

Requires Node.js 22.13 or later.

```bash
npm install
npm run dev
```

## Validation

```bash
npm test
npx tsc --noEmit
```

The calculators are planning aids. Critical figures should be checked against
current supplier, equipment, and carrier documentation before use.
