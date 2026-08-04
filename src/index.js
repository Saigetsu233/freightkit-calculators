/**
 * Round a non-negative number up to a billing increment.
 * An increment of 0 leaves the value unchanged.
 */
export function roundUp(value, increment = 0) {
  assertNonNegative("value", value);
  assertNonNegative("increment", increment);
  return increment > 0 ? Math.ceil((value - Number.EPSILON) / increment) * increment : value;
}

/**
 * Compare dimensional and actual parcel weight, then apply per-parcel rounding.
 */
export function calculateDimensionalWeight({
  length,
  width,
  height,
  actualWeight,
  divisor,
  quantity = 1,
  roundingIncrement = 0,
}) {
  for (const [name, value] of Object.entries({ length, width, height, actualWeight, quantity, roundingIncrement })) {
    assertNonNegative(name, value);
  }
  assertPositive("divisor", divisor);

  const volume = length * width * height;
  const dimensionalPerParcel = volume / divisor;
  const rawChargeablePerParcel = Math.max(dimensionalPerParcel, actualWeight);
  const chargeablePerParcel = roundUp(rawChargeablePerParcel, roundingIncrement);

  return {
    volume,
    dimensionalPerParcel,
    actualPerParcel: actualWeight,
    rawChargeablePerParcel,
    chargeablePerParcel,
    totalChargeableWeight: chargeablePerParcel * quantity,
    quantity,
    basis: dimensionalPerParcel > actualWeight ? "dimensional" : "actual",
  };
}

/**
 * Calculate a straight-row pallet plan using two 90-degree carton orientations.
 */
export function calculatePalletLoad({
  palletLength,
  palletWidth,
  palletBaseHeight,
  maximumTotalHeight,
  maximumLoadWeight,
  cartonLength,
  cartonWidth,
  cartonHeight,
  cartonWeight,
}) {
  const inputs = { palletLength, palletWidth, palletBaseHeight, maximumTotalHeight, maximumLoadWeight, cartonLength, cartonWidth, cartonHeight, cartonWeight };
  for (const [name, value] of Object.entries(inputs)) assertNonNegative(name, value);
  for (const name of ["palletLength", "palletWidth", "cartonLength", "cartonWidth", "cartonHeight", "cartonWeight"]) assertPositive(name, inputs[name]);

  const orientations = [
    { cartonLength, cartonWidth },
    { cartonLength: cartonWidth, cartonWidth: cartonLength },
  ].map((orientation) => ({
    ...orientation,
    across: Math.floor(palletLength / orientation.cartonLength),
    deep: Math.floor(palletWidth / orientation.cartonWidth),
  })).map((orientation) => ({ ...orientation, cartonsPerLayer: orientation.across * orientation.deep }));

  const pattern = orientations.sort((a, b) => b.cartonsPerLayer - a.cartonsPerLayer)[0];
  const usableCargoHeight = Math.max(maximumTotalHeight - palletBaseHeight, 0);
  const maximumLayers = Math.floor(usableCargoHeight / cartonHeight);
  const capacityBySpace = pattern.cartonsPerLayer * maximumLayers;
  const capacityByWeight = Math.floor(maximumLoadWeight / cartonWeight);
  const totalCartons = Math.min(capacityBySpace, capacityByWeight);
  const layersUsed = pattern.cartonsPerLayer ? Math.ceil(totalCartons / pattern.cartonsPerLayer) : 0;

  return {
    pattern,
    maximumLayers,
    layersUsed,
    capacityBySpace,
    capacityByWeight,
    totalCartons,
    finishedHeight: palletBaseHeight + layersUsed * cartonHeight,
    cargoWeight: totalCartons * cartonWeight,
    footprintUtilisation: pattern.cartonsPerLayer * cartonLength * cartonWidth / (palletLength * palletWidth),
    limitingFactor: capacityByWeight < capacityBySpace ? "weight" : "height-or-footprint",
  };
}

/**
 * Calculate shipment CBM, metric tonnes, chargeable W/M, and an all-in estimate.
 * Cargo line dimensions are centimetres and weightEachKg is gross weight per piece.
 */
export function calculateLclWeightMeasure({
  cargoLines,
  minimumWm = 0,
  oceanRatePerWm = 0,
  otherRatePerWm = 0,
  fixedCharges = [],
}) {
  if (!Array.isArray(cargoLines) || cargoLines.length === 0) throw new TypeError("cargoLines must contain at least one line");
  for (const [name, value] of Object.entries({ minimumWm, oceanRatePerWm, otherRatePerWm })) assertNonNegative(name, value);
  fixedCharges.forEach((value, index) => assertNonNegative(`fixedCharges[${index}]`, value));

  const totals = cargoLines.reduce((result, line, index) => {
    for (const [name, value] of Object.entries(line)) assertNonNegative(`cargoLines[${index}].${name}`, value);
    result.cbm += line.lengthCm * line.widthCm * line.heightCm * line.quantity / 1_000_000;
    result.grossKg += line.weightEachKg * line.quantity;
    result.pieces += line.quantity;
    return result;
  }, { cbm: 0, grossKg: 0, pieces: 0 });

  const metricTonnes = totals.grossKg / 1000;
  const rawWm = Math.max(totals.cbm, metricTonnes);
  const chargeableWm = Math.max(rawWm, minimumWm);
  const oceanCharge = chargeableWm * oceanRatePerWm;
  const otherVariableCharges = chargeableWm * otherRatePerWm;
  const totalFixedCharges = fixedCharges.reduce((sum, value) => sum + value, 0);

  return {
    ...totals,
    metricTonnes,
    rawWm,
    chargeableWm,
    basis: minimumWm > rawWm ? "minimum" : totals.cbm >= metricTonnes ? "volume" : "weight",
    oceanCharge,
    otherVariableCharges,
    totalFixedCharges,
    totalCharge: oceanCharge + otherVariableCharges + totalFixedCharges,
  };
}

function assertNonNegative(name, value) {
  if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} must be a non-negative finite number`);
}

function assertPositive(name, value) {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${name} must be a positive finite number`);
}
