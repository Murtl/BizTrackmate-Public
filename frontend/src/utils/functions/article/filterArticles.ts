import type { BTMArticle } from '@/utils/types/btmArticle'

/**
 * @description This function filters articles by articleNr and name.
 * @param articles The articles to be filtered.
 * @param filter The filter to be applied.
 */
export const filterArticles = (articles: BTMArticle[], filter: string) => {
  return articles.filter((article) => {
    return (
      article.articleId.toLowerCase().includes(filter.toLowerCase()) ||
      article.name.toLowerCase().includes(filter.toLowerCase())
    )
  })
}
