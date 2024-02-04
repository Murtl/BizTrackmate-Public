import { describe, it, expect } from 'vitest'
import {
  initSortedTransactions,
  sortTransactionsInSortedTransactions,
  sortSortedTransactionsByYearAndMonth,
  sortSortedTransactionsByDay
} from '@/utils/functions/transaction/sortTransactions'
import type { BTMSortedTransactions } from '@/utils/types/btmSortedTransaction'
import {
  getDummySortedTransactions,
  getDummyTransactions
} from '@/__tests__/test-utils/getDummyData'

describe('sortTransactions', () => {
  describe('initSortedTransactions', () => {
    it('should return the initial sorted Transactions Array', () => {
      //Arrange
      const availableMonths = [
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
        }
      ]
      const result = [
        {
          year: 2022,
          month: 10,
          transactions: []
        },
        {
          year: 2022,
          month: 11,
          transactions: []
        },
        {
          year: 2023,
          month: 2,
          transactions: []
        },
        {
          year: 2023,
          month: 6,
          transactions: []
        },
        {
          year: 2023,
          month: 5,
          transactions: []
        }
      ]

      //Act & Assert
      expect(initSortedTransactions(availableMonths)).toEqual(result)
    })
  })

  describe('sortTransactionsInSortedTransactions', () => {
    it('should return a array of sorted Transactions with its transactions', function () {
      //Arrange
      const transactions = getDummyTransactions()
      const sortedTransactions: BTMSortedTransactions[] = [
        {
          year: 2022,
          month: 10,
          transactions: []
        },
        {
          year: 2022,
          month: 11,
          transactions: []
        },
        {
          year: 2023,
          month: 2,
          transactions: []
        },
        {
          year: 2023,
          month: 5,
          transactions: []
        },
        {
          year: 2023,
          month: 6,
          transactions: []
        },
        {
          year: 2023,
          month: 11,
          transactions: []
        }
      ]
      const result = getDummySortedTransactions()

      //Act & Assert
      expect(sortTransactionsInSortedTransactions(transactions, sortedTransactions)).toEqual(result)
    })
  })

  describe('sortSortedTransactionsByYearAndMonth', () => {
    it('should return a array of sorted Transactions by year and month', function () {
      //Arrange
      const sortedTransactions: BTMSortedTransactions[] = getDummySortedTransactions().reverse()
      const result = getDummySortedTransactions()

      //Act & Assert
      expect(sortSortedTransactionsByYearAndMonth(sortedTransactions)).toEqual(result)
    })
  })

  describe('sortSortedTransactionsByDay', () => {
    it('should return a array of sorted Transactions by day', function () {
      //Arrange
      const sortedTransactions: BTMSortedTransactions[] = getDummySortedTransactions()
      const result = getDummySortedTransactions()
      result.map((sortedTransaction) => {
        sortedTransaction.transactions.sort((a, b) => {
          if (a.day > b.day) {
            return -1
          } else if (a.day < b.day) {
            return 1
          } else {
            return 0
          }
        })
      })

      //Act & Assert
      expect(sortSortedTransactionsByDay(sortedTransactions)).toEqual(result)
    })
  })
})
