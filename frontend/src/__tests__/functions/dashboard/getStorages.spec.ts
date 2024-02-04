import { describe, expect, it } from 'vitest'
import { getDummySortedTransactions } from '@/__tests__/test-utils/getDummyData'
import dynamicText from '@/text/dynamicText.json'
import { getStorages } from '@/utils/functions/dashboard/getStorages'

describe('getStorages', () => {
  it('should return the quantity of income_storages for a month and year', () => {
    //Arrange
    const sortedTransactions = getDummySortedTransactions()
    const result = 1

    //Act & Assert
    expect(
      getStorages(sortedTransactions, 2023, dynamicText.february, dynamicText.income_storage, false)
    ).toEqual(result)
  })

  it('should return the quantity of outcome_storages for a month and year', () => {
    //Arrange
    const sortedTransactions = getDummySortedTransactions()
    const result = 1

    //Act & Assert
    expect(
      getStorages(sortedTransactions, 2023, dynamicText.may, dynamicText.outcome_storage, false)
    ).toEqual(result)
  })
})
