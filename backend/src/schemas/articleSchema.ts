import {checkSchema} from "express-validator";

/**
 * Dies ist das Schema eines Artikels gegen welches validiert wird, um festzustellen, ob alle notwendigen Daten vom Nutzer an die Schnittstelle geschickt wurden und
 * ob diese den hier definierten Kriterien entsprechen.
 * Außerdem wird der Input auf SQL-Injection getestet. Dafür wird die Funktion escape() von express-validator verwendet.
 *
 * Kann bei Bedarf erweitert werden.
 */
export const articleSchema = checkSchema({
    articleId : {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid articleId!"
        },
        escape: true,
        isString: true,
    },
    name : {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid name!"
        },
        escape: true,
        isString: true,
    },
    price : {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid price!"
        },
        escape: true,
        isDecimal: true,
    },
    stock : {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid stock!"
        },
        escape: true,
        isNumeric: true,
    },
    "articleGroup.groupDocId": {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid articleGroup!"
        },
        escape: true,
        isString: true,
    },
    "articleGroup.groupId": {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid articleGroup!"
        },
        escape: true,
        isString: true,
    },
    "articleGroup.groupName": {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid articleGroup!"
        },
        escape: true,
        isString: true,
    },
    "articleGroup.groupType": {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid articleGroup!"
        },
        escape: true,
        isString: true,
    },
    "articleGroup.currentStock": {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid articleGroup!"
        },
        escape: true,
        isNumeric: true,
    },
    "articleGroup.description": {
        in: ['body'],
        exists: {
            options: {values: "undefined"},
        },
        escape: true,
        isString: true,
    },
    "storageSpace.storageSpaceDocId" : {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid storageSpace!"
        },
        escape: true,
        isString: true,
    },
    "storageSpace.storageSpaceId" : {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid storageSpace!"
        },
        escape: true,
        isString: true,
    },
    "storageSpace.storageSpaceName" : {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid storageSpace!"
        },
        escape: true,
        isString: true,
    },
    "storageSpace.storageSpaceType" : {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid storageSpace!"
        },
        escape: true,
        isString: true,
    },
    "storageSpace.description" : {
        in: ['body'],
        exists: {
            options: {values: "undefined"},
        },
        escape: true
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
 * Dies ist das Schema eines Artikels gegen welches validiert wird, um festzustellen, ob alle notwendigen Daten vom Nutzer an die Schnittstelle geschickt wurden und
 * ob diese den hier definierten Kriterien entsprechen.
 *
 * Kann bei Bedarf erweitert werden. Darum existiert für jede CRUD-Operation ein eigenes Schema.
 */
export const articleSchemaForUpdate = checkSchema({
   articleDocId : {
         in: ["params"],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid articleDocId!"
        },
        escape: true,
        isString: true
   }
});

/**
 * Dies ist das Schema eines Artikels gegen welches validiert wird, um festzustellen, ob alle notwendigen Daten vom Nutzer an die Schnittstelle geschickt wurden und
 * ob diese den hier definierten Kriterien entsprechen.
 *
 * Kann bei Bedarf erweitert werden. Darum existiert für jede CRUD-Operation ein eigenes Schema.
 */
export const articleSchemaForGetById = checkSchema({
    articleDocId : {
        in: ["params"],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid articleDocId!"
        },
        escape: true,
        isString: true
    }
});


/**
 * Dies ist das Schema eines Artikels gegen welches validiert wird, um festzustellen, ob alle notwendigen Daten vom Nutzer an die Schnittstelle geschickt wurden und
 * ob diese den hier definierten Kriterien entsprechen.
 *
 * Kann bei Bedarf erweitert werden. Darum existiert für jede CRUD-Operation ein eigenes Schema.
 */
export const articleSchemaForDelete = checkSchema({
    articleDocId : {
        in: ["params"],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid articleDocId!"
        },
        escape: true,
        isString: true
    }
});
