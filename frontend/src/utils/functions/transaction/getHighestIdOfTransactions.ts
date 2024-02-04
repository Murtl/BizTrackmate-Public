import type { BTMTransaction } from '@/utils/types/btmTransaction'

/**
 * @description This function returns the highest id of transactions.
 * @param transactions The transactions to be searched
 */
export const getHighestIdOfTransactions = (transactions: BTMTransaction[]): number => {
  let highestId = 0
  transactions.forEach((transaction) => {
    if (parseInt(transaction.transactionId.substring(2)) > highestId) {
      highestId = parseInt(transaction.transactionId.substring(2))
    }
  })
  return highestId
}
