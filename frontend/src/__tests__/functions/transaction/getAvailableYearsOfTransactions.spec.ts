import { describe, it, expect } from 'vitest'
import { getDummyTransactions } from '@/__tests__/test-utils/getDummyData'
import { getAvailableYearsOfTransactions } from '@/utils/functions/transaction/getAvailableYearsOfTransactions'

describe('getAvailableYearsOfTransactions', () => {
  it('should return a list of available years', function () {
    //Arrange
    const transactionsList = getDummyTransactions()
    const result = [2023, 2022]

    //Act & Assert
    expect(getAvailableYearsOfTransactions(transactionsList)).toEqual(result)
  })
})
