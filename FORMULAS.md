# Formulas and assumptions

## Dimensional weight

```text
dimensional weight = length × width × height ÷ divisor
chargeable weight = max(dimensional weight, actual weight)
```

FreightKit applies the selected chargeable-weight increment per parcel before multiplying identical-parcel quantity. Public carrier rules are presets only; confirm service eligibility, measurement rounding, divisor, and billing increments on the current rate card.

Common published planning references include:

- [FedEx dimensional weight guidance](https://www.fedex.com/en-us/shipping/packaging/what-is-dimensional-weight.html)
- [UPS dimensional weight and rate-type divisors](https://developer.ups.com/us/en/support/shipping-support/shipping-dimensions-weight)
- [DHL volumetric weight guidance](https://www.dhl.com/discover/en-gb/ship-with-dhl/products-and-services/weight-and-dimensions)
- [USPS dimensional weight example](https://pe.usps.com/QSG_Archive/NHTML/QSG_Archive_20250119/Q201e.htm)

## Pallet load

```text
cartons per layer = max(
  floor(pallet length ÷ carton length) × floor(pallet width ÷ carton width),
  floor(pallet length ÷ carton width) × floor(pallet width ÷ carton length)
)

layers = floor((maximum total height − pallet base height) ÷ carton height)

total cartons = min(
  cartons per layer × layers,
  floor(maximum load weight ÷ carton gross weight)
)
```

The result assumes identical rectangular cartons, straight rows, no overhang, and no mixed pattern. It does not approve pallet capacity, carton compression, stability, racking, vehicle loading, or occupational safety.

References:

- [EPAL Euro pallet specifications](https://www.epal-pallets.org/eu-en/load-carriers/epal-euro-pallet)
- [ISO 6780 pallet dimensions](https://www.iso.org/standard/30524.html)

## Ocean LCL weight or measure

```text
total CBM = sum(length cm × width cm × height cm × pieces ÷ 1,000,000)
metric tonnes = total gross kg ÷ 1,000
raw W/M = max(total CBM, metric tonnes)
chargeable W/M = max(raw W/M, quoted minimum W/M)
```

The quote estimate multiplies chargeable W/M by per-W/M rates and then adds fixed charges. A tariff may apply different minimums, rounding, units, currencies, multipliers, and local-charge rules to individual lines.

References:

- [Maersk LCL weight and measure terms](https://terms.maersk.com/LCL)
- [Maersk shipping glossary — W/M](https://www.maersk.com/de-de/support/glossaries/shipping-terms)
