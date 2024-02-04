import {NextFunction, Request, Response} from "express";
import {Article} from "../models/article";
import {createArticle, deleteArticle, getAllArticles, getArticleById, updateArticle} from "../services/articleService";
import {BadRequestError} from "../middleware/errors/clientErrors";


/**
 * Erstellt einen neuen Artikel. Gibt die ID des neu erstellten Artikels zurück.
 *
 * @param req - Request Objekt von Express (enthält den Artikel)
 * @param res - Response Objekt von Express (enthält die ID des neu erstellten Artikels)
 * @param next - Callback Funktion von Express (wird aufgerufen wenn ein Fehler auftritt)
 */
export async function createArticleHandler(req : Request, res : Response, next : NextFunction) : Promise<void> {
    const article: Article = req.body as Article;
    createArticle(article, req.params.storeId)
        .then((articleDocId : string) => {
            article.articleDocId = articleDocId;
            res.status(201).send(article);
        }).catch((error : any) => {
            next(new BadRequestError(error));
        });
}

/**
 * Gibt alle Artikel eines Stores zurück.
 *
 * @param req - Request Objekt von Express (enthält die Store ID)
 * @param res - Response Objekt von Express (enthält die Artikel)
 * @param next - Callback Funktion von Express (wird aufgerufen wenn ein Fehler auftritt)
 */
export async function getAllArticlesHandler(req : Request, res : Response, next : NextFunction) : Promise<void> {
    getAllArticles(req.params.storeId)
        .then((articles : Article[]) => {
            res.status(200).send(articles);
        }).catch((error : any) => {
            next(new BadRequestError(error));
        });
}

/**
 * Gibt einen Artikel anhand der ID zurück.
 *
 * @param req - Request Objekt von Express (enthält die Store ID und die Artikel ID)
 * @param res - Response Objekt von Express (enthält den Artikel)
 * @param next - Callback Funktion von Express (wird aufgerufen wenn ein Fehler auftritt)
 */
export async function getArticleByIdHandler(req : Request, res : Response, next : NextFunction) : Promise<void> {
    getArticleById(req.params.articleDocId, req.params.storeId)
        .then((article : Article) => {
            res.status(200).send(article);
        } ).catch((error : any) => {
            next(new BadRequestError(error));
        });
}

/**
 * Aktualisiert einen Artikel. Gibt den aktualisierten Artikel zurück.
 *
 * @param req - Request Objekt von Express (enthält den Artikel)
 * @param res - Response Objekt von Express (enthält den aktualisierten Artikel)
 * @param next - Callback Funktion von Express (wird aufgerufen wenn ein Fehler auftritt)
 */
export async function updateArticleHandler(req : Request, res : Response, next : NextFunction) : Promise<void> {
    const article: Article = req.body as Article;
    article.articleDocId = req.params.articleDocId;
    updateArticle(article, req.params.storeId)
        .then(() => {
            res.status(200).send(article);
        }).catch((error : any) => {
            next(new BadRequestError(error));
        });
}

/**
 * Löscht einen Artikel anhand der ID.
 *
 * @param req - Request Objekt von Express (enthält die Store ID und die Artikel ID)
 * @param res - Response Objekt von Express (enthält eine Erfolgsmeldung)
 * @param next - Callback Funktion von Express (wird aufgerufen wenn ein Fehler auftritt)
 */
export async function deleteArticleHandler(req : Request, res : Response, next : NextFunction) : Promise<void> {
    deleteArticle(req.params.articleDocId, req.params.storeId)
        .then(() => {
            res.status(200).send({msg : "Artikel wurde gelöscht"});
        }).catch((error : any) => {
            next(new BadRequestError(error));
        });
}