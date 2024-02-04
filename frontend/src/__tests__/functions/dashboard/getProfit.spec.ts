import { describe, expect, it } from 'vitest'
import { getDummySortedTransactions } from '@/__tests__/test-utils/getDummyData'
import dynamicText from '@/text/dynamicText.json'
import { getProfit } from '@/utils/functions/dashboard/getProfit'

describe('getProfit', () => {
  it('should return the profit for a selected month and year', () => {
    //Arrange
    const sortedTransactions = getDummySortedTransactions()
    const result = 80

    //Act & Assert
    expect(getProfit(sortedTransactions, 2023, dynamicText.february, false)).toEqual(result)
  })
})
