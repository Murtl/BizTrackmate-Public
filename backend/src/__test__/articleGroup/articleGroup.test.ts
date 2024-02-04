import createServer from "../../utils/server";
import {Express} from "express";
import supertest from "supertest";
import {getFirebaseIdToken} from "../utils/firebaseUtils";
import logger from "../../utils/logger";
import firebase from "../../../firebase";
import {firestore} from "firebase-admin";
import {ARTICLE_GROUP_COLLECTION, STORES_COLLECTION, USERS_COLLECTION} from "../../utils/consts";

const app : Express = createServer();

/**
 * Payload für die Erstellung eines Users und dessen Store.
 */
const userPayload = {
    email : "super_articleGroup@test.com",
    password : "SuperPassword!1",
    confirmPassword : "SuperPassword!1",
    disabled : false,
    displayName : "Super articleGroup Test User",
    storeName: "Super articleGroup Store"
}

const articleGroupPayload = {
    groupId : "GRP-001",
    groupName : "Biere",
    groupType : "Food",
    currentStock : "0",
    description : "Super articleGroup description"
}

const articleGroupPayloadForDelete = {
    groupId : "GRP-002",
    groupName : "Notebooks",
    groupType : "Non-Food",
    currentStock : "0",
    description : "Super articleGroup description"
}

let idToken : string; // ID Token des Users um festzustellen, ob dieser Authentifiziert ist.
let storeId : string; // StoreID des Stores um ihn anschließend wieder aus Firestore zu löschen.
let uid: string; // UserID des Users um ihn anschließden wieder aus Firestore zu löschen.
let groupDocId : string; // ArticleGroupDocID damit dieser wieder aus Firestore gelöscht werden kann und als Parameter mit übergeben werden kann.

/**
 * Überprüft, ob die Eigenschaften einer Artikelgruppe vorhanden sind.
 *
 * @param body
 */
function expectArticleGroupProperties(body : any) {
    expect(body).toHaveProperty("groupDocId");
    expect(body).toHaveProperty("groupDocId");
    expect(body).toHaveProperty("groupId");
    expect(body).toHaveProperty("groupName");
    expect(body).toHaveProperty("groupType");
    expect(body).toHaveProperty("currentStock");
    expect(body).toHaveProperty("description");
}

/**
 * Überprüft, ob die Eigenschaften eines Stores vorhanden sind.
 */
describe("Create articleGroup tests", () => {

    /**
     * Legt eine Artikelgruppe an und überprüft, ob diese angelegt wurde.
     */
    describe("GIVEN: Artikelgruppe wird angelegt.", () => {
        it("SHOULD : Gibt einen 201-Created status code und ein Json Objekt mit der Artikelgruppe zurück.", async () => {
            const {statusCode, body} = await supertest(app)
                .post(`/api/stores/${storeId}/articlegroups`)
                .set("Authorization", `Bearer ${idToken}`)
                .send(articleGroupPayload);

            groupDocId = body.groupDocId;

            expect(statusCode).toBe(201);
            expectArticleGroupProperties(body);

        });
    });

    /**
     * Ruft eine Artikelgruppe ab und überprüft, ob diese existiert.
     */
    describe("GIVEN: Artikelgruppe abfragen.", () => {
        it("SHOULD : Gibt einen 200-Ok status code und ein Json Objekt mit der Artikelgruppe zurück.", async () => {
           const {statusCode, body} = await supertest(app)
               .get(`/api/stores/${storeId}/articlegroups/${groupDocId}`)
               .set("Authorization", `Bearer ${idToken}`)
               .send();

              expect(statusCode).toBe(200);
              expectArticleGroupProperties(body);

        });
    });

    /**
     * Ruft alle Artikelgruppen ab und überprüft, ob diese existieren und mindestens eine vorhanden ist.
     */
    describe("GIVEN: Alle Artikelgruppen abfragen.", () => {
       it("SHOULD : Gibt einen 200-Ok status code und ein Json Objekt mit allen Artikelgruppen zurück.", async () => {
             const {statusCode, body} = await supertest(app)
                .get(`/api/stores/${storeId}/articlegroups`)
                .set("Authorization", `Bearer ${idToken}`)
                .send();

              expect(statusCode).toBe(200);
              expect(body).toBeInstanceOf(Array);
              expect(body.length).toBeGreaterThan(0);
              expectArticleGroupProperties(body[0]);

       });
    });

    /**
     * Updated eine Artikelgruppe und überprüft, ob diese aktualisiert wurde.
     */
    describe("GIVEN: Artikelgruppe aktualisieren.", () => {
       it("SHOULD : Gibt einen 200-Ok status code und ein Json Objekt mit der aktualisierten Artikelgruppe zurück.", async () => {
           articleGroupPayload.groupName = "Super articleGroup updated name";

           const {statusCode, body} = await supertest(app)
               .put(`/api/stores/${storeId}/articlegroups/${groupDocId}`)
               .set("Authorization", `Bearer ${idToken}`)
               .send(articleGroupPayload);

           groupDocId = body.groupDocId;

           expect(statusCode).toBe(200);
           expectArticleGroupProperties(body);
           expect(body.groupName).toBe(articleGroupPayload.groupName);
       });
    });

    /**
     * Löscht eine Artikelgruppe und überprüft, ob diese gelöscht wurde.
     */
    describe("GIVEN: Artikelgruppe löschen.", () => {
       it("SHOULD : Gibt einen 200-Ok status code zurück.", async () => {
              let groupDocIdForDelete : string = "";
              await supertest(app)
                  .post(`/api/stores/${storeId}/articlegroups`)
                  .set("Authorization", `Bearer ${idToken}`)
                  .send(articleGroupPayloadForDelete)
                  .then((value) => {
                      groupDocIdForDelete = value.body.groupDocId;
                  });

              const {statusCode} = await supertest(app)
                .delete(`/api/stores/${storeId}/articlegroups/${groupDocIdForDelete}`)
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
            .collection(STORES_COLLECTION+`/${storeId}/`+ARTICLE_GROUP_COLLECTION)
            .doc(groupDocId)
            .delete();
        await firestore()
            .collection(STORES_COLLECTION)
            .doc(storeId)
            .delete()
    });
});

