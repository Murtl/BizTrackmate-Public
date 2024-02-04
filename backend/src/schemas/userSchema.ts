import {checkSchema} from "express-validator";

/**
 * Dies ist das Schema des Nutzers gegen welches validiert wird, um festzustellen, ob alle notwendigen Daten vom Nutzer an die Schnittstelle geschickt wurden und
 * ob diese den hier definierten Kriterien entsprechen.
 * z.B. Länge und Kriterien des Passwords
 * Außerdem wird der Input hier escaped, damit z.B. keine <script>-Tags oder ähnliches auf dem Server bzw. der Datenbank gespeichert und ausgeführt werden.
 *
 *
 */
export const userSchema = checkSchema({
    email : {
        in : ["body"],
        exists : {
            options : { values : "falsy" },
            errorMessage : "Invalid email!"
        },
        normalizeEmail : true,
        trim : true,
        escape : true,
        toLowerCase : true,
    },
    password : {
        in : ["body"],
        isStrongPassword : {
            options : {
                minLength : 8,
                minLowercase : 1,
                minUppercase : 1,
                minNumbers : 1 },
            errorMessage : "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, one number, and a special character."
        },
        exists : {
            options : { values : "falsy" },
        },
        escape : true,
    },
    confirmPassword: {
        in : ["body"],
        isStrongPassword : {
            options : {
                minLength : 8,
                minLowercase : 1,
                minUppercase : 1,
                minNumbers : 1 },
            errorMessage : "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, one number, and a special character."
        },
        exists : {
            options : { values : "falsy" },
        },
        escape : true,
        custom : {
            options : (confirmPassword, {req}) => {
                return confirmPassword === req.body.password;
            },
            errorMessage : "Passwords do not match!"
        }
    },
    disabled : {
        in : ["body"],
        exists : true,
        isBoolean : true
    },
    displayName : {
        in : ["body"],
        exists : {
            options : { values : "falsy" },
        },
        isString : true,
        escape : true
    }
});
