import { expect, it, describe } from 'vitest'
import { checkFor2Digits } from '@/utils/functions/transaction/checkFor2Digits'

describe('checkFor2Digits', function () {
  it('should return true if the passed number has two digits', () => {
    // Arrange
    const numberToCheck = 50.52
    const result = true

    // Act & Assert
    expect(checkFor2Digits(numberToCheck)).toBe(result)
  })

  it('should return false if the passed number has more than two digits', () => {
    // Arrange
    const numberToCheck = 50.525
    const result = false

    // Act & Assert
    expect(checkFor2Digits(numberToCheck)).toBe(result)
  })
})
