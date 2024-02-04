import logger from "./utils/logger";
import createServer from "./utils/server";
import config from "config";

/**
 * Gibt an auf welchen Port der Server hören soll.
 * @type {number}
 */
const port = config.get<number>("port") || 3030;

// Starten des Servers
const app = createServer();

app.listen(port ,async () => {
    logger.info(`Application listening at http://localhost:${port}`);
});