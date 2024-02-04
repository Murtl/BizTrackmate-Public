import { describe, it, expect } from 'vitest'
import { getDummyArticles, getDummySortedTransactions } from '@/__tests__/test-utils/getDummyData'
import { filterTransactions } from '@/utils/functions/transaction/filterTransactions'
import dynamicText from '@/text/dynamicText.json'
import type { BTMSortedTransactions } from '@/utils/types/btmSortedTransaction'

describe('filterTransactions', () => {
  it('should filter transactions after month ', () => {
    //Arrange
    const transactionsList = getDummySortedTransactions()
    const filterArray = [dynamicText.february.toLowerCase()]
    const result = [getDummySortedTransactions()[2]]

    //Act & Assert
    expect(filterTransactions(transactionsList, filterArray)).toEqual(result)
  })

  it('should filter transactions after year', () => {
    //Arrange
    const transactionsList = getDummySortedTransactions()
    const filterArray = ['2022']
    const result = [getDummySortedTransactions()[0], getDummySortedTransactions()[1]]

    //Act & Assert
    expect(filterTransactions(transactionsList, filterArray)).toEqual(result)
  })

  it('should filter transactions after month and year ', () => {
    //Arrange
    const transactionsList = [
      {
        year: 2022,
        month: 6,
        transactions: [
          {
            transactionDocId: '',
            transactionId: 'T-8',
            transactionType: 'Einlagerung',
            day: 25,
            month: 6,
            year: 2022,
            items: [{ quantity: 10, price: 1, article: getDummyArticles()[4] }],
            total_amount: 10
          }
        ]
      },
      ...getDummySortedTransactions()
    ]
    const filterArray = [dynamicText.june.toLowerCase(), '2022']
    const result = [
      {
        year: 2022,
        month: 6,
        transactions: [
          {
            transactionDocId: '',
            transactionId: 'T-8',
            transactionType: 'Einlagerung',
            day: 25,
            month: 6,
            year: 2022,
            items: [{ quantity: 10, price: 1, article: getDummyArticles()[4] }],
            total_amount: 10
          }
        ]
      }
    ]

    //Act & Assert
    expect(filterTransactions(transactionsList, filterArray)).toEqual(result)
  })

  it('should return empty [] if no matches were found', () => {
    //Arrange
    const transactionsList = getDummySortedTransactions()
    const filterArray = ['no match']
    const result: BTMSortedTransactions[] = []

    //Act & Assert
    expect(filterTransactions(transactionsList, filterArray)).toEqual(result)
  })

  it('should return all if filter is empty', () => {
    //Arrange
    const transactionsList = getDummySortedTransactions()
    const filterArray = ['']
    const result: BTMSortedTransactions[] = getDummySortedTransactions()

    //Act & Assert
    expect(filterTransactions(transactionsList, filterArray)).toEqual(result)
  })
})
