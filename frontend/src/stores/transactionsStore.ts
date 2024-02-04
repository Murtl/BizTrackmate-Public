import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { BTMTransaction } from '@/utils/types/btmTransaction'
import { useShopNameStore } from '@/stores/shopNameStore'
import axios from 'axios'
import { getAuth } from 'firebase/auth'

export const useTransactionsStore = defineStore('transactionsStore', () => {
  const transactions: Ref<BTMTransaction[]> = ref([])
  const shopNameStore = useShopNameStore()

  /**
   * @description This function fetches the transactions from firestore.
   */
  const fetchTransactions = async () => {
    if (transactions.value.length === 0) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/stores/${shopNameStore.getShopId()}/transactions`,
          {
            headers: {
              Authorization: `Bearer ${(await getAuth().currentUser?.getIdToken()) as string}`
            }
          }
        )
        const parsedTransactions = response.data as BTMTransaction[]
        parsedTransactions.forEach((transaction) => {
          transaction.day = parseInt(transaction.day.toString())
          transaction.month = parseInt(transaction.month.toString())
          transaction.year = parseInt(transaction.year.toString())
          transaction.total_amount = parseInt(transaction.total_amount.toString())
          transaction.items.forEach((item) => {
            item.quantity = parseInt(item.quantity.toString())
            item.price = parseInt(item.price.toString())
            item.article.stock = parseInt(item.article.stock.toString())
            item.article.price = parseInt(item.article.price.toString())
            item.article.articleGroup.currentStock = parseInt(
              item.article.articleGroup.currentStock.toString()
            )
          })
        })
        transactions.value = parsedTransactions.sort((a, b) =>
          a.transactionId > b.transactionId ? 1 : -1
        )
      } catch (e) {
        transactions.value = []
        console.log(e)
      }
    }
  }

  /*+
   * @description This function resets the transactions in the store.
   */
  const resetTransactions = () => {
    transactions.value = []
  }

  /**
   * @description This function adds a new transaction to the list of transaction.
   * @param transaction The transaction to add.
   * @returns {state: boolean, message: string} The state of the operation and a message.
   */
  const addTransaction = async (
    transaction: BTMTransaction
  ): Promise<{ state: boolean; message: string }> => {
    try {
      const transactionsItems: any[] = []
      transaction.items.forEach((item) => {
        transactionsItems.push({
          price: item.price,
          quantity: item.quantity,
          article: {
            articleDocId: item.article.articleDocId,
            articleId: item.article.articleId,
            name: item.article.name,
            price: item.article.price,
            stock: item.article.stock.toString(),
            description: item.article.description,
            articleGroup: {
              groupDocId: item.article.articleGroup.groupDocId,
              groupId: item.article.articleGroup.groupId,
              groupName: item.article.articleGroup.groupName,
              groupType: item.article.articleGroup.groupType,
              currentStock: item.article.articleGroup.currentStock.toString(),
              description: item.article.articleGroup.description
            },
            storageSpace: {
              storageSpaceDocId: item.article.storageSpace.storageSpaceDocId,
              storageSpaceId: item.article.storageSpace.storageSpaceId,
              storageSpaceName: item.article.storageSpace.storageSpaceName,
              storageSpaceType: item.article.storageSpace.storageSpaceType,
              description: item.article.storageSpace.description
            }
          }
        })
      })
      const response = await axios.post(
        `http://localhost:3000/api/stores/${shopNameStore.getShopId()}/transactions`,
        {
          transactionId: transaction.transactionId,
          transactionType: transaction.transactionType,
          day: transaction.day,
          month: transaction.month,
          year: transaction.year,
          items: transactionsItems,
          total_amount: transaction.total_amount,
          description: transaction.description
        },
        {
          headers: {
            Authorization: `Bearer ${(await getAuth().currentUser?.getIdToken()) as string}`
          }
        }
      )
      transaction.transactionDocId = response.data.transactionDocId
      transactions.value.push(transaction)
      return { state: true, message: '' }
    } catch (e) {
      console.log(e)
      return { state: false, message: e as string }
    }
  }

  /**
   * @description This function removes a transaction from the list of transaction.
   * @param transactionDocId The id of the transaction to remove.
   * @returns {state: boolean, message: string} The state of the operation and a message.
   */
  const removeTransaction = async (
    transactionDocId: string
  ): Promise<{ state: boolean; message: string }> => {
    try {
      await axios.delete(
        `http://localhost:3000/api/stores/${shopNameStore.getShopId()}/transactions/${transactionDocId}`,
        {
          headers: {
            Authorization: `Bearer ${(await getAuth().currentUser?.getIdToken()) as string}`
          }
        }
      )
      const index = transactions.value.findIndex((a) => a.transactionDocId === transactionDocId)
      transactions.value.splice(index, 1)
      return { state: true, message: '' }
    } catch (e) {
      return { state: false, message: e as string }
    }
  }

  return { transactions, addTransaction, removeTransaction, fetchTransactions, resetTransactions }
})
