import {Express} from "express";
import createServer from "../../utils/server";
import supertest from "supertest";
import {getFirebaseIdToken} from "../utils/firebaseUtils";
import logger from "../../utils/logger";
import firebase from "../../../firebase";
import {firestore} from "firebase-admin";
import {
    ARTICLE_GROUP_COLLECTION,
    STORAGE_SPACE_COLLECTION,
    STORES_COLLECTION,
    USERS_COLLECTION
} from "../../utils/consts";

const app : Express = createServer();

/**
 * Payload für die Erstellung eines Users und dessen Store.
 */
const userPayload = {
    email : "super_storageSpace@test.com",
    password : "SuperPassword!1",
    confirmPassword : "SuperPassword!1",
    disabled : false,
    displayName : "Super storageSpace Test User",
    storeName: "Super storageSpace Store"
}

const storageSpacePayload = {
    storageSpaceId : "L-001",
    storageSpaceName : "Shop Regal",
    storageSpaceType : "Regal",
    description : "Super storageSpace description"
}

const storageSpacePayloadForDelete = {
    storageSpaceId : "L-002",
    storageSpaceName : "Shop Keller",
    storageSpaceType : "Keller",
    description : "Super storageSpace description"
}



let idToken : string; // ID Token des Users um festzustellen, ob dieser Authentifiziert ist.
let storeId : string; // StoreID des Stores um ihn anschließend wieder aus Firestore zu löschen.
let uid: string; // UserID des Users um ihn anschließden wieder aus Firestore zu löschen.
let storageSpaceDocId : string; // StorageSpaceDocID damit dieser wieder aus Firestore gelöscht werden kann und als Parameter mit übergeben werden kann.

/**
 * Überprüft, ob die Eigenschaften einer Lagerplatzes vorhanden sind.
 *
 * @param body
 */
function expectStorageSpaceProperties(body : any) {
    expect(body).toHaveProperty("storageSpaceDocId");
    expect(body).toHaveProperty("storageSpaceId");
    expect(body).toHaveProperty("storageSpaceName");
    expect(body).toHaveProperty("storageSpaceType");
    expect(body).toHaveProperty("description");
}

describe("Create storageSpace tests", () => {

    /**
     * Testet die Erstellung eines Lagerplatzes.
     */
    describe("GIVEN: Lagerplatz wird angelegt.", () => {
        it("SHOULD : Gibt einen 201-Created status code und ein Json Objekt mit dem Lagerplatz zurück.", async () => {
            const {statusCode, body} = await supertest(app)
                .post(`/api/stores/${storeId}/storagespaces`)
                .set("Authorization", `Bearer ${idToken}`)
                .send(storageSpacePayload);

            storageSpaceDocId = body.storageSpaceDocId;

            expect(statusCode).toBe(201);
            expectStorageSpaceProperties(body);

        });
    });

    /**
     * Ruft einen Lagerplatz ab und überprüft, ob dieser existiert.
     */
    describe("GIVEN: Lagerplatz abfragen.", () => {
        it("SHOULD : Gibt einen 200-Ok status code und ein Json Objekt mit dem Lagerplatz zurück.", async () => {
            const {statusCode, body} = await supertest(app)
                .get(`/api/stores/${storeId}/storagespaces/${storageSpaceDocId}`)
                .set("Authorization", `Bearer ${idToken}`)
                .send();

            expect(statusCode).toBe(200);
            expectStorageSpaceProperties(body);

        });
    });

    /**
     * Ruft alle Lagerplätze ab und überprüft, ob diese existieren und mindestens ein Lagerplatz vorhanden ist.
     */
    describe("GIVEN: Alle Lagerplatze abfragen.", () => {
        it("SHOULD : Gibt einen 200-Ok status code und ein Json Objekt mit allen Lagerplätzen zurück.", async () => {
            const {statusCode, body} = await supertest(app)
                .get(`/api/stores/${storeId}/storagespaces`)
                .set("Authorization", `Bearer ${idToken}`)
                .send();

            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Array);
            expect(body.length).toBeGreaterThan(0);
            expectStorageSpaceProperties(body[0]);

        });
    });

    /**
     * Updated einen Lagerplatz und überprüft, ob dieser aktualisiert wurde.
     */
    describe("GIVEN: Artikelgruppe aktualisieren.", () => {
        it("SHOULD : Gibt einen 200-Ok status code und ein Json Objekt mit der aktualisierten Artikelgruppe zurück.", async () => {
            storageSpacePayload.storageSpaceName = "Super articleGroup updated name";

            const {statusCode, body} = await supertest(app)
                .put(`/api/stores/${storeId}/storagespaces/${storageSpaceDocId}`)
                .set("Authorization", `Bearer ${idToken}`)
                .send(storageSpacePayload);

            storageSpaceDocId = body.storageSpaceDocId;

            expect(statusCode).toBe(200);
            expectStorageSpaceProperties(body);
            expect(body.storageSpaceName).toBe(storageSpacePayload.storageSpaceName);
        });
    });

    /**
     * Löscht einen Lagerplatz und überprüft, ob dieser gelöscht wurde.
     */
    describe("GIVEN: Lagerplatz löschen.", () => {
        it("SHOULD : Gibt einen 200-Ok status code zurück.", async () => {
            let storageSpaceDocIdForDelete : string = "";
            await supertest(app)
                .post(`/api/stores/${storeId}/storagespaces`)
                .set("Authorization", `Bearer ${idToken}`)
                .send(storageSpacePayloadForDelete)
                .then((value) => {
                    storageSpaceDocIdForDelete = value.body.storageSpaceDocId;
                });

            const {statusCode} = await supertest(app)
                .delete(`/api/stores/${storeId}/storagespaces/${storageSpaceDocIdForDelete}`)
                .set("Authorization", `Bearer ${idToken}`)
                .send();

            expect(statusCode).toBe(200);
        });
    });

    beforeAll(async () => {
        const {body} = await supertest(app)
            .post("/api/users")
            .send(userPayload);

        storeId = body.storeId;
        uid = body.uid;

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
            .collection(STORES_COLLECTION+`/${storeId}/`+STORAGE_SPACE_COLLECTION)
            .doc(storageSpaceDocId)
            .delete();
        await firestore()
            .collection(STORES_COLLECTION)
            .doc(storeId)
            .delete()
    });

});
