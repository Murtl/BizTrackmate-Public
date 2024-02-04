import { describe, it, expect } from 'vitest'
import { getDummyArticles, getDummyTransactions } from '@/__tests__/test-utils/getDummyData'
import { checkIfItemIsInStock } from '@/utils/functions/transaction/checkIfItemIsInStock'

describe('checkIfItemIsInStock', () => {
  it('should return true if the current transaction is an income storage', () => {
    //Arrange
    const currentTransaction = getDummyTransactions()[0]
    const articles = getDummyArticles()
    const currentItem = currentTransaction.items[0]
    const result = true

    //Act & Assert
    expect(checkIfItemIsInStock(currentTransaction, articles, currentItem)).toBe(result)
  })

  it('should return true if the current transaction is an outcome storage and in stock', () => {
    //Arrange
    const currentTransaction = getDummyTransactions()[5]
    const articles = getDummyArticles()
    const currentItem = currentTransaction.items[0]
    const result = true

    //Act & Assert
    expect(checkIfItemIsInStock(currentTransaction, articles, currentItem)).toBe(result)
  })

  it('should return false if the current transaction is an outcome storage and not in stock', () => {
    //Arrange
    const currentTransaction = getDummyTransactions()[6]
    const articles = getDummyArticles()
    const currentItem = currentTransaction.items[0]
    const result = false

    //Act & Assert
    expect(checkIfItemIsInStock(currentTransaction, articles, currentItem)).toBe(result)
  })
})
