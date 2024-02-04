import {Article} from "../models/article";
import {firestore} from "firebase-admin";
import {ARTICLE_COLLECTION, STORES_COLLECTION} from "../utils/consts";
import logger from "../utils/logger";
import {BadRequestError} from "../middleware/errors/clientErrors";

/**
 * Erstellt einen neuen Artikel in Firestore. Gibt die ID des neu erstellten Artikels zurück.
 *
 * @param article - Artikel der erstellt werden soll.
 * @param storeId - ID des Stores
 */
export async function createArticle(article: Article, storeId: string): Promise<string> {
    const newArticleRef = firestore()
        .collection(STORES_COLLECTION+`/${storeId}/`+ARTICLE_COLLECTION)
        .doc();

    await newArticleRef.set({
        articleId : article.articleId,
        name : article.name,
        price : article.price,
        stock : article.stock,
        articleGroup : article.articleGroup,
        storageSpace : article.storageSpace,
        description : article.description
    });
    return newArticleRef.id;
}

/**
 * Gibt alle Artikel eines Stores zurück.
 *
 * @param storeId - ID des Stores
 */
export async function getAllArticles(storeId: string): Promise<Article[]> {
    const articlesRef = firestore()
        .collection(STORES_COLLECTION+`/${storeId}/`+ARTICLE_COLLECTION);
    const articlesSnapshot = await articlesRef.get();
    const articles : Article[] = [];
    if(!articlesSnapshot.empty){
        articlesSnapshot.forEach(doc => {
            const article : Article = doc.data() as Article;
            article.articleDocId = doc.id;
            articles.push(article);
        });
    }
    return articles;
}

/**
 * Gibt einen Artikel anhand der ID zurück.
 *
 * @throws Error wenn der Artikel nicht gefunden wurde.
 *
 * @param articleDocId - Firestore Document ID des Artikels
 * @param storeId - ID des Stores
 */
export async function getArticleById(articleDocId: string, storeId: string): Promise<Article> {
    const articleRef = firestore()
        .collection(STORES_COLLECTION+`/${storeId}/`+ARTICLE_COLLECTION)
        .doc(articleDocId);
    const articleDoc = await articleRef.get();
    if(articleDoc.exists){
        const article : Article = articleDoc.data() as Article;
        article.articleDocId = articleDoc.id;
        return article;
    } else {
        throw new BadRequestError(`Article ${articleDocId} not found`);
    }
}

/**
 * Löscht einen Artikel anhand der ID.
 *
 * @param articleDocId - Firestore Document ID des Artikels
 * @param storeId - ID des Stores
 */
export async function deleteArticle(articleDocId: string, storeId: string) {
    return firestore()
        .collection(STORES_COLLECTION+`/${storeId}/`+ARTICLE_COLLECTION)
        .doc(articleDocId)
        .delete();
}

/**
 * Aktualisiert einen Artikel.
 * Die ID des Artikels muss mit übergeben werden, da der Artikel in einer Subcollection des Stores liegt.
 *
 * throws Error wenn der Artikel nicht gefunden wurde.
 *
 * @param article - Artikel der aktualisiert werden soll.
 * @param storeId - ID des Stores
 */
export async function updateArticle(article: Article, storeId: string) {
    const articleRef = firestore()
        .collection(STORES_COLLECTION+`/${storeId}/`+ARTICLE_COLLECTION)
        .doc(article.articleDocId);
    const articleDoc = await articleRef.get();
    if(articleDoc.exists){
        await articleRef.update({
            articleId : article.articleId,
            name : article.name,
            price : article.price,
            stock : article.stock,
            articleGroup : article.articleGroup,
            storageSpace : article.storageSpace,
            description : article.description
        });
    } else {
        throw new BadRequestError(`Article ${article.articleDocId} // ${article.articleId} not found`);
    }
}