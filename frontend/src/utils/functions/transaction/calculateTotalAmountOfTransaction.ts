import type { BTMTransaction } from '@/utils/types/btmTransaction'

/**
 * @description This function calculates the total amount of a transaction.
 * @param transaction The transaction to calculate the total amount of.
 */
export const calculateTotalAmountOfTransaction = (transaction: BTMTransaction): number => {
  let total_amount = 0
  transaction.items.forEach((item) => {
    total_amount += item.price * item.quantity
  })
  return parseFloat(total_amount.toFixed(2))
}
