import { monthsConstant } from '@/utils/contants'
import dynamicText from '@/text/dynamicText.json'
import type { BTMSortedTransactions } from '@/utils/types/btmSortedTransaction'

/**
 * @description Returns the amount of food or non-food for a given month and year
 * @param sortedTransactions Array of sorted transactions
 * @param selectedYear Selected year
 * @param selectedMonth Selected month
 * @param groupType group type
 * @param yearOverview boolean if year overview is selected
 */
export const getTotalQuantity = (
  sortedTransactions: BTMSortedTransactions[],
  selectedYear: number,
  selectedMonth: string,
  groupType: string,
  yearOverview: boolean
): number => {
  let amount: number = 0
  sortedTransactions.forEach((sortedTransaction) => {
    if (sortedTransaction.year === selectedYear) {
      if (yearOverview || monthsConstant[sortedTransaction.month - 1] === selectedMonth) {
        sortedTransaction.transactions.forEach((transaction) => {
          if (transaction.transactionType === dynamicText.outcome_storage) {
            transaction.items.forEach((item) => {
              if (item.article.articleGroup.groupType === groupType) {
                amount += parseInt(item.quantity.toString())
              }
            })
          }
        })
      }
    }
  })
  return amount
}
