import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { BTMStorageSpace } from '@/utils/types/btmStorageSpace'
import { useShopNameStore } from '@/stores/shopNameStore'
import { v4 as uuidv4 } from 'uuid'

export const useStorageSpaceStore = defineStore('storageSpaceStore', () => {
  const storageSpaces: Ref<BTMStorageSpace[]> = ref([])
  const shopNameStore = useShopNameStore()

  /**
   * @description This function fetches the storage spaces from firestore.
   */
  const fetchStorageSpaces = async () => {
    if (storageSpaces.value.length === 0) {
      try {
        storageSpaces.value = []
      } catch (e) {
        storageSpaces.value = []
        console.log(e)
      }
    }
  }

  /**
   * @description This function resets the storage spaces in the store.
   */
  const resetStorageSpaces = () => {
    storageSpaces.value = []
  }

  /**
   * This function adds a storage space to the store.
   * @param storageSpace The storage space to add.
   * @returns {state: boolean, message: string} The state of the operation and a message.
   */
  const addStorageSpace = async (
    storageSpace: BTMStorageSpace
  ): Promise<{ state: boolean; message: string }> => {
    try {
      storageSpace.storageSpaceDocId = uuidv4()
      storageSpaces.value.push(storageSpace)
      return { state: true, message: ''}
    } catch (e) {
      return { state: false, message: e as string }
    }
  }

  /**
   * This function removes a storage space from the store.
   * @param storageSpaceDocId The ID of the storage space to remove.
   * @returns { state: boolean; message: string } The state of the operation and a message.
   */
  const removeStorageSpace = async (
    storageSpaceDocId: string
  ): Promise<{ state: boolean; message: string }> => {
    try {
      const index = storageSpaces.value.findIndex((a) => a.storageSpaceDocId === storageSpaceDocId)
      storageSpaces.value.splice(index, 1)
      return { state: true, message: 'success' }
    } catch (e) {
      return { state: false, message: e as string }
    }
  }

  /**
   * This function updates a storage space in the store.
   * @param storageSpace The storage space to update.
   * @returns { state: boolean; message: string } The state of the update.
   */
  const updateStorageSpace = async (
    storageSpace: BTMStorageSpace
  ): Promise<{ state: boolean; message: string }> => {
    try {
      const index = storageSpaces.value.findIndex(
        (a) => a.storageSpaceId === storageSpace.storageSpaceId
      )
      storageSpaces.value[index] = storageSpace
      return { state: true, message: 'success' }
    } catch (e) {
      return { state: false, message: e as string }
    }
  }

  return {
    storageSpaces,
    addStorageSpace,
    removeStorageSpace,
    updateStorageSpace,
    fetchStorageSpaces,
    resetStorageSpaces
  }
})
