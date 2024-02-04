import {NextFunction, Request, Response} from "express";
import firebase from "../../../firebase";
import {UnauthorizedError} from "../errors/clientErrors";

/**
 * Überprüft, ob im Header des Requests ein Bearer-Token hinterlegt ist oder nicht.
 * Sollte eins existieren, wird eine Anfrage an Firebase gesendet um das Token zu verifizieren.
 * Ist dies erfolgreich, erhält man ein UserInfo-Objekt zurück. Die UID wird dann in den Request-Body geschrieben und
 * steht dann anderen Methoden zur Verfügung.
 *
 * Sollte kein Token existieren und nicht verifiziert werden können, wird ein entsprechender Fehler weitergeleitet.
 *
 * @param req - Die Anfrage des Nutzers
 * @param res - Die Antwort des Servers
 * @param next - Die nächste Middleware
 */
export function checkIfUserIsAuthenticated(req : Request, res : Response, next : NextFunction){
    getBearerToken(req, res, async () => {
       if(req.body.authToken) {
              firebase
                .auth()
                .verifyIdToken(req.body.authToken)
                .then(userInfo => {
                     req.body.uid = userInfo.uid;
                     next();
                })
                .catch((error : any) => {
                    next(new UnauthorizedError(error));
                });
       } else {
           next(new UnauthorizedError("Missing or wrong token!"));
       }
    });
}

/**
 * Überprüft, ob der Nutzer zu dem Store gehört, für den er eine Anfrage sendet.
 * Dafür wird das Token verifiziert und die StoreId mit der StoreId aus dem Request-Parameter verglichen.
 * Sollte dies erfolgreich sein, wird die UID in den Request-Body geschrieben und steht dann anderen Methoden zur Verfügung.
 *
 * Sollte die StoreId nicht übereinstimmen, wird ein entsprechender Fehler weitergeleitet.
 *
 * @param req - Die Anfrage des Nutzers
 * @param res - Die Antwort des Servers
 * @param next - Die nächste Middleware
 */
export function checkIfUserIsAuthenticatedAndBelongsToStore(req : Request, res : Response, next : NextFunction) {
    getBearerToken(req, res, async () => {
        if(req.body.authToken) {
            firebase
                .auth()
                .verifyIdToken(req.body.authToken)
                .then(userInfo => {
                    if(userInfo.storeId === req.params.storeId){
                        req.body.uid = userInfo.uid;
                        next();
                    } else {
                        next(new UnauthorizedError("Unauthorized!"));
                    }
                })
                .catch((error : any) => {
                    next(new UnauthorizedError(error));
                });
        } else {
            next(new UnauthorizedError("Missing oder wrong token!"));
        }
    });
}

/**
 * Überprüft, ob im Header des Requests ein Bearer-Token hinterlegt ist oder nicht.
 * @param req - Die Anfrage des Nutzers
 * @param res - Die Antwort des Servers
 * @param next - Die nächste Middleware
 */
const getBearerToken = (req: Request<{},{},{authToken : string | null},{},{}>, res : Response, next : NextFunction) => {
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        req.body.authToken = req.headers.authorization.split(' ')[1];
    } else {
        req.body.authToken = null;
    }
    next();
}

/**
 * Einfache Methode um zu überprüfen, ob der Nutzer autorisiert ist oder nicht.
 *
 * @param req - Die Anfrage des Nutzers
 * @param res - Die Antwort des Servers
 * @param next - Die nächste Middleware
 */
export function authorizationHandler(req: Request, res : Response, next : NextFunction) {
    res.status(200).json({ "msg" : "You are authorized!" });
}