import pino from "pino";
import dayjs from "dayjs";

/**
 * Erzeugt einen Logger, welcher anstelle von console.log verwendet wird.
 * Dieser lässt zentral konfigurieren und die Ausgabe sieht besser/eindeutiger aus.
 *
 */
const logger = pino({
    transport : {
        target : "pino-pretty",
        options : {
            colorize: true
        }
    },
    timestamp: () => `,"time":"${dayjs().format()}"`,
})
export default logger
