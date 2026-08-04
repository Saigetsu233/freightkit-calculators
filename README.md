# FreightKit Calculators

Transparent JavaScript formulas and free embeds for three practical shipping calculations:

- dimensional and chargeable parcel weight;
- straight-row pallet capacity;
- ocean LCL weight-or-measure (W/M) and quote breakdown.

The live tools include visible assumptions, worked guides, and copyable results at [shipmathlab.com](https://shipmathlab.com/).

## Use the formulas

The package has no runtime dependencies and uses standard ES modules.

```js
import { calculateDimensionalWeight } from "./src/index.js";

const result = calculateDimensionalWeight({
  length: 20,
  width: 16,
  height: 12,
  actualWeight: 24,
  divisor: 139,
  quantity: 10,
  roundingIncrement: 1,
});

console.log(result.totalChargeableWeight); // 280
```

See [FORMULAS.md](FORMULAS.md) for equations, assumptions, worked examples, and primary references.

## Embed a calculator

No JavaScript integration or account is required. Paste an iframe into an article, portal, or internal knowledge base.

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

Available embed paths:

- `https://shipmathlab.com/embed/dimensional-weight-calculator`
- `https://shipmathlab.com/embed/pallet-load-calculator`
- `https://shipmathlab.com/embed/lcl-chargeable-volume-calculator`

An all-in-one example is in [examples/embed.html](examples/embed.html).

## Test

```bash
npm test
```

## Scope and safety

These functions are planning aids. Carrier contracts, tariffs, pallet ratings, packaging performance, local regulations, measurement practices, and handling constraints control real shipments. Verify critical figures with the responsible carrier, supplier, engineer, or safety owner.

## License

[MIT](LICENSE)
