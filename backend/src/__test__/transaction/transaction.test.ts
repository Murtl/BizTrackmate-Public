import {Express} from "express";
import createServer from "../../utils/server";
import supertest from "supertest";
import {getFirebaseIdToken} from "../utils/firebaseUtils";
import logger from "../../utils/logger";
import firebase from "../../../firebase";
import {firestore} from "firebase-admin";
import {ARTICLE_COLLECTION, STORES_COLLECTION, TRANSACTION_COLLECTION, USERS_COLLECTION} from "../../utils/consts";

const app : Express = createServer();

/**
 * Payload für die Erstellung eines Users und dessen Store.
 */
const userPayload = {
    email : "super_transaction@test.com",
    password : "SuperPassword!1",
    confirmPassword : "SuperPassword!1",
    disabled : false,
    displayName : "Super transaction Test User",
    storeName: "Super transaction Store"
}

const transactionPayload = {
    transactionId : "TRN-001",
    transactionType : "Einlagerung",
    day : "01",
    month : "01",
    year : "2023",
    items : [
        {
            quantity : "10",
            price : "1.99",
            article : {
                articleDocId: "HU329JKDSJISAJ2323",
                articleId: "ART-001",
                name: "Super article",
                price: "1.99",
                stock: "0",
                articleGroup: {
                    groupDocId: "HU329JKDSJIS389723",
                    groupId: "GRP-001",
                    groupName: "Biere",
                    groupType: "Food",
                    currentStock: "0",
                    description: "Super articleGroup description"
                },
                storageSpace: {
                    storageSpaceDocId: "PIHZTf329DSJAJ2323",
                    storageSpaceId: "L-001",
                    storageSpaceName: "Lager 1",
                    storageSpaceType: "Lager",
                    description: "Super storageSpace description"
                },
                description: "Super article description"
            }
        }
    ],
    total_amount : "10",
    description : "Super transaction description"
}

const transactionPayloadForDelete = {
    transactionId : "TRN-001",
    transactionType : "Einlagerung",
    day : "01",
    month : "01",
    year : "2023",
    items : [
        {
            quantity : "19",
            price : "1.99",
            article : {
                articleDocId: "HU329JKDSJISAJ2323",
                articleId: "ART-001",
                name: "Super article",
                price: "1.99",
                stock: "0",
                articleGroup: {
                    groupDocId: "HU329JKDSJIS389723",
                    groupId: "GRP-001",
                    groupName: "Biere",
                    groupType: "Food",
                    currentStock: "0",
                    description: "Super articleGroup description"
                },
                storageSpace: {
                    storageSpaceDocId: "PIHZTf329DSJAJ2323",
                    storageSpaceId: "L-001",
                    storageSpaceName: "Lager 1",
                    storageSpaceType: "Lager",
                    description: "Super storageSpace description"
                },
                description: "Super article description"
            }
        }
    ],
    total_amount : "19",
    description : "Super transaction description"
}

let idToken : string; // ID Token des Users um festzustellen, ob dieser Authentifiziert ist.
let storeId : string; // StoreID des Stores um ihn anschließend wieder aus Firestore zu löschen.
let uid: string; // UserID des Users um ihn anschließden wieder aus Firestore zu löschen.
let transactionDocId : string; // TransactionDocID damit diese wieder aus Firestore gelöscht werden kann und als Parameter mit übergeben werden kann.

function expectArticleProperties(body : any) {
    expect(body).toHaveProperty("transactionDocId");
    expect(body).toHaveProperty("transactionId");
    expect(body).toHaveProperty("transactionType");
    expect(body).toHaveProperty("day");
    expect(body).toHaveProperty("month");
    expect(body).toHaveProperty("year");
    expect(body).toHaveProperty("items");
    expect(body).toHaveProperty("total_amount");
    expect(body).toHaveProperty("description");
}

describe("Create transaction tests", () => {

    /**
     * Testet, ob eine Transaktion erfolgreich angelegt werden kann.
     */
    describe("GIVEN: Transaktion wird angelegt.", () => {
        it("SHOULD : Gibt einen 201-Created status code und ein Json Objekt mit der Transaktion zurück.", async () => {
            const {statusCode, body} = await supertest(app)
                .post(`/api/stores/${storeId}/transactions`)
                .set("Authorization", `Bearer ${idToken}`)
                .send(transactionPayload);

            transactionDocId = body.transactionDocId;

            expect(statusCode).toBe(201);
            expectArticleProperties(body);
        });
    });

    /**
     * Ruft alle Transaktionen ab und prüft, ob diese erfolgreich abgerufen werden können und mindestens eine Transaktion vorhanden ist.
     */
    describe("GIVEN: Alle Transaktionen abfragen.", () => {
        it("SHOULD : Gibt einen 200-Ok status code und ein Json Objekt mit allen Transaktionen zurück.", async () => {
            const {statusCode, body} = await supertest(app)
                .get(`/api/stores/${storeId}/transactions`)
                .set("Authorization", `Bearer ${idToken}`)
                .send();

            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Array);
            expect(body.length).toBeGreaterThan(0);
            expectArticleProperties(body[0]);

        });
    });

    /**
     * Löscht eine Transaktion und prüft, ob diese erfolgreich gelöscht wurde.
     */
    describe("GIVEN: Transaktion löschen.", () => {
        it("SHOULD : Gibt einen 200-Ok status code zurück.", async () => {
            let transactionDocIdForDelete : string = "";
            await supertest(app)
                .post(`/api/stores/${storeId}/transactions`)
                .set("Authorization", `Bearer ${idToken}`)
                .send(transactionPayloadForDelete)
                .then((value) => {
                    transactionDocIdForDelete = value.body.transactionDocId;
                });

            const {statusCode} = await supertest(app)
                .delete(`/api/stores/${storeId}/transactions/${transactionDocIdForDelete}`)
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
            .collection(STORES_COLLECTION+`/${storeId}/`+TRANSACTION_COLLECTION)
            .doc(transactionDocId)
            .delete();
        await firestore()
            .collection(STORES_COLLECTION)
            .doc(storeId)
            .delete()
    });
});