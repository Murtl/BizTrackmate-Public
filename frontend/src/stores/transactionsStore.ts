import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { BTMTransaction } from '@/utils/types/btmTransaction'
import { useShopNameStore } from '@/stores/shopNameStore'
import { v4 as uuidv4 } from 'uuid'

export const useTransactionsStore = defineStore('transactionsStore', () => {
  const transactions: Ref<BTMTransaction[]> = ref([])
  const shopNameStore = useShopNameStore()

  /**
   * @description This function fetches the transactions from firestore.
   */
  const fetchTransactions = async () => {
    if (transactions.value.length === 0) {
      try {
        transactions.value = []
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
      transaction.transactionDocId = uuidv4();
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
      const index = transactions.value.findIndex((a) => a.transactionDocId === transactionDocId)
      transactions.value.splice(index, 1)
      return { state: true, message: '' }
    } catch (e) {
      return { state: false, message: e as string }
    }
  }

  return { transactions, addTransaction, removeTransaction, fetchTransactions, resetTransactions }
})
