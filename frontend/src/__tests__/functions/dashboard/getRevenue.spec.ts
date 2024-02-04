import { describe, expect, it } from 'vitest'
import { getDummySortedTransactions } from '@/__tests__/test-utils/getDummyData'
import dynamicText from '@/text/dynamicText.json'
import { getRevenue } from '@/utils/functions/dashboard/getRevenue'

describe('getRevenue', () => {
  it('should return the revenue of food for a month and year', function () {
    //Arrange
    const sortedTransactions = getDummySortedTransactions()
    const result = 10

    //Act & Assert
    expect(
      getRevenue(sortedTransactions, 2023, dynamicText.february, dynamicText.food, false)
    ).toEqual(result)
  })

  it('should return the revenue of non-food for a month and year', function () {
    //Arrange
    const sortedTransactions = getDummySortedTransactions()
    const result = 10

    //Act & Assert
    expect(
      getRevenue(sortedTransactions, 2023, dynamicText.november, dynamicText.non_food, false)
    ).toEqual(result)
  })
})
