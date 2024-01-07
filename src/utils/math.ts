/**
 * Rounds a number to a specified precision.
 * @param value - The number to round.
 * @param precision - The number of decimal places to round to. Default is 6.
 * @returns The rounded number.
 */
export function round(value: number, precision: number = 6) {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}