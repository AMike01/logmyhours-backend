/**
 * check if value !== undefined && !== null
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return (value as T) !== undefined && (value as T) !== null;
}

/**
 * check if value !== undefined && !== null && !== ''
 */
export function isStringDefined(value: string | null | undefined): value is string {
  return isDefined(value) && value !== '';
}

/**
 * Checks if an array is not empty.
 * @param value the array to validate.
 */
export function isArrayNotEmpty<T>(value: T[] | null | undefined): boolean {
  return isDefined(value) && Array.isArray(value) && value.length > 0 ? true : false;
}

/**
 * Asserts an array is not empty.
 * @param value the array to validate.
 * @param error the custom error message to throw.
 */
export function assertIsArrayNotEmpty<T>(value: T[] | undefined, error?: Error | string): asserts value is T[] {
  if (!isArrayNotEmpty(value)) {
    if (!isDefined(error)) {
      throw new Error('Array value is empty');
    }

    if (typeof error === 'string') {
      throw new Error(error);
    }

    throw error;
  }
}

/**
 * Assert a string is defined and not empty
 */
export function assertIsStringDefined(value: string | undefined, error?: Error | string): asserts value is string {
  if (!isStringDefined(value)) {
    if (!isDefined(error)) {
      throw new Error('String value is not defined');
    }

    if (typeof error === 'string') {
      throw new Error(error);
    }

    throw error;
  }
}

/**
 * Assert a value is defined
 */
export function assertIsDefined<T>(value: T | undefined, error?: Error | string): asserts value is T {
  if (!isDefined(value)) {
    if (!isDefined(error)) {
      throw new Error('Value is not defined');
    }

    if (typeof error === 'string') {
      throw new Error(error);
    }

    throw error;
  }
}

/**
 *
 * @param arr Array on which to perform operation
 * @returns Input array with removed duplicates
 */
export const unique = <T>(arr: T[]): T[] => arr.filter(function (elem, index, self) {
  return index === self.indexOf(elem);
});
