/**
 * Bündelt alle notwendigen Informationen für den Store aus dem Request Body.
 * Erstmal nur der Name, kann aber beliebig erweitert werden.
 * 
 * @param storeName - Der Name des Stores
 */
export type Store = {
    storeName : string,
}