import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { BTMArticle } from '@/utils/types/btmArticle'
import { useShopNameStore } from '@/stores/shopNameStore'
import { v4 as uuidv4 } from 'uuid'

export const useArticleStore = defineStore('articleStore', () => {
  const articles: Ref<BTMArticle[]> = ref([])
  const shopNameStore = useShopNameStore()

  /**
   * @description Fetches the articles from firestore
   */
  const fetchArticles = async () => {
    if (articles.value.length === 0) {
      try {
        articles.value = []
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
      article.articleDocId = uuidv4()
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
      const index = articles.value.findIndex((a) => a.articleDocId === article.articleDocId)
      articles.value[index] = article
      return { state: true, message: '' }
    } catch (e) {
      return { state: false, message: e as string }
    }
  }

  return { articles, addArticle, removeArticle, updateArticle, fetchArticles, resetArticles }
})
