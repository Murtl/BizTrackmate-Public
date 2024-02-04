import type { BTMTransaction } from '@/utils/types/btmTransaction'
import type { BTMSortedTransactions } from '@/utils/types/btmSortedTransaction'

/**
 * @description This function returns a list of available years of transaction.
 * @param availableMonths The available months of transaction
 */
export const initSortedTransactions = (
  availableMonths: { year: number; month: number }[]
): BTMSortedTransactions[] => {
  const sortedTransactions: BTMSortedTransactions[] = []
  for (let i = 0; i < availableMonths.length; i++) {
    sortedTransactions.push({
      year: availableMonths[i].year,
      month: availableMonths[i].month,
      transactions: []
    })
  }
  return sortedTransactions
}

/**
 * @description This function returns a list of available years of transaction.
 * @param transactions The transaction to be filtered
 * @param sortedTransactions The transaction to be extended
 */
export const sortTransactionsInSortedTransactions = (
  transactions: BTMTransaction[],
  sortedTransactions: BTMSortedTransactions[]
): BTMSortedTransactions[] => {
  const sortedTransactionsNew: BTMSortedTransactions[] = sortedTransactions
  for (let i = 0; i < transactions.length; i++) {
    for (let j = 0; j < sortedTransactionsNew.length; j++) {
      if (
        transactions[i].year === sortedTransactionsNew[j].year &&
        transactions[i].month === sortedTransactionsNew[j].month
      ) {
        sortedTransactionsNew[j].transactions.push(transactions[i])
      }
    }
  }
  return sortedTransactionsNew
}

/**
 * @description This function returns a list of sorted transactions sorted by year and month.
 * @param sortedTransactions The transaction to be sorted
 */
export const sortSortedTransactionsByYearAndMonth = (
  sortedTransactions: BTMSortedTransactions[]
): BTMSortedTransactions[] => {
  return sortedTransactions.sort((a, b) => {
    if (a.year > b.year) {
      return 1
    } else if (a.year < b.year) {
      return -1
    } else {
      if (a.month > b.month) {
        return 1
      } else if (a.month < b.month) {
        return -1
      } else {
        return 0
      }
    }
  })
}

/**
 * @description This function returns a list of sorted transactions sorted by day.
 * @param sortedTransactions The transaction to be sorted
 */
export const sortSortedTransactionsByDay = (
  sortedTransactions: BTMSortedTransactions[]
): BTMSortedTransactions[] => {
  return sortedTransactions.map((sortedTransaction) => {
    sortedTransaction.transactions.sort((a, b) => {
      if (a.day > b.day) {
        return -1
      } else if (a.day < b.day) {
        return 1
      } else {
        return 0
      }
    })
    return sortedTransaction
  })
}
