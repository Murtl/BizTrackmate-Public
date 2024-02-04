import { monthsConstant } from '@/utils/contants'
import type { BTMSortedTransactions } from '@/utils/types/btmSortedTransaction'

/**
 * @description Returns the number of storages for a type in a given month and year
 * @param sortedTransactions Array of sorted transactions
 * @param selectedYear Selected year
 * @param selectedMonth Selected month
 * @param storageType Storage type
 * @param yearOverview boolean if year overview is selected
 */
export const getStorages = (
  sortedTransactions: BTMSortedTransactions[],
  selectedYear: number,
  selectedMonth: string,
  storageType: string,
  yearOverview: boolean
): number => {
  let storages: number = 0
  sortedTransactions.forEach((sortedTransaction) => {
    if (sortedTransaction.year === selectedYear) {
      if (yearOverview || monthsConstant[sortedTransaction.month - 1] === selectedMonth) {
        sortedTransaction.transactions.forEach((transaction) => {
          if (transaction.transactionType === storageType) {
            storages++
          }
        })
      }
    }
  })
  return storages
}
