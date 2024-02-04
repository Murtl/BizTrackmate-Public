import type { BTMSortedTransactions } from '@/utils/types/btmSortedTransaction'
import { monthsConstant } from '@/utils/contants'

/**
 * @description This function returns a filtered list of transaction.
 * @param transactionsList The transaction to be filtered
 * @param filterArray The filter array
 */
export const filterTransactions = (
  transactionsList: BTMSortedTransactions[],
  filterArray: string[]
) => {
  return transactionsList.filter((transaction) => {
    if (
      monthsConstant[transaction.month - 1].toLowerCase().includes(filterArray[0]) ||
      transaction.year.toString().includes(filterArray[0])
    ) {
      if (filterArray.length === 2) {
        return (
          monthsConstant[transaction.month - 1].toLowerCase().includes(filterArray[0]) &&
          transaction.year.toString().includes(filterArray[1])
        )
      }
      return true
    }
    return false
  })
}
