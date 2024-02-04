/**
 * ArticleGroup model
 *
 * @param groupDocId - Firestore document ID
 * @param groupId - ID der Artikelgruppe
 * @param groupName - Name der Artikelgruppe
 * @param groupType - Typ der Artikelgruppe
 * @param currentStock - Aktueller Lagerbestand der Artikelgruppe
 * @param description - Beschreibung der Artikelgruppe (optional)
 */
export type ArticleGroup = {
    groupDocId : string,
    groupId : string,
    groupName : string,
    groupType : string,
    currentStock : number,
    description? : string,
}