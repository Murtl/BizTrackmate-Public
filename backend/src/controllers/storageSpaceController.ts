import {Request, Response, NextFunction} from "express";
import {StorageSpace} from "../models/storageSpace";
import {
    createStorageSpace, deleteStorageSpace,
    getAllStorageSpaces,
    getStorageSpaceById,
    updateStorageSpace
} from "../services/storageSpaceService";
import {BadRequestError} from "../middleware/errors/clientErrors";
/**
 * Erstellt einen neuen Lagerplatz. Gibt die ID des neu erstellten Lagerplatzes zurück.
 *
 * @param req - Request Objekt von Express (enthält den Lagerplatz)
 * @param res - Response Objekt von Express (enthält die ID des neu erstellten Lagerplatzes)
 * @param next - Callback Funktion von Express (wird aufgerufen wenn ein Fehler auftritt)
 */
export async function createStorageSpaceHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storageSpace: StorageSpace = req.body as StorageSpace;
    createStorageSpace(storageSpace, req.params.storeId)
        .then((storageSpaceDocId: string) => {
            storageSpace.storageSpaceDocId = storageSpaceDocId;
            res.status(201).send(storageSpace);
        }).catch((error: any) => {
            next(new BadRequestError(error));
        });
}

/**
 * Gibt alle Lagerplätze eines Stores zurück.
 *
 * @param req - Request Objekt von Express (enthält die Store ID)
 * @param res - Response Objekt von Express (enthält die Lagerplätze)
 * @param next - Callback Funktion von Express (wird aufgerufen wenn ein Fehler auftritt)
 */
export async function getAllStorageSpacesHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    getAllStorageSpaces(req.params.storeId)
        .then((storageSpaces: StorageSpace[]) =>{
            res.status(200).send(storageSpaces);
        }).catch((error: any) => {
            next(new BadRequestError(error));
        });
}

/**
 * Gibt einen Lagerplatz anhand der ID zurück.
 *
 * @param req - Request Objekt von Express (enthält die Store ID und die Lagerplatz ID)
 * @param res - Response Objekt von Express (enthält den Lagerplatz)
 * @param next - Callback Funktion von Express (wird aufgerufen wenn ein Fehler auftritt)
 */
export async function getStorageSpaceByIdHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    getStorageSpaceById(req.params.storageSpaceDocId, req.params.storeId)
        .then((storageSpace: StorageSpace) => {
            res.status(200).send(storageSpace);
        }).catch((error: any) => {
            next(new BadRequestError(error));
        });
}

/**
 * Aktualisiert einen Lagerplatz. Gibt den aktualisierten Lagerplatz zurück.
 *
 * @param req - Request Objekt von Express (enthält den Lagerplatz)
 * @param res - Response Objekt von Express (enthält den aktualisierten Lagerplatz)
 * @param next - Callback Funktion von Express (wird aufgerufen wenn ein Fehler auftritt)
 */
export async function updateStorageSpaceHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storageSpace: StorageSpace = req.body as StorageSpace;
    storageSpace.storageSpaceDocId = req.params.storageSpaceDocId;
    updateStorageSpace(storageSpace, req.params.storeId)
        .then(() => {
            res.status(200).send(storageSpace);
        }).catch((error: any) => {
            next(new BadRequestError(error));
        });
}

/**
 * Löscht einen Lagerplatz anhand der ID.
 *
 * @param req - Request Objekt von Express (enthält die Store ID und die Lagerplatz ID)
 * @param res - Response Objekt von Express (enthält den Lagerplatz)
 * @param next - Callback Funktion von Express (wird aufgerufen wenn ein Fehler auftritt)
 */
export async function deleteStorageSpaceHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
    deleteStorageSpace(req.params.storageSpaceDocId, req.params.storeId)
        .then(() => {
            res.status(200).send({msg : "Lagerplatz erfolgreich gelöscht"});
        }).catch((error: any) => {
        next(new BadRequestError(error));
    });
}