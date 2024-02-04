import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { BTMArticleGroup } from '@/utils/types/btmArticleGroup'
import { useShopNameStore } from '@/stores/shopNameStore'
import axios from 'axios'
import { getAuth } from 'firebase/auth'

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
        const response = await axios.get(
          `http://localhost:3000/api/stores/${shopNameStore.getShopId()}/articlegroups`,
          {
            headers: {
              Authorization: `Bearer ${(await getAuth().currentUser?.getIdToken()) as string}`
            }
          }
        )
        const parsedArticleGroups = response.data as BTMArticleGroup[]
        parsedArticleGroups.forEach((articleGroup) => {
          articleGroup.currentStock = parseInt(articleGroup.currentStock.toString())
        })
        articleGroups.value = (response.data as BTMArticleGroup[]).sort((a, b) =>
          parseInt(a.groupId.substring(3)) > parseInt(b.groupId.substring(3)) ? 1 : -1
        )
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
      const response = await axios.post(
        `http://localhost:3000/api/stores/${shopNameStore.getShopId()}/articlegroups`,
        {
          groupId: articleGroup.groupId,
          groupName: articleGroup.groupName,
          groupType: articleGroup.groupType,
          currentStock: articleGroup.currentStock.toString(),
          description: articleGroup.description
        },
        {
          headers: {
            Authorization: `Bearer ${(await getAuth().currentUser?.getIdToken()) as string}`
          }
        }
      )
      articleGroup.groupDocId = response.data.groupDocId
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
      await axios.delete(
        `http://localhost:3000/api/stores/${shopNameStore.getShopId()}/articlegroups/${groupDocId}`,
        {
          headers: {
            Authorization: `Bearer ${(await getAuth().currentUser?.getIdToken()) as string}`
          }
        }
      )
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
      await axios.put(
        `http://localhost:3000/api/stores/${shopNameStore.getShopId()}/articlegroups/${
          articleGroup.groupDocId
        }`,
        {
          groupId: articleGroup.groupId,
          groupName: articleGroup.groupName,
          groupType: articleGroup.groupType,
          currentStock: articleGroup.currentStock.toString(),
          description: articleGroup.description
        },
        {
          headers: {
            Authorization: `Bearer ${(await getAuth().currentUser?.getIdToken()) as string}`
          }
        }
      )
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
