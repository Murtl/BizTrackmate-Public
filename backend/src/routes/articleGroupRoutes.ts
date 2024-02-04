import {Express} from "express";
import {checkIfUserIsAuthenticatedAndBelongsToStore} from "../middleware/auth/verifyAuthentication";
import {
    createArticleGroupHandler, deleteArticleGroupHandler,
    getAllArticleGroupsHandler,
    getArticleGroupByIdHandler, updateArticleGroupHandler
} from "../controllers/articleGroupController";
import {
    articleGroupSchema,
    articleGroupSchemaForDelete, articleGroupSchemaForGetById,
    articleGroupSchemaForUpdate
} from "../schemas/articleGroupSchema";
import {validateRequestSchema} from "../middleware/validation/validateRequestSchema";

/**
 * Definiert die Routen für die Artikelgruppen.
 *
 * @param app - Die Express-App.
 */
export function articleGroupRoutes(app : Express) {

    app.get('/api/stores/:storeId/articlegroups/:groupDocId',
        articleGroupSchemaForGetById,
        validateRequestSchema,
        checkIfUserIsAuthenticatedAndBelongsToStore,
        getArticleGroupByIdHandler
    );

    app.get('/api/stores/:storeId/articlegroups',
        checkIfUserIsAuthenticatedAndBelongsToStore,
        getAllArticleGroupsHandler

    );

    app.put('/api/stores/:storeId/articlegroups/:groupDocId',
        articleGroupSchema,
        articleGroupSchemaForUpdate,
        validateRequestSchema,
        checkIfUserIsAuthenticatedAndBelongsToStore,
        updateArticleGroupHandler
    );

    app.post('/api/stores/:storeId/articlegroups',
        articleGroupSchema,
        validateRequestSchema,
        checkIfUserIsAuthenticatedAndBelongsToStore,
        createArticleGroupHandler

    );

    app.delete('/api/stores/:storeId/articlegroups/:groupDocId',
        articleGroupSchemaForDelete,
        validateRequestSchema,
        checkIfUserIsAuthenticatedAndBelongsToStore,
        deleteArticleGroupHandler
    );
}