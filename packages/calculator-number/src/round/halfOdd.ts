import { isEven, isHalf } from '../utils';

import type { RoundingMode } from '@dinero.js/core';

/**
 * Round a number with half values to nearest odd integer.
 *
 * @param value - The number to round.
 *
 * @returns The rounded number.
 */
export const halfOdd: RoundingMode = (value) => {
  const rounded = Math.round(value);

  if (!isHalf(value)) {
    return rounded;
  }

  return isEven(rounded) ? rounded - 1 : rounded;
};