import {ArticleGroup} from "./articleGroup";
import {StorageSpace} from "./storageSpace";

/**
 * Article model
 *
 * @param articleDocId - Firestore document ID
 * @param articleId - ID des Artikels
 * @param name - Name des Artikels
 * @param price - Verkaufspreis des Artikels
 * @param stock - Lagerbestand des Artikels
 * @param articleGroup - Artikelgruppe des Artikels
 * @param storageSpace - Lagerplatz des Artikels
 * @param description - Beschreibung des Artikels (optional)
 */
export type Article = {
    articleDocId : string,
    articleId : string,
    name : string,
    price : number,
    stock : number,
    articleGroup : ArticleGroup,
    storageSpace : StorageSpace,
    description? : string,
}