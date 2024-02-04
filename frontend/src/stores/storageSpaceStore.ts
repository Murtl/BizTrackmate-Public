import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { BTMStorageSpace } from '@/utils/types/btmStorageSpace'
import { useShopNameStore } from '@/stores/shopNameStore'
import axios from 'axios'
import { getAuth } from 'firebase/auth'

export const useStorageSpaceStore = defineStore('storageSpaceStore', () => {
  const storageSpaces: Ref<BTMStorageSpace[]> = ref([])
  const shopNameStore = useShopNameStore()

  /**
   * @description This function fetches the storage spaces from firestore.
   */
  const fetchStorageSpaces = async () => {
    if (storageSpaces.value.length === 0) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/stores/${shopNameStore.getShopId()}/storagespaces`,
          {
            headers: {
              Authorization: `Bearer ${(await getAuth().currentUser?.getIdToken()) as string}`
            }
          }
        )
        storageSpaces.value = (response.data as BTMStorageSpace[]).sort((a, b) =>
          parseInt(a.storageSpaceId.substring(2)) > parseInt(b.storageSpaceId.substring(2)) ? 1 : -1
        )
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
      const response = await axios.post(
        `http://localhost:3000/api/stores/${shopNameStore.getShopId()}/storagespaces`,
        {
          storageSpaceId: storageSpace.storageSpaceId,
          storageSpaceName: storageSpace.storageSpaceName,
          storageSpaceType: storageSpace.storageSpaceType,
          description: storageSpace.description
        },
        {
          headers: {
            Authorization: `Bearer ${(await getAuth().currentUser?.getIdToken()) as string}`
          }
        }
      )
      storageSpace.storageSpaceDocId = response.data.storageSpaceDocId
      storageSpaces.value.push(storageSpace)
      return { state: true, message: response.data }
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
      await axios.delete(
        `http://localhost:3000/api/stores/${shopNameStore.getShopId()}/storagespaces/${storageSpaceDocId}`,
        {
          headers: {
            Authorization: `Bearer ${(await getAuth().currentUser?.getIdToken()) as string}`
          }
        }
      )
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
      await axios.put(
        `http://localhost:3000/api/stores/${shopNameStore.getShopId()}/storagespaces/${
          storageSpace.storageSpaceDocId
        }`,
        {
          storageSpaceId: storageSpace.storageSpaceId,
          storageSpaceName: storageSpace.storageSpaceName,
          storageSpaceType: storageSpace.storageSpaceType,
          description: storageSpace.description
        },
        {
          headers: {
            Authorization: `Bearer ${(await getAuth().currentUser?.getIdToken()) as string}`
          }
        }
      )
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
