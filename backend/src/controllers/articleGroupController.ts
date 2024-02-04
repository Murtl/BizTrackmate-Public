import {NextFunction, Request, Response} from "express";
import {
    createArticleGroup,
    deleteArticleGroup,
    getAllArticleGroups,
    getArticleGroupById, updateArticleGroup
} from "../services/articleGroupService";
import {ArticleGroup} from "../models/articleGroup";
import {BadRequestError} from "../middleware/errors/clientErrors";
import logger from "../utils/logger";

/**
 * Erstellt eine neue Artikelgruppe. Gibt die ID der neu erstellten Artikelgruppe zurück.
 *
 * @param req - Request Objekt von Express (enthält die Artikelgruppe)
 * @param res - Response Objekt von Express (enthält die ID der neu erstellten Artikelgruppe)
 * @param next - Callback Funktion von Express (wird aufgerufen wenn ein Fehler auftritt)
 */
export async function createArticleGroupHandler(req: Request, res: Response, next: NextFunction) : Promise<void> {
    const articleGroup : ArticleGroup = req.body as ArticleGroup;
    createArticleGroup(articleGroup, req.params.storeId).then((groupDocId : string) => {
        articleGroup.groupDocId = groupDocId;
        res.status(201).send(articleGroup);
    }).catch((error : any) => {
        next(new BadRequestError(error));
    });
}

/**
 * Gibt alle Artikelgruppen eines Stores zurück.
 *
 * @param req - Request Objekt von Express (enthält die Store ID)
 * @param res - Response Objekt von Express (enthält die Artikelgruppen)
 * @param next - Callback Funktion von Express (wird aufgerufen wenn ein Fehler auftritt)
 */
export async function getAllArticleGroupsHandler(req: Request, res: Response, next: NextFunction) : Promise<void> {
    getAllArticleGroups(req.params.storeId)
        .then((articleGroups : ArticleGroup[]) => {
            res.status(200).send(articleGroups);
        }).catch((error : any) => {
            next(new BadRequestError(error));
        });
}

/**
 * Gibt eine Artikelgruppe anhand der ID zurück.
 *
 * @param req - Request Objekt von Express (enthält die Store ID und die Artikelgruppen ID)
 * @param res - Response Objekt von Express (enthält die Artikelgruppe)
 * @param next - Callback Funktion von Express (wird aufgerufen wenn ein Fehler auftritt)
 */
export async function getArticleGroupByIdHandler(req: Request, res: Response, next: NextFunction) : Promise<void> {
    getArticleGroupById(req.params.groupDocId, req.params.storeId)
        .then((articleGroup : ArticleGroup) => {
            res.status(200).send(articleGroup);
        }).catch((error : any) => {
            next(new BadRequestError(error));
        });
}

/**
 * Löscht eine Artikelgruppe anhand der ID.
 *
 * @param req - Request Objekt von Express (enthält die Store ID und die Artikelgruppen ID)
 * @param res - Response Objekt von Express (enthält die ID der gelöschten Artikelgruppe)
 * @param next - Callback Funktion von Express (wird aufgerufen wenn ein Fehler auftritt)
 */
export async function deleteArticleGroupHandler(req: Request, res: Response, next: NextFunction) : Promise<void> {
    deleteArticleGroup(req.params.groupDocId, req.params.storeId)
        .then(() => {
            res.status(200).send({msg : "Artikelgruppe erfolgreich gelöscht"});
        }).catch((error : any) => {
            next(new BadRequestError(error));
        });
}

/**
 * Aktualisiert eine Artikelgruppe. Gibt die aktualisierte Artikelgruppe zurück.
 *
 * @param req - Request Objekt von Express (enthält die Store ID und die Artikelgruppen ID)
 * @param res - Response Objekt von Express (enthält die aktualisierte Artikelgruppe)
 * @param next - Callback Funktion von Express (wird aufgerufen wenn ein Fehler auftritt)
 */
export async function updateArticleGroupHandler(req: Request, res: Response, next: NextFunction) : Promise<void> {
    const articleGroup : ArticleGroup = req.body as ArticleGroup;
    articleGroup.groupDocId = req.params.groupDocId;
    updateArticleGroup(articleGroup, req.params.storeId)
        .then(() => {
            res.status(200).send(articleGroup);
        }).catch((error : any) => {
            next(new BadRequestError(error));
        });
}

