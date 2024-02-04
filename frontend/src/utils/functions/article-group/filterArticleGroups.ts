import type { BTMArticleGroup } from '@/utils/types/btmArticleGroup'

/**
 * @description This function filters article groups by groupId and groupName.
 * @param articleGroups The article groups to be filtered.
 * @param filter The filter to be applied.
 */
export const filterArticleGroups = (articleGroups: BTMArticleGroup[], filter: string) => {
  return articleGroups.filter((articleGroup) => {
    return (
      articleGroup.groupId.toLowerCase().includes(filter.toLowerCase()) ||
      articleGroup.groupName.toLowerCase().includes(filter.toLowerCase())
    )
  })
}
