import {checkSchema} from "express-validator";

/**
 * Dies ist das Schema eines Lagerplatzes gegen welches validiert wird, um festzustellen, ob alle notwendigen Daten vom Nutzer an die Schnittstelle geschickt wurden und
 * ob diese den hier definierten Kriterien entsprechen.
 * Außerdem wird der Input hier escaped, damit z.B. keine <script>-Tags oder ähnliches auf dem Server bzw. der Datenbank gespeichert und ausgeführt werden.
 *
 * Kann bei Bedarf erweitert werden.
 */
export const storageSpaceSchema = checkSchema({
    storageSpaceId : {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid storageSpaceId!"
        },
        escape: true,
        isString: true,
    },
    storageSpaceName : {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid storageSpaceName!"
        },
        escape: true,
        isString: true,
    },
    storageSpaceType : {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid storageSpaceType!"
        },
        escape: true,
        isString: true,
    },
    description : {
        in: ['body'],
        exists: {
            options: {values: "undefined"},
        },
        escape: true,
        isString: true,
    }
});

/**
 * Dies ist das Schema eines Lagerplatzes gegen welches validiert wird, um festzustellen, ob alle notwendigen Daten vom Nutzer an die Schnittstelle geschickt wurden und
 * ob diese den hier definierten Kriterien entsprechen.
 *
 * Kann bei Bedarf erweitert werden. Darum existiert für jede CRUD-Operation ein eigenes Schema.
 * Erweitert das Schema storageSpaceSchema um die storageSpaceDocId, welche für die Identifizierung eines Lagerplatzes in der Datenbank notwendig ist.
 */
export const storageSpaceSchemaForUpdate = checkSchema({
    storageSpaceDocId : {
        in: ["params"],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid storageSpaceDocId!"
        },
        escape: true,
        isString: true,
    }
});

/**
 * Dies ist das Schema eines Lagerplatzes gegen welches validiert wird, um festzustellen, ob alle notwendigen Daten vom Nutzer an die Schnittstelle geschickt wurden und
 * ob diese den hier definierten Kriterien entsprechen.
 *
 * Kann bei Bedarf erweitert werden. Darum existiert für jede CRUD-Operation ein eigenes Schema.
 * Erweitert das Schema storageSpaceSchema um die storageSpaceDocId, welche für die Identifizierung eines Lagerplatzes in der Datenbank notwendig ist.
 */
export const storageSpaceSchemaForGetById = checkSchema({
    storageSpaceDocId : {
        in: ["params"],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid storageSpaceDocId!"
        },
        escape: true,
        isString: true,
    }
});

/**
 * Dies ist das Schema eines Lagerplatzes gegen welches validiert wird, um festzustellen, ob alle notwendigen Daten vom Nutzer an die Schnittstelle geschickt wurden und
 * ob diese den hier definierten Kriterien entsprechen.
 *
 * Kann bei Bedarf erweitert werden. Darum existiert für jede CRUD-Operation ein eigenes Schema.
 * Erweitert das Schema storageSpaceSchema um die storageSpaceDocId, welche für die Identifizierung eines Lagerplatzes in der Datenbank notwendig ist.
 */
export const storageSpaceSchemaForDelete = checkSchema({
    storageSpaceDocId : {
        in: ["params"],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid storageSpaceDocId!"
        },
        escape: true,
        isString: true,
    }
});