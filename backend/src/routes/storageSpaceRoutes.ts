import {Express} from "express";
import {checkIfUserIsAuthenticatedAndBelongsToStore} from "../middleware/auth/verifyAuthentication";
import {
    createStorageSpaceHandler, deleteStorageSpaceHandler,
    getAllStorageSpacesHandler,
    getStorageSpaceByIdHandler, updateStorageSpaceHandler
} from "../controllers/storageSpaceController";
import {
    storageSpaceSchema,
    storageSpaceSchemaForDelete, storageSpaceSchemaForGetById,
    storageSpaceSchemaForUpdate
} from "../schemas/storageSpaceSchema";
import {validateRequestSchema} from "../middleware/validation/validateRequestSchema";

/**
 * Definiert die Routen für die Lagerplätze.
 *
 * @param app - Die Express-App.
 */
export function storageSpaceRoutes(app : Express) {

    app.get('/api/stores/:storeId/storagespaces',
        checkIfUserIsAuthenticatedAndBelongsToStore,
        getAllStorageSpacesHandler
    );

    app.get("/api/stores/:storeId/storagespaces/:storageSpaceDocId",
        storageSpaceSchemaForGetById,
        validateRequestSchema,
        checkIfUserIsAuthenticatedAndBelongsToStore,
        getStorageSpaceByIdHandler
    );

    app.post("/api/stores/:storeId/storagespaces",
        storageSpaceSchema,
        validateRequestSchema,
        checkIfUserIsAuthenticatedAndBelongsToStore,
        createStorageSpaceHandler
    );

    app.put("/api/stores/:storeId/storagespaces/:storageSpaceDocId",
        storageSpaceSchema,
        storageSpaceSchemaForUpdate,
        validateRequestSchema,
        checkIfUserIsAuthenticatedAndBelongsToStore,
        updateStorageSpaceHandler
    );

    app.delete("/api/stores/:storeId/storagespaces/:storageSpaceDocId",
        storageSpaceSchemaForDelete,
        validateRequestSchema,
        checkIfUserIsAuthenticatedAndBelongsToStore,
        deleteStorageSpaceHandler
    );
}