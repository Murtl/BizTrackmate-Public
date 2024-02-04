import { describe, expect, it } from 'vitest'
import type { BTMArticleGroup } from '@/utils/types/btmArticleGroup'
import { getDummyArticleGroups } from '@/__tests__/test-utils/getDummyData'
import { filterArticleGroups } from '@/utils/functions/article-group/filterArticleGroups'

describe('filterArticleGroups', () => {
  it('should filter article groups by groupId', () => {
    //Arrange
    const articleGroups: BTMArticleGroup[] = getDummyArticleGroups()
    const filter = 'GR-2'
    const result = [getDummyArticleGroups()[1]]

    //Act & Assert
    expect(filterArticleGroups(articleGroups, filter)).toEqual(result)
  })

  it('should filter article groups by groupName', () => {
    //Arrange
    const articleGroups: BTMArticleGroup[] = getDummyArticleGroups()
    const filter = 'Tabak'
    const result = [getDummyArticleGroups()[2]]

    //Act & Assert
    expect(filterArticleGroups(articleGroups, filter)).toEqual(result)
  })

  it('should return an empty array if no article group matches the filter', () => {
    //Arrange
    const articleGroups: BTMArticleGroup[] = getDummyArticleGroups()
    const filter = 'NoMatchForThis!'
    const result: BTMArticleGroup[] = []

    //Act & Assert
    expect(filterArticleGroups(articleGroups, filter)).toEqual(result)
  })

  it('should return all article groups if the filter is empty', () => {
    //Arrange
    const articleGroups: BTMArticleGroup[] = getDummyArticleGroups()
    const filter = ''
    const result = getDummyArticleGroups()

    //Act & Assert
    expect(filterArticleGroups(articleGroups, filter)).toEqual(result)
  })
})
