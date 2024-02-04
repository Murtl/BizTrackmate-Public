import {Article} from "./article";

/**
 * TransactionItem model
 *
 * @param quantity - Anzahl des Artikels
 * @param price - EK Preis des Artikels
 * @param article - Artikel
 */
export type TransactionItem = {
    quantity : number,
    price : number,
    article : Article
}

/**
 * Transaction model
 *
 * @param transactionDocId - Firestore document ID
 * @param transactionId - ID der Transaktion
 * @param transactionType - Typ der Transaktion (Einlagerung / Auslagerung)
 * @param day - Tag der Transaktion
 * @param month - Monat der Transaktion
 * @param year - Jahr der Transaktion
 * @param items - Artikel der Transaktion
 * @param total_amount - Gesamtbetrag der Transaktion
 * @param description - Beschreibung der Transaktion (optional)
 */
export type Transaction = {
    transactionDocId : string,
    transactionId : string,
    transactionType : string,
    day : string,
    month : string,
    year : string,
    items : TransactionItem[],
    total_amount : number,
    description? : string,
}