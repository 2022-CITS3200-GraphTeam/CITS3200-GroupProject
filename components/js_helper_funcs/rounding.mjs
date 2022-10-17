import { Decimal } from "https://cdn.jsdelivr.net/gh/MikeMcl/decimal.js@v10.4.2/decimal.min.mjs";

/**
 * Rounds `value` to the nearest multiple of `increment` (offset by `min`), within `min` and `max`.
 * `min` and `max` should always be valid values; returns those, if out of bounds.
 * 
 * @param {number} value 
 * @param {number} increment 
 * @param {number} min 
 * @param {number} max 
 * @returns {number} 
 */
export function roundToWithin(value, increment, min, max) {
  value = new Decimal(value);

  // the closest multiple of `increment` to `value`, not necessarily within `min` and `max`
  let rounded = value.div(increment).round().mul(increment).toNumber();

  if (rounded > max) return max;
  if (rounded < min) return min;

  return rounded;
}
