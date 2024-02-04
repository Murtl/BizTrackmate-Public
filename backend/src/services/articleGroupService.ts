import {ArticleGroup} from "../models/articleGroup";
import {ARTICLE_GROUP_COLLECTION, STORES_COLLECTION} from "../utils/consts";
import {firestore} from "firebase-admin";

/**
 * Erstellt eine neue Artikelgruppe in Firestore.
 * Gibt die ID der neu erstellten Artikelgruppe zurück.
 *
 * @param articleGroup - Artikelgruppe die erstellt werden soll.
 * @param storeId - ID des Stores der Artikelgruppe
 */
export async function createArticleGroup(articleGroup : ArticleGroup, storeId : string): Promise<string> {
    const newArticleGroupRef = firestore()
        .collection(STORES_COLLECTION+`/${storeId}/`+ARTICLE_GROUP_COLLECTION)
        .doc();
    await newArticleGroupRef.set({
        groupId : articleGroup.groupId,
        groupName : articleGroup.groupName,
        groupType : articleGroup.groupType,
        currentStock : articleGroup.currentStock,
        description : articleGroup.description
    });
    return newArticleGroupRef.id;
}

/**
 * Gibt alle Artikelgruppen eines Stores zurück.
 *
 * @param storeId - ID des Stores
 */
export async function getAllArticleGroups(storeId : string) : Promise<ArticleGroup[]> {
    const articleGroupsRef = firestore()
        .collection(STORES_COLLECTION+`/${storeId}/`+ARTICLE_GROUP_COLLECTION);
    const articleGroupsSnapshot = await articleGroupsRef.get();
    const articleGroups : ArticleGroup[] = [];
    if(!articleGroupsSnapshot.empty){
        articleGroupsSnapshot.forEach(doc => {
            const articleGroup : ArticleGroup = doc.data() as ArticleGroup;
            articleGroup.groupDocId = doc.id;
            articleGroups.push(articleGroup);
        });
    }
    return articleGroups;
}

/**
 * Gibt eine Artikelgruppe anhand der ID zurück.
 *
 * @throws Error wenn die Artikelgruppe nicht gefunden wurde.
 *
 * @param articleGroupDocId - Firestore Document ID der Artikelgruppe
 * @param storeId - ID des Stores
 */
export async function getArticleGroupById(articleGroupDocId : string, storeId : string): Promise<ArticleGroup>{
    const articleGroupRef = firestore()
        .collection(STORES_COLLECTION+`/${storeId}/`+ARTICLE_GROUP_COLLECTION)
        .doc(articleGroupDocId);
    const articleGroupDoc = await articleGroupRef.get();
    if(articleGroupDoc.exists){
        const articleGroup : ArticleGroup = articleGroupDoc.data() as ArticleGroup;
        articleGroup.groupDocId = articleGroupDoc.id;
        return articleGroup;
    } else {
        throw new Error(`ArticleGroup ${articleGroupDocId} not found`);
    }
}

/**
 * Löscht eine Artikelgruppe anhand der ID.
 *
 * @param articleGroupDocId - Firestore Document ID der Artikelgruppe
 * @param storeId - ID des Stores
 */
export async function deleteArticleGroup(articleGroupDocId : string, storeId : string) {
    return  firestore()
        .collection(STORES_COLLECTION+`/${storeId}/`+ARTICLE_GROUP_COLLECTION)
        .doc(articleGroupDocId)
        .delete();
}

/**
 * Aktualisiert eine Artikelgruppe.
 * Die ID des Stores muss mit übergeben werden, da die Artikelgruppe in einer Subcollection des Stores liegt.
 *
 * @param articleGroup - Artikelgruppe mit ID der Firestore document ID
 * @param storeId - ID des Stores
 */
export async function updateArticleGroup(articleGroup : ArticleGroup, storeId : string) {
    const articleGroupRef = firestore()
        .collection(STORES_COLLECTION+`/${storeId}/`+ARTICLE_GROUP_COLLECTION)
        .doc(articleGroup.groupDocId);
    const articleGroupDoc = await articleGroupRef.get();
    if(articleGroupDoc.exists){
        return await articleGroupRef.update({
            groupId : articleGroup.groupId,
            groupName : articleGroup.groupName,
            groupType : articleGroup.groupType,
            currentStock : articleGroup.currentStock,
            description : articleGroup.description
        });
    } else {
        throw new Error(`ArticleGroup ${articleGroup.groupDocId} // ${articleGroup.groupId} not found`);
    }
}
