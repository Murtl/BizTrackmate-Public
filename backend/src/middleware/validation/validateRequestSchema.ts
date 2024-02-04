import {NextFunction, Request, Response} from "express";
import { validationResult } from "express-validator";
import {BadRequestError} from "../errors/clientErrors";

/**
 * Wird von express-validator benutzt um festzustellen, ob die erwarteten Daten (Schema) vom Nutzer an die REST-Schnittstelle
 * geschickt wurden.
 *
 * Diese Methode überprüft ob während der Validierung gegen das Schema ein Fehler aufgetreten ist.
 * Sollte der Request dem Schema nicht entsprechen wird ein BadRequestError zurückgegeben.
 *
 * @param req - Die Anfrage des Nutzers (wird hier nicht benutzt)
 * @param res - Die Antwort des Servers (wird hier nicht benutzt)
 * @param next - Die nächste Middleware
 */
export function validateRequestSchema(req: Request, res: Response, next : NextFunction) {
    const error = validationResult(req);
    if (!error.isEmpty()){
        next(new BadRequestError(error.array(), "Validation failed!"));
    }
    next();
}