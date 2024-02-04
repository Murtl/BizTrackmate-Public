import type { BTMArticleGroup } from '@/utils/types/btmArticleGroup'
import type { BTMStorageSpace } from '@/utils/types/btmStorageSpace'

/**
 * This is the type for articles.
 */
export type BTMArticle = {
  articleDocId: string
  articleId: string
  name: string
  price: number
  stock: number
  articleGroup: BTMArticleGroup
  storageSpace: BTMStorageSpace
  description?: string
}
