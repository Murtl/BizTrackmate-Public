import { describe, it, expect } from 'vitest'
import { getDummyTransactions } from '@/__tests__/test-utils/getDummyData'
import { calculateTotalAmountOfTransaction } from '@/utils/functions/transaction/calculateTotalAmountOfTransaction'

describe('calculateTotalAmountOfTransaction', () => {
  it('should calculate the total amount of a transaction', () => {
    // Arrange
    const transaction = getDummyTransactions()[0]
    const result = 20

    // Act & Assert
    expect(calculateTotalAmountOfTransaction(transaction)).toBe(result)
  })
})
