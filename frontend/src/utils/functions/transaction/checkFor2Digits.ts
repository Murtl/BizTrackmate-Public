/**
 * @description Checks if the value has 2 digits after the decimal point
 * @param value The value to check
 * @returns true if the value has 2 digits after the decimal point, false otherwise
 */
export const checkFor2Digits = (value: number) => {
  if (value.toString().includes('.')) {
    return value.toString().split('.')[1].length <= 2
  }
  return true
}
