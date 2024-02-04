import {Request, Response,NextFunction} from "express";
import {Transaction} from "../models/transaction";
import {createTransaction, deleteTransaction, getAllTransactions} from "../services/transactionService";
import {BadRequestError} from "../middleware/errors/clientErrors";

/**
 * Erstellt eine neue Transaktion. Gibt die ID des neu erstellten Transaktion zurück.
 *
 * @param req - Request Objekt von Express (enthält den Transaktion)
 * @param res - Response Objekt von Express (enthält die ID des neu erstellten Transaktion)
 * @param next - Callback Funktion von Express (wird aufgerufen wenn ein Fehler auftritt)
 */
export async function createTransactionHandler(req : Request, res : Response, next : NextFunction) : Promise<void> {
    const transaction : Transaction = req.body as Transaction;
    createTransaction(transaction, req.params.storeId)
        .then((transactionDocId : string) => {
            transaction.transactionDocId = transactionDocId;
            res.status(201).send(transaction);
        }).catch((error : any) => {
            next(new BadRequestError(error));
        });
}

/**
 * Gibt alle Transaktionen eines Stores zurück.
 *
 * @param req - Request Objekt von Express (enthält die Store ID)
 * @param res - Response Objekt von Express (enthält die Transaktionen)
 * @param next - Callback Funktion von Express (wird aufgerufen wenn ein Fehler auftritt)
 */
export async function getAllTransactionsHandler(req : Request, res : Response, next : NextFunction) : Promise<void> {
    getAllTransactions(req.params.storeId)
        .then((transactions : Transaction[]) => {
            res.status(200).send(transactions);
        }).catch((error : any) => {
            next(new BadRequestError(error));
        });
}

/**
 * Löscht eine Transaktion anhand der ID.
 *
 * @param req - Request Objekt von Express (enthält die Store ID und die Transaktions ID)
 * @param res - Response Objekt von Express (enthält die ID des gelöschten Transaktion)
 * @param next - Callback Funktion von Express (wird aufgerufen wenn ein Fehler auftritt)
 */
export async function deleteTransactionHandler(req : Request, res : Response, next : NextFunction) : Promise<void> {
    deleteTransaction(req.params.transactionDocId, req.params.storeId)
        .then(() => {
            res.status(200).send({message: "Transaktion wurde gelöscht"});
        }).catch((error : any) => {
            next(new BadRequestError(error));
        });
}