import { monthsConstant } from '@/utils/contants'
import dynamicText from '@/text/dynamicText.json'
import type { BTMSortedTransactions } from '@/utils/types/btmSortedTransaction'

/**
 * @description Returns the profit for a given month and year
 * @param sortedTransactions Array of sorted transactions
 * @param selectedYear Selected year
 * @param selectedMonth Selected month
 * @param yearOverview boolean if year overview is selected
 */
export const getProfit = (
  sortedTransactions: BTMSortedTransactions[],
  selectedYear: number,
  selectedMonth: string,
  yearOverview: boolean
): number => {
  let profit: number = 0
  sortedTransactions.forEach((sortedTransaction) => {
    if (sortedTransaction.year === selectedYear) {
      if (yearOverview || monthsConstant[sortedTransaction.month - 1] === selectedMonth) {
        sortedTransaction.transactions.forEach((transaction) => {
          if (transaction.transactionType === dynamicText.income_storage) {
            profit -= transaction.total_amount
          } else if (transaction.transactionType === dynamicText.outcome_storage) {
            profit += transaction.total_amount
          }
        })
      }
    }
  })
  return Math.round(profit * 100) / 100
}
