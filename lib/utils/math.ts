// Some quick js math bitwise implementations

/**
 * Custom implementation of `Math.floor`,
 * Restricted to 32 bit integers
 * @param {Number} number number to floor;
 * @returns {Number} floored number
 */
export function floor(number: number) {
  return ~~number;
}

/**
 * Custom implementation of `Math.ceil`,
 * Restricted to 32 bit integers
 * @param {Number} number number to ceil;
 * @returns {Number} ceiled number
 */
export function ceil(number: number) {
  return ~~number + 1;
}

/**
 * Custom implementation of `Math.round`
 * Restricted to 32 bit integers
 * @param {Number} number number to round;
 * @returns {Number} rounded number
 */
export function round(number: number) {
  return (number + 0.5) << 0;
}

/**
 * Quick check for int numbers
 * Restricted to 32 bit integers
 * @param {Number} number number to round;
 * @returns {Number} rounded number
 */
export function isInt(number: number): boolean {
  return floor(number) === number;
}

// src: https://github.com/ShadowfaxRodeo/dither-me-this/blob/main/src/functions/utilities.js
export function random(min = 0, max = 0): number {
  return Math.abs(floor(Math.random() * (max - min + 1)) + min);
}

export function range(min: number, max?: number, step?: number): number[] {
  const numberRange: number[] = [];
  for (let i = max === undefined ? 0 : min; i < (max ?? min); i += step ?? 1) {
    numberRange[i] = i;
  }
  return numberRange;
}

// Recursive gcd
export function greatestCommonDenominator(a: number, b: number): number {
  return b ? greatestCommonDenominator(b, a % b) : a;
}
// Recursive lcm
export function leastCommonMultiple(a: number, b: number): number {
  return (a * b) / greatestCommonDenominator(a, b);
}

// p5 based helpers (https://p5js.org/)
/**
 * Constrains a value between a minimum and maximum value.
 * @param {Number} value Constrained value
 * @param {Number} min lower limit
 * @param {Number} max upper limit
 */
export function constrain(value: number, min: number, max: number) {
  return value > max ? max : value < min ? min : value;
}

export function map(
  value: number,
  rangeStart: number,
  rangeStop: number,
  targetStart: number,
  targetStop: number,
  shouldConstrain = false
) {
  const mapped =
    ((value - rangeStart) / (rangeStop - rangeStart)) *
      (targetStop - targetStart) +
    targetStart;

  if (shouldConstrain) {
    return targetStart < targetStop
      ? constrain(mapped, targetStart, targetStop)
      : constrain(mapped, targetStop, targetStart);
  }

  return mapped;
}
