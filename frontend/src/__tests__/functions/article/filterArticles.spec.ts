import { describe, it, expect } from 'vitest'
import { filterArticles } from '@/utils/functions/article/filterArticles'
import type { BTMArticle } from '@/utils/types/btmArticle'
import {
  getDummyArticleGroups,
  getDummyArticles,
  getDummyStorageSpaces
} from '@/__tests__/test-utils/getDummyData'

describe('filterArticles', () => {
  it('should filter articles by articleNr', () => {
    //Arrange
    const articles: BTMArticle[] = getDummyArticles()
    const filter = 'A-7'
    const result = [
      {
        articleDocId: '',
        articleId: 'A-7',
        name: 'Bier 0,5l',
        price: 3.2,
        stock: 0,
        articleGroup: getDummyArticleGroups()[2],
        storageSpace: getDummyStorageSpaces()[2]
      }
    ]

    //Act & Assert
    expect(filterArticles(articles, filter)).toEqual(result)
  })

  it('should filter articles by name', () => {
    //Arrange
    const articles: BTMArticle[] = getDummyArticles()
    const filter = 'Fanta'
    const result = [
      {
        articleDocId: '',
        articleId: 'A-4',
        name: 'Fanta 1,0l',
        price: 3.2,
        stock: 0,
        articleGroup: getDummyArticleGroups()[2],
        storageSpace: getDummyStorageSpaces()[2]
      }
    ]

    //Act & Assert
    expect(filterArticles(articles, filter)).toEqual(result)
  })

  it('should return an empty array if no article matches the filter', () => {
    //Arrange
    const articles: BTMArticle[] = getDummyArticles()
    const filter = 'NoMatchForThis'
    const result: BTMArticle[] = []

    //Act & Assert
    expect(filterArticles(articles, filter)).toEqual(result)
  })

  it('should return all articles if the filter is empty', () => {
    //Arrange
    const articles: BTMArticle[] = getDummyArticles()
    const filter = ''
    const result = getDummyArticles()

    //Act & Assert
    expect(filterArticles(articles, filter)).toEqual(result)
  })
})
