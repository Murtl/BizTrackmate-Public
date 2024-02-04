import createServer from "../../utils/server";
import {Express} from "express";
import firebase from "../../../firebase";
import supertest from "supertest";
import {firestore} from "firebase-admin";
import {STORES_COLLECTION, USERS_COLLECTION} from "../../utils/consts";

/**
 * Express App Instanz für die Tests.
 */
const app : Express = createServer();

/**
 * Payload für die Erstellung eines Users und dessen Store.
 */
const userPayload = {
    email : "super_post@test.com",
    password : "SuperPassword!1",
    confirmPassword : "SuperPassword!1",
    disabled : false,
    displayName : "Super POST Test User",
    storeName: "Super POST Store"
}

const apiEndpoint : string = "/api/users"
let uid: string; // UserID des Users um in anschließden wieder aus Firestore zu löschen.
let storeId : string // StoreID des Stores um ihn anschließend wieder aus Firestore zu löschen.

/**
 * Testet die Funktionalität des Endpoints /api/users
 *
 */
describe("Create user tests", () => {

    /**
     * Löscht den User und den Store aus Firebase und Firestore.
     * Wird nach allen Test ausgeführt.
     */
    afterAll(async () => {
       await firebase
           .auth()
           .deleteUser(uid);
       await firestore()
           .collection(USERS_COLLECTION)
           .doc(uid)
           .delete();
       await firestore()
           .collection(STORES_COLLECTION)
           .doc(storeId)
           .delete();

    });

    /**
     * Testet die Funktionalität des Endpoints /api/users mit der Methode POST.
     * Hier wird getestet, ob der User und Store erfolgreich erstellt wurden und die richtigen Daten zurückgegeben werden.
     */
    describe(`POST : ${apiEndpoint}`, () => {
       describe("GIVEN: Nutzer und Store wurden angelegt.", () => {
           it("SHOULD : Gibt einen 201-Created status code und ein Json Objekt mit den Nutzerinformationen zurück.", async () => {
               const {statusCode, body} = await supertest(app)
                   .post(`${apiEndpoint}`)
                   .send(userPayload);
               uid = body.uid;
               storeId = body.storeId;

               expect(statusCode).toBe(201);
               expect(body).toEqual({
                   uid : expect.any(String),
                   storeId : expect.any(String),
                   storeName : userPayload.storeName,
               });
           });
       });

        /**
         * Testet die Funktionalität des Endpoints /api/users mit der Methode POST.
         * Hier wird getestet, ob der User bereits existiert.
         * */
        describe("GIVEN: User und Store wurden bereits angelegt.", () => {
            it("SHOULD : Gibt einen 400 status code zurück.", async () => {
                const {statusCode, body} = await supertest(app)
                    .post(`${apiEndpoint}`)
                    .send(userPayload);

                expect(statusCode).toBe(400);
            });
        });
    });

});