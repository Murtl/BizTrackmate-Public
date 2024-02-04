import {Express} from "express";
import {validateRequestSchema} from "../middleware/validation/validateRequestSchema";
import {checkIfUserIsAuthenticatedAndBelongsToStore} from "../middleware/auth/verifyAuthentication";
import {
    createTransactionHandler,
    deleteTransactionHandler,
    getAllTransactionsHandler
} from "../controllers/transactionController";
import {transactionSchema, transactionSchemaForDelete} from "../schemas/transactionSchema";

export function transactionRoutes(app : Express) {

    app.get("/api/stores/:storeId/transactions",
        checkIfUserIsAuthenticatedAndBelongsToStore,
        getAllTransactionsHandler
    );

    app.post("/api/stores/:storeId/transactions",
        transactionSchema,
        validateRequestSchema,
        checkIfUserIsAuthenticatedAndBelongsToStore,
        createTransactionHandler
    );

    app.delete("/api/stores/:storeId/transactions/:transactionDocId",
        transactionSchemaForDelete,
        validateRequestSchema,
        checkIfUserIsAuthenticatedAndBelongsToStore,
        deleteTransactionHandler
    );

}