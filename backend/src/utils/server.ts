import express from "express";
import userRoutes from "../routes/userRoutes";
import {errorLogger, errorResponder} from "../middleware/errors/errorHandler";
import cors from "cors";
import {articleGroupRoutes} from "../routes/articleGroupRoutes";
import {storageSpaceRoutes} from "../routes/storageSpaceRoutes";
import {articleRoutes} from "../routes/articleRoutes";
import {transactionRoutes} from "../routes/transactionRoutes";

/**
 * Erzeugt den Express-Server.
 *
 * @return {Express} Der Express-Server.
 */
function createServer() {
    const app = express();

    // Middleware
    app.use(express.json());
    app.use(cors({
        origin: "http://localhost:5173",
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Routes
    userRoutes(app);
    articleGroupRoutes(app);
    storageSpaceRoutes(app);
    articleRoutes(app);
    transactionRoutes(app);

    // Error Handling
    if (app.get("env") !== "test"){
        app.use(errorLogger); //Fehler sollen nur geloggt werden, wenn keine Tests ausgeführt werden.
    }
    app.use(errorResponder);

    return app;
}

export default createServer;