import {checkSchema} from "express-validator";

/**
 * Dies ist das Schema eines Artikelgruppe gegen welches validiert wird,
 * um festzustellen, ob alle notwendigen Daten vom Nutzer an die Schnittstelle geschickt wurden und
 * ob diese den hier definierten Kriterien entsprechen.
 * Außerdem wird der Input hier escaped, damit z.B. keine <script>-Tags oder ähnliches auf dem Server bzw. der Datenbank gespeichert und ausgeführt werden.
 *
 * Kann bei Bedarf erweitert werden.
 */
export const articleGroupSchema = checkSchema({
    groupId : {
       in : ["body"],
         exists : {
            options : { values : "falsy" },
            errorMessage : "Invalid groupId!"
         },
            escape : true,
            isString : true,
    },
    groupName : {
         in : ["body"],
            exists : {
                options : { values : "falsy" },
                errorMessage : "Invalid groupName!"
            },
            escape : true,
            isString : true,
    },
    groupType : {
            in : ["body"],
            exists : {
                options : { values : "falsy" },
                errorMessage : "Invalid groupType!"
            },
            escape : true,
            isString : true,
    },
    currentStock : {
            in : ["body"],
            exists : {
                options : { values : "falsy" },
                errorMessage : "Invalid currentStock!"
            },
            isNumeric : true,
    },
    description : {
            in : ["body"],
            exists : {
                options : { values : "undefined" },
            },
            escape : true,
            isString : true,
    }
});

/**
 * Dies ist das Schema eines Artikelgruppe gegen welches validiert wird, um festzustellen, ob alle notwendigen Daten vom Nutzer an die Schnittstelle geschickt wurden und
 * ob diese den hier definierten Kriterien entsprechen.
 *
 * Kann bei Bedarf erweitert werden. Darum existiert für jede CRUD-Operation ein eigenes Schema.
 * Erweitert das Schema von articleGroupSchema um die Eigenschaften, die beim Updaten einer neuen Artikelgruppe benötigt werden.
 */
export const articleGroupSchemaForUpdate = checkSchema({
    groupDocId : {
        in : ["params"],
        exists : {
            options : { values : "falsy" },
            errorMessage : "Invalid groupDocId!"
        },
        escape : true,
        isString : true,
    }
});

/**
 * Dies ist das Schema eines Artikelgruppe gegen welches validiert wird, um festzustellen, ob alle notwendigen Daten vom Nutzer an die Schnittstelle geschickt wurden und
 * ob diese den hier definierten Kriterien entsprechen.
 *
 * Kann bei Bedarf erweitert werden. Darum existiert für jede CRUD-Operation ein eigenes Schema.
 * Erweitert das Schema von articleGroupSchema um die Eigenschaften groupDocId die beim Lesen einer neuen Artikelgruppe benötigt werden.
 */
export const articleGroupSchemaForGetById = checkSchema({
    groupDocId : {
        in : ["params"],
        exists : {
            options : { values : "falsy" },
            errorMessage : "Invalid groupDocId!"
        },
        escape : true,
        isString : true,
    }
});

/**
 * Dies ist das Schema eines Artikelgruppe gegen welches validiert wird, um festzustellen, ob alle notwendigen Daten vom Nutzer an die Schnittstelle geschickt wurden und
 * ob diese den hier definierten Kriterien entsprechen.
 *
 * Kann bei Bedarf erweitert werden. Darum existiert für jede CRUD-Operation ein eigenes Schema.
 */
export const articleGroupSchemaForDelete = checkSchema({
    groupDocId : {
        in : ["params"],
        exists : {
            options : { values : "falsy" },
            errorMessage : "Invalid groupDocId!"
        },
        escape : true,
        isString : true,
    }
});