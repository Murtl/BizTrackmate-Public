import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { BTMArticleGroup } from '@/utils/types/btmArticleGroup'
import { useShopNameStore } from '@/stores/shopNameStore'
import { v4 as uuidv4 } from 'uuid'

/**
 * This is the store for article groups.
 */
export const useArticleGroupStore = defineStore('articleGroupStore', () => {
  const articleGroups: Ref<BTMArticleGroup[]> = ref([])
  const shopNameStore = useShopNameStore()

  /**
   * @description This function fetches the article groups from firestore.
   */
  const fetchArticleGroups = async () => {
    if (articleGroups.value.length === 0) {
      try {
        articleGroups.value = [];
      } catch (e) {
        articleGroups.value = []
        console.log(e)
      }
    }
  }

  /**
   * @description This function resets the article groups in the store.
   */
  const resetArticleGroups = () => {
    articleGroups.value = []
  }

  /**
   * This function adds an article group to the store.
   * @param articleGroup The article group to add.
   * @returns {state: boolean, message: string} The state of the operation and a message.
   */
  const addArticleGroup = async (
    articleGroup: BTMArticleGroup
  ): Promise<{ state: boolean; message: string }> => {
    try {
      articleGroup.groupDocId = uuidv4()
      articleGroups.value.push(articleGroup)
      return { state: true, message: '' }
    } catch (e) {
      return { state: false, message: e as string }
    }
  }

  /**
   * This function removes an article group from the store.
   * @param groupDocId The firestore ID of the article group to remove.
   * @returns {state: boolean, message: string} The state of the operation and a message.
   */
  const removeArticleGroup = async (
    groupDocId: string
  ): Promise<{ state: boolean; message: string }> => {
    try {
      const index = articleGroups.value.findIndex((a) => a.groupDocId === groupDocId)
      articleGroups.value.splice(index, 1)
      return { state: true, message: '' }
    } catch (e) {
      return { state: false, message: e as string }
    }
  }

  /**
   * This function updates an article group in the store.
   * @param articleGroup The article group to update.
   * @returns {state: boolean, message: string} The state of the operation and a message.
   */
  const updateArticleGroup = async (
    articleGroup: BTMArticleGroup
  ): Promise<{ state: boolean; message: string }> => {
    try {
      const index = articleGroups.value.findIndex((a) => a.groupDocId === articleGroup.groupDocId)
      articleGroups.value[index] = articleGroup
      return { state: true, message: '' }
    } catch (e) {
      return { state: false, message: e as string }
    }
  }

  return {
    articleGroups,
    addArticleGroup,
    removeArticleGroup,
    updateArticleGroup,
    fetchArticleGroups,
    resetArticleGroups
  }
})
