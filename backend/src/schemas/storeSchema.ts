import {checkSchema} from "express-validator";

/**
 * Dies ist das Schema des Stores gegen welches validiert wird, um festzustellen, ob alle notwendigen Daten vom Nutzer an die Schnittstelle geschickt wurden und
 * ob diese den hier definierten Kriterien entsprechen.
 * Außerdem wird der Input hier escaped, damit z.B. keine <script>-Tags oder ähnliches auf dem Server bzw. der Datenbank gespeichert und ausgeführt werden.
 *
 *
 */
export const storeSchema = checkSchema({
    storeName : {
        in : ["body"],
        exists : {
            options : { values : "falsy"}
        },
        escape : true,
        isString : true
    }
});