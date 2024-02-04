import {checkSchema} from "express-validator";

/**
 * Dies ist das Schema für die Validierung der Eingaben beim Erstellen einer Transaktion. Alle Felder müssen vorhanden sein und den hier definierten Kriterien entsprechen.
 * Außerdem wird der Input auf SQL-Injection getestet. Dafür wird die Funktion escape() von express-validator verwendet.
 *
 * Kann bei Bedarf erweitert werden.
 */
export const transactionSchema = checkSchema({
   transactionId: {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid transactionId!"
        },
        escape: true,
        isString: true,
    },
    transactionType: {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid transactionType!"
        },
        escape: true,
        isString: true,
    },
    day: {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid day!"
        },
        escape: true,
        isNumeric: true,
    },
    month: {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid month!"
        },
        escape: true,
        isNumeric: true,
    },
    year: {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid year!"
        },
        escape: true,
        isNumeric: true,
    },
    "items.*.quantity": {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid quantity!"
        },
        escape: true,
        isNumeric: true,
    },
    "items.*.price": {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid price!"
        },
        escape: true,
        isDecimal: true,
    },
    "items.*.article.articleDocId": {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid articleDocId!"
        },
        escape: true,
        isString: true,
    },
    "items.*.article.articleId": {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid articleId!"
        },
        escape: true,
        isString: true,
    },
    "items.*.article.name": {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid name!"
        },
        escape: true,
        isString: true,
    },
    "items.*.article.price": {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid price!"
        },
        escape: true,
        isDecimal: true,
    },
    "items.*.article.stock": {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid stock!"
        },
        escape: true,
        isNumeric: true,
    },
    "items.*.article.articleGroup.groupDocId": {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid groupDocId!"
        },
        escape: true,
        isString: true,
    },
    "items.*.article.articleGroup.groupId": {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid groupId!"
        },
        escape: true,
        isString: true,
    },
    "items.*.article.articleGroup.groupName": {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid groupName!"
        },
        escape: true,
        isString: true,
    },
    "items.*.article.articleGroup.groupType" : {
        in : ["body"],
        exists : {
            options : { values : "falsy" },
            errorMessage : "Invalid groupType!"
        },
        escape : true,
        isString : true,
    },
    "items.*.article.articleGroup.currentStock" : {
        in : ["body"],
        exists : {
            options : { values : "falsy" },
            errorMessage : "Invalid currentStock!"
        },
        isNumeric : true,
    },
    "items.*.article.articleGroup.description" : {
        in : ["body"],
        exists : {
            options : { values : "undefined" },
        },
        escape : true,
        isString : true,
    },
        "items.*.article.storageSpace.storageSpaceDocId" : {
        in: ["params"],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid storageSpaceDocId!"
        },
        escape: true,
        isString: true,
    },
    "items.*.article.storageSpace.storageSpaceId" : {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid storageSpaceId!"
        },
        escape: true,
        isString: true,
    },
        "items.*.article.storageSpace.storageSpaceName" : {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid storageSpaceName!"
        },
        escape: true,
        isString: true,
    },
        "items.*.article.storageSpace.storageSpaceType" : {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid storageSpaceType!"
        },
        escape: true,
        isString: true,
    },
        "items.*.article.storageSpace.description" : {
        in: ['body'],
        exists: {
            options: {values: "undefined"},
        },
        escape: true,
        isString: true,
    },
    total_amount: {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid total_amount!"
        },
        escape: true,
        isNumeric: true
    },
    description: {
        in: ['body'],
        exists: {
            options: {values: "undefined"},
            errorMessage: "Invalid description!"
        },
        escape: true,
        isString: true,
    }
});

/**
 * Dies ist das Schema für die Validierung der Transaktionen, die zum Löschen übergeben werden.
 * Es wird nur die transactionDocId validiert.
 *
 * Kann bei Bedarf erweitert werden.
 */
export const transactionSchemaForDelete = checkSchema({
    transactionDocId: {
        in: ['params'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid transactionDocId!"
        },
        escape: true,
        isString: true,

    }
});
