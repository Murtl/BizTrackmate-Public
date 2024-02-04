import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { BTMArticle } from '@/utils/types/btmArticle'
import { useShopNameStore } from '@/stores/shopNameStore'
import axios from 'axios'
import { getAuth } from 'firebase/auth'

export const useArticleStore = defineStore('articleStore', () => {
  const articles: Ref<BTMArticle[]> = ref([])
  const shopNameStore = useShopNameStore()

  /**
   * @description Fetches the articles from firestore
   */
  const fetchArticles = async () => {
    if (articles.value.length === 0) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/stores/${shopNameStore.getShopId()}/articles`,
          {
            headers: {
              Authorization: `Bearer ${(await getAuth().currentUser?.getIdToken()) as string}`
            }
          }
        )
        const parsedArticles = response.data as BTMArticle[]
        parsedArticles.forEach((article) => {
          article.stock = parseInt(article.stock.toString())
          article.price = parseInt(article.price.toString())
          article.articleGroup.currentStock = parseInt(article.articleGroup.currentStock.toString())
        })
        articles.value = (response.data as BTMArticle[]).sort((a, b) =>
          parseInt(a.articleId.substring(2)) > parseInt(b.articleId.substring(2)) ? 1 : -1
        )
      } catch (e) {
        articles.value = []
        console.log(e)
      }
    }
  }

  /**
   * @description Resets the articles in the store.
   */
  const resetArticles = () => {
    articles.value = []
  }

  /**
   * Adds an article to the store.
   * @param article The article to add.
   * @returns {state: boolean, message: string} The state of the operation and a message.
   */
  const addArticle = async (article: BTMArticle): Promise<{ state: boolean; message: string }> => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/stores/${shopNameStore.getShopId()}/articles`,
        {
          articleId: article.articleId,
          name: article.name,
          price: article.price,
          stock: article.stock.toString(),
          articleGroup: {
            groupDocId: article.articleGroup.groupDocId,
            groupId: article.articleGroup.groupId,
            groupName: article.articleGroup.groupName,
            groupType: article.articleGroup.groupType,
            currentStock: article.articleGroup.currentStock.toString(),
            description: article.articleGroup.description
          },
          storageSpace: article.storageSpace,
          description: article.description
        },
        {
          headers: {
            Authorization: `Bearer ${(await getAuth().currentUser?.getIdToken()) as string}`
          }
        }
      )
      article.articleDocId = response.data.articleDocId
      articles.value.push(Object.assign({}, article))
      return { state: true, message: '' }
    } catch (e) {
      console.log(e)
      return { state: false, message: e as string }
    }
  }

  /**
   * Removes an article from the store.
   * @param articleDocId The articleNr of the article to remove.
   * @returns {state: boolean, message: string} The state of the operation and a message.
   */
  const removeArticle = async (
    articleDocId: string
  ): Promise<{ state: boolean; message: string }> => {
    try {
      await axios.delete(
        `http://localhost:3000/api/stores/${shopNameStore.getShopId()}/articles/${articleDocId}`,
        {
          headers: {
            Authorization: `Bearer ${(await getAuth().currentUser?.getIdToken()) as string}`
          }
        }
      )
      const index = articles.value.findIndex((article) => article.articleDocId === articleDocId)
      articles.value.splice(index, 1)
      return { state: true, message: '' }
    } catch (e) {
      return { state: false, message: e as string }
    }
  }

  /**
   * Updates an article in the store.
   * @param article The article to update.
   * @returns {state: boolean, message: string} The state of the operation and a message.
   */
  const updateArticle = async (
    article: BTMArticle
  ): Promise<{ state: boolean; message: string }> => {
    try {
      await axios.put(
        `http://localhost:3000/api/stores/${shopNameStore.getShopId()}/articles/${
          article.articleDocId
        }`,
        {
          articleId: article.articleId,
          name: article.name,
          price: article.price,
          stock: article.stock.toString(),
          articleGroup: {
            groupDocId: article.articleGroup.groupDocId,
            groupId: article.articleGroup.groupId,
            groupName: article.articleGroup.groupName,
            groupType: article.articleGroup.groupType,
            currentStock: article.articleGroup.currentStock.toString(),
            description: article.articleGroup.description
          },
          storageSpace: article.storageSpace,
          description: article.description
        },
        {
          headers: {
            Authorization: `Bearer ${(await getAuth().currentUser?.getIdToken()) as string}`
          }
        }
      )
      const index = articles.value.findIndex((a) => a.articleDocId === article.articleDocId)
      articles.value[index] = article
      return { state: true, message: '' }
    } catch (e) {
      return { state: false, message: e as string }
    }
  }

  return { articles, addArticle, removeArticle, updateArticle, fetchArticles, resetArticles }
})
