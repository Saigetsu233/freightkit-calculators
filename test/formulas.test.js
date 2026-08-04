import assert from "node:assert/strict";
import test from "node:test";
import { calculateDimensionalWeight, calculateLclWeightMeasure, calculatePalletLoad, roundUp } from "../src/index.js";

test("roundUp applies a selected billing increment", () => {
  assert.equal(roundUp(12.01, .5), 12.5);
  assert.equal(roundUp(12, 1), 12);
  assert.equal(roundUp(12.345, 0), 12.345);
});

test("dimensional weight compares and rounds each parcel", () => {
  const result = calculateDimensionalWeight({ length: 20, width: 16, height: 12, actualWeight: 24, divisor: 139, quantity: 10, roundingIncrement: 1 });
  assert.equal(result.volume, 3840);
  assert.equal(result.basis, "dimensional");
  assert.equal(result.chargeablePerParcel, 28);
  assert.equal(result.totalChargeableWeight, 280);
});

test("pallet load is capped by geometry and weight", () => {
  const result = calculatePalletLoad({ palletLength: 120, palletWidth: 100, palletBaseHeight: 15, maximumTotalHeight: 165, maximumLoadWeight: 1000, cartonLength: 40, cartonWidth: 30, cartonHeight: 25, cartonWeight: 12 });
  assert.equal(result.pattern.cartonsPerLayer, 9);
  assert.equal(result.maximumLayers, 6);
  assert.equal(result.totalCartons, 54);
  assert.equal(result.finishedHeight, 165);
});

test("LCL W/M totals multiple cargo lines and quote charges", () => {
  const result = calculateLclWeightMeasure({
    cargoLines: [
      { lengthCm: 100, widthCm: 80, heightCm: 80, quantity: 10, weightEachKg: 420 },
      { lengthCm: 100, widthCm: 100, heightCm: 100, quantity: 1, weightEachKg: 100 },
    ],
    minimumWm: 1,
    oceanRatePerWm: 58,
    fixedCharges: [145, 260, 65],
  });
  assert.equal(result.cbm, 7.4);
  assert.equal(result.grossKg, 4300);
  assert.equal(result.basis, "volume");
  assert.equal(result.chargeableWm, 7.4);
  assert.equal(result.totalCharge, 899.2);
});
