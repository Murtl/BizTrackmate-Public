/**
 * StorageSpace model
 *
 * @param storageSpaceDocId - Firestore document ID
 * @param storageSpaceId - ID des Lagerplatzes
 * @param storageSpaceName - Name des Lagerplatzes
 * @param storageSpaceType - Typ des Lagerplatzes
 * @param description - Beschreibung des Lagerplatzes (optional)
 */
export type StorageSpace = {
    storageSpaceDocId : string,
    storageSpaceId : string,
    storageSpaceName : string,
    storageSpaceType : string,
    description? : string,
}