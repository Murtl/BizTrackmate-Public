import dynamicText from '@/text/dynamicText.json'
import type { BTMTransaction } from '@/utils/types/btmTransaction'
import type { BTMArticle } from '@/utils/types/btmArticle'
import type { BTMTransactionItem } from '@/utils/types/btmTransactionItem'

/**
 * @description Checks if the current item is in stock
 * @param currentTransaction current transaction
 * @param articles all articles
 * @param currentItem current item
 * @returns {boolean} true if the item is in stock
 */
export const checkIfItemIsInStock = (
  currentTransaction: BTMTransaction,
  articles: BTMArticle[],
  currentItem: BTMTransactionItem
) => {
  if (currentTransaction.transactionType === dynamicText.income_storage) {
    return true
  }
  const article = articles.find((a) => a.articleId === currentItem.article.articleId)
  if (article) {
    return article.stock >= currentItem.quantity
  }
  return false
}
