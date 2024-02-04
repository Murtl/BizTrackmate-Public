import type { BTMTransaction } from '@/utils/types/btmTransaction'

/**
 * @description This function returns a list of available months of transaction.
 * @param availableYears The available years of transaction
 * @param transactions The transaction to be filtered
 */
export const getAvailableMonthsOfTransactions = (
  availableYears: number[],
  transactions: BTMTransaction[]
): { year: number; month: number }[] => {
  const availableMonths: { year: number; month: number }[] = []
  for (let i = 0; i < availableYears.length; i++) {
    for (let j = 0; j < transactions.length; j++) {
      if (availableYears[i] === transactions[j].year) {
        if (
          !availableMonths.find(
            (month) => month.month === transactions[j].month && month.year === transactions[j].year
          )
        ) {
          availableMonths.push({
            year: availableYears[i],
            month: transactions[j].month
          })
        }
      }
    }
  }
  return availableMonths
}
