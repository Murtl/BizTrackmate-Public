import type { BTMTransaction } from '@/utils/types/btmTransaction'

/**
 * This is the type for sorted transaction.
 */
export type BTMSortedTransactions = {
  year: number
  month: number
  transactions: BTMTransaction[]
}
