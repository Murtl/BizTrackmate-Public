import { describe, it, expect } from 'vitest'
import { getTotalQuantity } from '@/utils/functions/dashboard/getTotalQuantity'
import { getDummySortedTransactions } from '@/__tests__/test-utils/getDummyData'
import dynamicText from '@/text/dynamicText.json'

describe('getTotalQuantity', () => {
  it('should return the amount of sold foods for a selected month and year', () => {
    //Arrange
    const sortedTransactions = getDummySortedTransactions()
    const result = 10

    //Act & Assert
    expect(
      getTotalQuantity(sortedTransactions, 2023, dynamicText.february, dynamicText.food, false)
    ).toEqual(result)
  })

  it('should return the amount of sold non-foods for a selected month and year', () => {
    //Arrange
    const sortedTransactions = getDummySortedTransactions()
    const result = 10

    //Act & Assert
    expect(
      getTotalQuantity(sortedTransactions, 2023, dynamicText.november, dynamicText.non_food, false)
    ).toEqual(result)
  })
})
