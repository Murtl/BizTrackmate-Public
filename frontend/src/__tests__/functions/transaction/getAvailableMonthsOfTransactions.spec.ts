import { describe, it, expect } from 'vitest'
import { getDummyTransactions } from '@/__tests__/test-utils/getDummyData'
import { getAvailableMonthsOfTransactions } from '@/utils/functions/transaction/getAvailableMonthsOfTransactions'

describe('getAvailableMonthsOfTransactions', () => {
  it('should return a list of available months of transactions', () => {
    //Arrange
    const transactionsList = getDummyTransactions()
    const availableYears = [2022, 2023]
    const result = [
      {
        year: 2022,
        month: 10
      },
      {
        year: 2022,
        month: 11
      },
      {
        year: 2023,
        month: 2
      },
      {
        year: 2023,
        month: 6
      },
      {
        year: 2023,
        month: 5
      },
      {
        year: 2023,
        month: 11
      }
    ]
    //Act & Assert
    expect(getAvailableMonthsOfTransactions(availableYears, transactionsList)).toEqual(result)
  })
})
