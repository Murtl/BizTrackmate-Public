import {STORES_COLLECTION, TRANSACTION_COLLECTION} from "../utils/consts";
import {firestore} from "firebase-admin";
import {Transaction} from "../models/transaction";
import logger from "../utils/logger";

/**
 * Erstellt eine neue Transaktion in Firestore. Gibt die ID der neu erstellten Transaktion zurück.
 *
 * @param transaction - Transaktion die erstellt werden soll.
 * @param storeId - ID des Stores
 */
export async function createTransaction(transaction : Transaction, storeId : string) : Promise<string> {
    const newTransactionRef = firestore()
        .collection(STORES_COLLECTION+`/${storeId}/`+TRANSACTION_COLLECTION)
        .doc();
    await newTransactionRef.set({
        transactionId : transaction.transactionId,
        transactionType : transaction.transactionType,
        day : transaction.day,
        month : transaction.month,
        year : transaction.year,
        items : transaction.items,
        total_amount : transaction.total_amount,
        description : transaction.description
    });
    return newTransactionRef.id;
}

/**
 * Gibt alle Transationen eines Stores zurück.
 *
 * @param storeId - ID des Stores
 */
export async function getAllTransactions(storeId : string) : Promise<Transaction[]> {
    const transactionRef = firestore()
        .collection(STORES_COLLECTION+`/${storeId}/`+TRANSACTION_COLLECTION);
    const transactionSnapshot = await transactionRef.get();
    const transactions : Transaction[] = [];
    if(!transactionSnapshot.empty){
        transactionSnapshot.forEach(doc => {
            const transaction : any = doc.data();
            transaction.transactionDocId = doc.id;
            transactions.push(transaction);
        });
    }
    return transactions;
}

/**
 * Löscht eine Transaktion anhand der ID.
 *
 * @param transactionDocId - Firestore Document ID der Transaktion
 * @param storeId - ID des Stores
 */
export async function deleteTransaction(transactionDocId : string, storeId : string) {
    return  firestore()
        .collection(STORES_COLLECTION+`/${storeId}/`+TRANSACTION_COLLECTION)
        .doc(transactionDocId)
        .delete();
}