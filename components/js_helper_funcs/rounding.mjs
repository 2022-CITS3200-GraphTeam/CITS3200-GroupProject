import { Decimal } from "https://cdn.jsdelivr.net/gh/MikeMcl/decimal.js@v10.4.2/decimal.min.mjs";

/**
 * Rounds `value` to the nearest multiple of `increment` (offset by `min`), within `min` and `max`.
 * `min` should always be a valid value; returns that if no other value meets these constraints.
 * 
 * @param {number} value 
 * @param {number} increment 
 * @param {number} min 
 * @param {number} max 
 * @returns {number} 
 */
export function roundToWithin(value, increment, min, max) {
  // TODO simplify logic

  let decimalPlaces = new Decimal(increment).dp();
  let currentDistance = value;
  let difference = increment - 1;
  min = new Decimal(min);

  for (let i = min; i < max; i++) {
    if (i != min) i = parseFloat(i) + difference;

    let previousDistance = currentDistance;
    currentDistance = value - i;
    if (currentDistance < 0) {
      if ((-1 * currentDistance) < previousDistance) {
        value = new Decimal(i);
        value = value.toDecimalPlaces(decimalPlaces);
        return value;
      } else {
        value = new Decimal(i - increment);
        value = value.toDecimalPlaces(decimalPlaces);
        return value;
      }

    }
  }

  return min;
}
