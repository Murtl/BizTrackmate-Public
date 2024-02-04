import {NextFunction, Request, Response} from "express";
import {User, UserResponse} from "../models/userModel";
import {
    applyStoreIdToUser,
    createUser,
    createUserAndStoreInFirestore,
    getUserInformation
} from "../services/userService";
import {BadRequestError} from "../middleware/errors/clientErrors";
import {Store} from "../models/storeModel";

/**
 * Das ist der Handler für das Anlegen eines neuen Nutzers in Firebase.
 * Das eigentliche Anlegen passiert dann im userService.ts.
 * Wenn der Nutzer erfolgreich angelegt wurde, wird ein 201-Created HttpStatusCode an den User gesendet.
 * Anderenfalls wird eine Fehlermeldung an die nächste Middleware weitergegeben.
 *
 *
 * @param req  - Die Anfrage des Nutzers
 * @param res  - Die Antwort des Servers
 * @param next - Die nächste Middleware
 */
export async function createUserAndStoreHandler(req: Request, res: Response, next : NextFunction) {
    const user : User = req.body;
    try {
        const userRecord = await createUser(user);
        const store : Store = req.body;
        const userResponse : UserResponse = await createUserAndStoreInFirestore(userRecord, store);
        applyStoreIdToUser(userResponse)
            .then(() => {
                res.status(201).send(userResponse);
            })
            .catch((error: any) => {
                next(new BadRequestError(error));
            });
    } catch (error) {
        next(new BadRequestError(error,"User could not be created!"));
    }
}

/**
 * Gibt die Informationen eines Nutzers zurück. Die Informationen werden aus der Firestore-Datenbank geholt.
 * Wenn der Nutzer erfolgreich angelegt wurde, wird ein 200-OK HttpStatusCode an den User gesendet.
 * Anderenfalls wird eine Fehlermeldung an die nächste Middleware weitergegeben.
 *
 *
 * @param req - Die Anfrage des Nutzers
 * @param res - Die Antwort des Servers
 * @param next - Die nächste Middleware
 */
export async function getUserInformationHandler(req : Request, res: Response, next : NextFunction) {
  getUserInformation(req.body.uid)
      .then((user : UserResponse) => {
          res.status(200).send(user);
      }).catch((error : any) => {
          next(new BadRequestError(error));
      });
}