import type { BTMTransaction } from '@/utils/types/btmTransaction'

/**
 * @description This function returns a list of available years of transaction.
 * @param transactions The transaction to be filtered
 */
export const getAvailableYearsOfTransactions = (transactions: BTMTransaction[]) => {
  const years: number[] = []
  for (let i = 0; i < transactions.length; i++) {
    if (!years.includes(transactions[i].year)) {
      years.push(transactions[i].year)
    }
  }
  return years
}
