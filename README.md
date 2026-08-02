# FreightKit

FreightKit is a responsive English-language calculator site for packaging,
ecommerce, warehouse, and freight teams. It includes ten interactive tools:

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

Every tool calculates locally in the browser, shows its method and assumptions,
and produces a copyable result summary. The site also includes per-tool metadata,
a sitemap, robots rules, an about page, a privacy page, responsive layouts, and a
purpose-built social sharing card.

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
