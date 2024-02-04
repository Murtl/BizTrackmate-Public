import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * store for the current shop name
 */
export const useShopNameStore = defineStore('shopNameStore', () => {
  const shopNameGlobal = ref('')
  const storeId = ref('')

  /**
   * @description This function gets the shop name.
   */
  const getShopName = () => {
    return shopNameGlobal.value
  }

  /**
   * @description This function gets the shop id.
   */
  const getShopId = () => {
    return storeId.value
  }

  /**
   * @description This function sets the shop name and id.
   * @param shopName The shop name
   * @param passedStoreId The shop id
   */
  const setShopNameAndId = (shopName: string, passedStoreId: string) => {
    shopNameGlobal.value = shopName
    storeId.value = passedStoreId
  }

  return { getShopName, setShopNameAndId, getShopId }
})
