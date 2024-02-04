import {Express} from "express";
import {validateRequestSchema} from "../middleware/validation/validateRequestSchema";
import {authorizationHandler, checkIfUserIsAuthenticated} from "../middleware/auth/verifyAuthentication";
import {userSchema} from "../schemas/userSchema";
import {createUserAndStoreHandler, getUserInformationHandler} from "../controllers/userController";
import {storeSchema} from "../schemas/storeSchema";
import {getUserInformation} from "../services/userService";

/**
 * Hier sind alle REST-Endpunkte beschrieben, die sich auf den User beziehen z.B. Erstellen/Bearbeiten/Löschen.
 *
 * @param app - Express App Instanz
 */
function userRoutes(app : Express) {

    /**
     * Endpoint für die Erstellung eines neuen Nutzers und dessen Store.
     * Die Anfrage muss den Nutzer und den Store beinhalten.
     * Der Nutzer wird in Firebase angelegt und der Store in Firestore.
     * Wenn der Nutzer erfolgreich angelegt wurde, wird ein 201-Created HttpStatusCode an den User gesendet.
     */
    app.post("/api/users",
        userSchema,
        storeSchema,
        validateRequestSchema,
        createUserAndStoreHandler);

    app.get("/api/users",
        checkIfUserIsAuthenticated,
        getUserInformationHandler);
}

export default userRoutes;