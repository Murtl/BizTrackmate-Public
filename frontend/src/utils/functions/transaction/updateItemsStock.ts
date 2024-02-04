import type { BTMTransaction } from '@/utils/types/btmTransaction'
import { useArticleStore } from '@/stores/articleStore'
import { storeToRefs } from 'pinia'
import { useArticleGroupStore } from '@/stores/articleGroupStore'
import dynamicText from '@/text/dynamicText.json'
import type { BTMArticle } from '@/utils/types/btmArticle'
import type { BTMArticleGroup } from '@/utils/types/btmArticleGroup'

const articleStore = useArticleStore()
const { articles } = storeToRefs(articleStore)
const articleGroupsStore = useArticleGroupStore()
const { articleGroups } = storeToRefs(articleGroupsStore)

/**
 * @description Update the stock of the articles and articleGroups
 * @param transaction The transaction
 * @param toAdd If the stock should be added or subtracted
 * @returns {Promise<{state: boolean, message: string}>} The state and message of the update
 */
export const updateItemsStock = async (
  transaction: BTMTransaction,
  toAdd: boolean
): Promise<{
  state: boolean
  message: string
}> => {
  for (const item of transaction.items) {
    const articleIndex = articles.value.findIndex(
      (a) => a.articleDocId === item.article.articleDocId
    )
    const articleGroupIndex = articleGroups.value.findIndex(
      (ag) => ag.groupDocId === item.article.articleGroup.groupDocId
    )

    if (transaction.transactionType === dynamicText.outcome_storage) {
      const { state, message } = await updateArticleStock(
        item.article,
        articleIndex,
        parseInt(item.quantity.toString()),
        toAdd
      )
      if (!state) return { state: false, message: message }
      const { state: state2, message: message2 } = await updateArticleGroupStock(
        item.article.articleGroup,
        articleGroupIndex,
        parseInt(item.quantity.toString()),
        toAdd
      )
      if (!state2) return { state: false, message: message2 }
    }
    if (transaction.transactionType === dynamicText.income_storage) {
      const { state, message } = await updateArticleStock(
        item.article,
        articleIndex,
        parseInt(item.quantity.toString()),
        !toAdd
      )
      if (!state) return { state: false, message: message }
      const { state: state2, message: message2 } = await updateArticleGroupStock(
        item.article.articleGroup,
        articleGroupIndex,
        parseInt(item.quantity.toString()),
        !toAdd
      )
      if (!state2) return { state: false, message: message2 }
    }
  }
  return { state: true, message: '' }
}

/**
 * @description Update the stock of the article
 * @param article The article
 * @param articleIndex The index of the article
 * @param toCalc The quantity to add or subtract
 * @param toAdd If the stock should be added or subtracted
 * @returns {Promise<{state: boolean, message: string}>} The state and message of the update
 */
const updateArticleStock = async (
  article: BTMArticle,
  articleIndex: number,
  toCalc: number,
  toAdd: boolean
): Promise<{ state: boolean; message: string }> => {
  if (articleIndex > -1 && toAdd) {
    articles.value[articleIndex].stock =
      parseInt(articles.value[articleIndex].stock.toString()) + toCalc
    return await articleStore.updateArticle(articles.value[articleIndex])
  }
  if (articleIndex > -1 && !toAdd) {
    articles.value[articleIndex].stock =
      parseInt(articles.value[articleIndex].stock.toString()) - toCalc
    return await articleStore.updateArticle(articles.value[articleIndex])
  }
  return { state: false, message: dynamicText.article_not_found }
}

/**
 * @description Update the stock of the articleGroup
 * @param articleGroup The articleGroup
 * @param articleGroupIndex The index of the articleGroup
 * @param toCalc The quantity to add or subtract
 * @param toAdd If the stock should be added or subtracted
 * @returns {Promise<{state: boolean, message: string}>} The state and message of the update
 */
const updateArticleGroupStock = async (
  articleGroup: BTMArticleGroup,
  articleGroupIndex: number,
  toCalc: number,
  toAdd: boolean
): Promise<{ state: boolean; message: string }> => {
  if (articleGroupIndex > -1 && toAdd) {
    articleGroups.value[articleGroupIndex].currentStock =
      parseInt(articleGroups.value[articleGroupIndex].currentStock.toString()) + toCalc
    return await articleGroupsStore.updateArticleGroup(articleGroups.value[articleGroupIndex])
  }
  if (articleGroupIndex > -1 && !toAdd) {
    articleGroups.value[articleGroupIndex].currentStock =
      parseInt(articleGroups.value[articleGroupIndex].currentStock.toString()) - toCalc
    return await articleGroupsStore.updateArticleGroup(articleGroups.value[articleGroupIndex])
  }
  return { state: false, message: 'ArticleGroup not found!' }
}
