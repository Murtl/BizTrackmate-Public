import {NextFunction, Request, Response} from "express";
import logger from "../../utils/logger";
import {CustomError} from "./customError";
import {InternalServerError} from "./serverErrors";

/**
 * Nimmt den Fehler und sendet diesen als Response an den Client zurück.
 * Inhalt (Message), StatusCode und zusätzliche Informationen werden dabei mit übertragen. Diese befinden sich innerhalb des
 * jeweiligen Errors.
 *
 * Sollte kein abgeleiteter Error aufteten, wird ein InternalServerError 500 geworfen.
 *
 * @param err - Der aufgetretene Fehler
 * @param req - Die Anfrage des Nutzers (wird nicht verwendet)
 * @param res - Die Antwort des Servers (wird nicht verwendet)
 * @param next - Die nächste Middleware
 */
export function errorResponder(err : TypeError | CustomError, req : Request, res : Response, next : NextFunction){
    let customError = err;
    if (!(err instanceof CustomError)){
        customError = new InternalServerError(err, "Something went terribly wrong!");
    }
    res.status((customError as CustomError).status).send(customError);
}

/**
 * Middleware um auftetende Fehler zu loggen.
 * Leitet den Fehler anschließend mit der next-Function an die nächste Middleware weiter.
 *
 * @param err - Der aufgetretene Fehler
 * @param req - Die Anfrage des Nutzers (wird nicht verwendet)
 * @param res - Die Antwort des Servers (wird nicht verwendet)
 * @param next - Die nächste Middleware
 */
export function errorLogger(err : TypeError | CustomError, req : Request, res : Response, next : NextFunction){
    logger.error(err);
    next(err);
}