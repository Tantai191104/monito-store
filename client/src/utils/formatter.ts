/**
 * Formats a number or a numeric string into a Vietnamese currency format (e.g., "1.000.000").
 * @param value The number or string to format.
 * @returns The formatted string, or an empty string if the input is invalid.
 */
export const formatPrice = (value: string | number): string => {
  if (value === null || value === undefined) return '';
  const stringValue = String(value).replace(/[^0-9]/g, '');
  if (stringValue === '') return '';
  const numberValue = parseInt(stringValue, 10);
  return isNaN(numberValue) ? '' : numberValue.toLocaleString('vi-VN');
};

/**
 * Parses a formatted price string (e.g., "1.000.000") into a raw numeric string ("1000000").
 * @param value The formatted string to parse.
 * @returns The raw numeric string.
 */
export const parsePrice = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};
