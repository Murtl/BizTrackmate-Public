import {Express} from "express";
import createServer from "../../utils/server";
import supertest from "supertest";
import {getFirebaseIdToken} from "../utils/firebaseUtils";
import logger from "../../utils/logger";
import {STORES_COLLECTION, USERS_COLLECTION} from "../../utils/consts";
import {firestore} from "firebase-admin";
import firebase from "../../../firebase";

const app : Express = createServer();

/**
 * Payload für die Erstellung eines Users und dessen Store.
 * Wird vor dem Test ausgeführt, damit Daten zum Abfragen vorhanden sind.
 */
const userPayload = {
    email : "super_get@test.com",
    password : "SuperPassword!1",
    confirmPassword : "SuperPassword!1",
    disabled : false,
    displayName : "Super GET Test User",
    storeName: "Super GET Store"
}

const apiEndpoint : string = "/api/users";

let idToken : string; // ID Token des Users um festzustellen, ob dieser Authentifiziert ist.
let uid : string; // UserID des Users um ihn anschließend wieder aus Firebase zu löschen.
let storeId : string // StoreID des Stores um ihn anschließend wieder aus Firestore zu löschen.
describe("Get user information tests", () => {

    beforeAll(async () => {
        const {body} = await supertest(app)
            .post(`${apiEndpoint}`)
            .send(userPayload);

        await getFirebaseIdToken(userPayload.email, userPayload.password)
            .then((value) => {
                idToken = value.data.idToken;
            })
            .catch((error : any) => {
                logger.error(error);
            });
    });

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

    describe(`GET : ${apiEndpoint}`, () => {
        describe("GIVEN: Gibt die Daten für einen bestimmten Nutzer zurück.", () => {
            it("SHOULD : Gibt einen Statuscode 200 und die Nutzerinformationen als Json Objekt zurück.", async () => {
                const {statusCode, body} = await supertest(app)
                    .get(`${apiEndpoint}`)
                    .set("Authorization", `Bearer ${idToken}`)
                    .send();

                uid = body.uid;
                storeId = body.storeId;

                expect(statusCode).toBe(200);
                expect(body).toEqual({
                    uid : expect.any(String),
                    storeId : expect.any(String),
                    storeName : userPayload.storeName
                })

            });
        });

    });

});
