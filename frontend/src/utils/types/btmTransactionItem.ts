import type { BTMArticle } from '@/utils/types/btmArticle'

/**
 * This is the type for transaction items.
 */
export type BTMTransactionItem = {
  quantity: number
  price: number
  article: BTMArticle
}
