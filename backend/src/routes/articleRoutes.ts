import {Express} from "express";
import {checkIfUserIsAuthenticatedAndBelongsToStore} from "../middleware/auth/verifyAuthentication";
import {
    createArticleHandler, deleteArticleHandler,
    getAllArticlesHandler,
    getArticleByIdHandler,
    updateArticleHandler
} from "../controllers/articleContoller";
import {
    articleSchema,
    articleSchemaForDelete,
    articleSchemaForGetById,
    articleSchemaForUpdate
} from "../schemas/articleSchema";
import {validateRequestSchema} from "../middleware/validation/validateRequestSchema";
import {storageSpaceSchema} from "../schemas/storageSpaceSchema";
import {articleGroupSchema} from "../schemas/articleGroupSchema";


/**
 * Definiert die Routen für die Artikel.
 *
 * @param app - Die Express-App.
 */
export function articleRoutes(app : Express) {

    app.get('/api/stores/:storeId/articles',
        checkIfUserIsAuthenticatedAndBelongsToStore,
        getAllArticlesHandler
    );

    app.get('/api/stores/:storeId/articles/:articleDocId',
        articleSchemaForGetById,
        validateRequestSchema,
        checkIfUserIsAuthenticatedAndBelongsToStore,
        getArticleByIdHandler
    );

    app.post('/api/stores/:storeId/articles',
        articleSchema,
        validateRequestSchema,
        checkIfUserIsAuthenticatedAndBelongsToStore,
        createArticleHandler
    );

    app.put('/api/stores/:storeId/articles/:articleDocId',
        articleSchema,
        articleSchemaForUpdate,
        validateRequestSchema,
        checkIfUserIsAuthenticatedAndBelongsToStore,
        updateArticleHandler
    );

    app.delete('/api/stores/:storeId/articles/:articleDocId',
        articleSchemaForDelete,
        validateRequestSchema,
        checkIfUserIsAuthenticatedAndBelongsToStore,
        deleteArticleHandler
    );



}