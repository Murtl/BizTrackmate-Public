import {StorageSpace} from "../models/storageSpace";
import {firestore} from "firebase-admin";
import {STORAGE_SPACE_COLLECTION, STORES_COLLECTION} from "../utils/consts";
import {BadRequestError} from "../middleware/errors/clientErrors";

/**
 * Erstellt einen neuen Lagerplatz in Firestore.
 * Gibt die ID des neu erstellten Lagerplatzes zurück.
 *
 * @param storageSpace - Lagerplatz der erstellt werden soll.
 * @param storeId - ID des Stores
 */
export async function createStorageSpace(storageSpace: StorageSpace, storeId : string): Promise<string> {
    const newStorageSpaceRef = firestore()
        .collection(STORES_COLLECTION+`/${storeId}/`+STORAGE_SPACE_COLLECTION)
        .doc();
    await newStorageSpaceRef.set({
        storageSpaceId : storageSpace.storageSpaceId,
        storageSpaceName : storageSpace.storageSpaceName,
        storageSpaceType : storageSpace.storageSpaceType,
        description : storageSpace.description
    });
    return newStorageSpaceRef.id;
}

/**
 * Gibt alle Lagerplätze eines Stores zurück.
 *
 * @param storeId - ID des Stores
 */
export async function getAllStorageSpaces(storeId : string): Promise<StorageSpace[]> {
    const storageSpacesRef = firestore()
        .collection(STORES_COLLECTION+`/${storeId}/`+STORAGE_SPACE_COLLECTION);
    const storageSpacesSnapshot = await storageSpacesRef.get();
    const storageSpaces : StorageSpace[] = [];
    if(!storageSpacesSnapshot.empty){
        storageSpacesSnapshot.forEach(doc => {
            const storageSpace : StorageSpace = doc.data() as StorageSpace;
            storageSpace.storageSpaceDocId = doc.id;
            storageSpaces.push(storageSpace);
        });
    }
    return storageSpaces;
}

/**
 * Gibt einen Lagerplatz anhand der ID zurück.
 *
 * @throws Error wenn der Lagerplatz nicht gefunden wurde.
 *
 * @param storageSpaceDocId - Firestore Document ID des Lagerplatzes
 * @param storeId - ID des Stores
 */
export async function getStorageSpaceById(storageSpaceDocId : string, storeId : string): Promise<StorageSpace> {
    const storageSpaceRef = firestore()
        .collection(STORES_COLLECTION+`/${storeId}/`+STORAGE_SPACE_COLLECTION)
        .doc(storageSpaceDocId);
    const storageSpaceDoc = await storageSpaceRef.get();
    if(storageSpaceDoc.exists){
        const storageSpace : StorageSpace = storageSpaceDoc.data() as StorageSpace;
        storageSpace.storageSpaceDocId = storageSpaceDoc.id;
        return storageSpace;
    } else {
        throw new Error(`StorageSpace ${storageSpaceDocId} not found`);
    }
}

/**
 * Löscht einen Lagerplatz anhand der ID.
 *
 * @param storageSpaceDocId - Firestore Document ID des Lagerplatzes
 * @param storeId - ID des Stores
 */
export async function deleteStorageSpace(storageSpaceDocId : string, storeId : string) {
    return firestore()
        .collection(STORES_COLLECTION+`/${storeId}/`+STORAGE_SPACE_COLLECTION)
        .doc(storageSpaceDocId)
        .delete();
}

/**
 * Aktualisiert einen Lagerplatz.
 * Die ID des Stores muss mit übergeben werden, da die Lagerplätze in einer Subcollection des Stores liegen.
 *
 * @throws Error wenn der Lagerplatz nicht gefunden wurde.
 *
 * @param storageSpace - Lagerplatz der aktualisiert werden soll.
 * @param storeId - ID des Stores
 */
export async function updateStorageSpace(storageSpace: StorageSpace, storeId : string) {
    const storageSpaceRef = firestore()
        .collection(STORES_COLLECTION+`/${storeId}/`+STORAGE_SPACE_COLLECTION)
        .doc(storageSpace.storageSpaceDocId);
    const storageSpaceDoc = await storageSpaceRef.get();
    if(storageSpaceDoc.exists){
        await storageSpaceRef.update({
            storageSpaceId : storageSpace.storageSpaceId,
            storageSpaceName : storageSpace.storageSpaceName,
            storageSpaceType : storageSpace.storageSpaceType,
            description : storageSpace.description
        });
    } else {
        throw new BadRequestError(`StorageSpace ${storageSpace.storageSpaceDocId} // ${storageSpace.storageSpaceId} not found`);
    }
}