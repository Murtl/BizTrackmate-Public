import type { BTMTransactionItem } from '@/utils/types/btmTransactionItem'

/**
 * This is the type for transaction.
 */
export type BTMTransaction = {
  transactionDocId: string
  transactionId: string
  transactionType: string
  day: number
  month: number
  year: number
  items: BTMTransactionItem[]
  total_amount: number
  description?: string
}
