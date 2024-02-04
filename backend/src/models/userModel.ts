/**
 * Bündelt alle notwendigen Informationen des Nutzers saus dem Request Body.
 *
 * @param uid - Die ID des Nutzers
 * @param email - Die E-Mail-Adresse des Nutzers
 * @param password - Das Passwort des Nutzers
 * @param confirmPassword - Das Passwort des Nutzers zur Bestätigung
 * @param disabled - Ob der Nutzer deaktiviert ist
 * @param displayName - Der Name des Nutzers
 */
export type User = {
    uid : string,
    email : string,
    password : string,
    confirmPassword : string,
    disabled : boolean,
    displayName : string,
}

/**
 * Type für den Response nach dem Anlegen eines neuen Nutzers und seines Stores.
 * Beinhaltet die UserID und die StoreId
 *
 * @param uid - Die ID des Nutzers
 * @param storeId - Die ID des Stores, zu dem der Nutzer gehört
 * @param storeName - Der Name des Stores, zu dem der Nutzer gehört
 */
export type UserResponse = {
    uid : string,
    storeId : string,
    storeName : string
}