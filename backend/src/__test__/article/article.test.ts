import {Express} from "express";
import createServer from "../../utils/server";
import supertest from "supertest";
import {getFirebaseIdToken} from "../utils/firebaseUtils";
import logger from "../../utils/logger";
import firebase from "../../../firebase";
import {firestore} from "firebase-admin";
import {ARTICLE_COLLECTION, ARTICLE_GROUP_COLLECTION, STORES_COLLECTION, USERS_COLLECTION} from "../../utils/consts";

const app : Express = createServer();

/**
 * Payload für die Erstellung eines Users und dessen Store.
 */
const userPayload = {
    email : "super_article@test.com",
    password : "SuperPassword!1",
    confirmPassword : "SuperPassword!1",
    disabled : false,
    displayName : "Super article Test User",
    storeName: "Super article Store"
}

const articlePayload = {
    articleId : "ART-001",
    name : "Super article",
    price : "1.99",
    stock : "0",
    articleGroup : {
        groupDocId : "HU329JKDSJISAJ2323",
        groupId : "GRP-001",
        groupName : "Biere",
        groupType : "Food",
        currentStock : "0",
        description : "Super articleGroup description"
    },
    storageSpace : {
        storageSpaceDocId : "PIHZTf329DSJAJ2323",
        storageSpaceId : "L-001",
        storageSpaceName : "Lager 1",
        storageSpaceType : "Lager",
        description : "Super storageSpace description"
    },
    description : "Super article description"
}

const articlePayloadForDelete = {
    articleId : "ART-002",
    name : "Super article",
    price : "15",
    stock : "0",
    articleGroup : {
        groupDocId : "HU329JKDSJISAJ2323",
        groupId : "GRP-001",
        groupName : "Biere",
        groupType : "Food",
        currentStock : "0",
        description : "Super articleGroup description"
    },
    storageSpace : {
        storageSpaceDocId : "PIHZTf329DSJAJ2323",
        storageSpaceId : "L-002",
        storageSpaceName : "Lager 2",
        storageSpaceType : "Lager",
        description : "Super storageSpace description"
    },
    description : "Super article description"
}

let idToken : string; // ID Token des Users um festzustellen, ob dieser Authentifiziert ist.
let storeId : string; // StoreID des Stores um ihn anschließend wieder aus Firestore zu löschen.
let uid: string; // UserID des Users um ihn anschließden wieder aus Firestore zu löschen.
let articleDocId : string; // ArticleDocID damit dieser wieder aus Firestore gelöscht werden kann und als Parameter mit übergeben werden kann.

/**
 * Überprüft, ob die Eigenschaften eines Artikels vorhanden sind.
 *
 * @param body
 */
function expectArticleProperties(body : any) {
    expect(body).toHaveProperty("articleDocId");
    expect(body).toHaveProperty("articleId");
    expect(body).toHaveProperty("name");
    expect(body).toHaveProperty("price");
    expect(body).toHaveProperty("stock");
    expect(body).toHaveProperty("articleGroup");
    expect(body).toHaveProperty("storageSpace");
    expect(body).toHaveProperty("description");
}

describe("Create article tests", () => {

    /**
     * Testet, ob ein Artikel angelegt werden kann.
     */
    describe("GIVEN: Artikel wird angelegt.", () => {
        it("SHOULD : Gibt einen 201-Created status code und ein Json Objekt mit dem Artikel zurück.", async () => {
            const {statusCode, body} = await supertest(app)
                .post(`/api/stores/${storeId}/articles`)
                .set("Authorization", `Bearer ${idToken}`)
                .send(articlePayload);

            articleDocId = body.articleDocId;

            expect(statusCode).toBe(201);
            expectArticleProperties(body);

        });
    });

    /**
     * Ruf den Artikel ab, der zuvor angelegt wurde und überprüft, ob dieser vorhanden ist.
     */
    describe("GIVEN: Artikel abfragen.", () => {
        it("SHOULD : Gibt einen 200-Ok status code und ein Json Objekt mit dem Artikel zurück.", async () => {
            const {statusCode, body} = await supertest(app)
                .get(`/api/stores/${storeId}/articles/${articleDocId}`)
                .set("Authorization", `Bearer ${idToken}`)
                .send();

            expect(statusCode).toBe(200);
            expectArticleProperties(body);
        });
    });

    /**
     * Ruft alle Artikel ab, die zuvor angelegt wurden und überprüft, ob mindestens ein Artikel vorhanden ist.
     */
    describe("GIVEN: Alle Artikel abfragen.", () => {
        it("SHOULD : Gibt einen 200-Ok status code und ein Json Objekt mit allen Artikeln zurück.", async () => {
            const {statusCode, body} = await supertest(app)
                .get(`/api/stores/${storeId}/articles`)
                .set("Authorization", `Bearer ${idToken}`)
                .send();

            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Array);
            expect(body.length).toBeGreaterThan(0);
            expectArticleProperties(body[0]);

        });
    });

    /**
     * Updatet den Artikel, der zuvor angelegt wurde und überprüft, ob dieser aktualisiert wurde.
     */
    describe("GIVEN: Artikel aktualisieren.", () => {
        it("SHOULD : Gibt einen 200-Ok status code und ein Json Objekt mit dem aktualisierten Artikel zurück.", async () => {
            articlePayload.name = "Super article updated name";

            const {statusCode, body} = await supertest(app)
                .put(`/api/stores/${storeId}/articles/${articleDocId}`)
                .set("Authorization", `Bearer ${idToken}`)
                .send(articlePayload);

            articleDocId = body.articleDocId;

            expect(statusCode).toBe(200);
            expectArticleProperties(body);
            expect(body.name).toBe(articlePayload.name);
        });
    });

    /**
     * Löscht den Artikel, der zuvor angelegt wurde und überprüft, ob dieser gelöscht wurde.
     */
    describe("GIVEN: Artikel löschen.", () => {
       it("SHOULD : Gibt einen 200-Ok status code zurück.", async () => {
           let articleDocIdForDelete : string = "";
           await supertest(app)
               .post(`/api/stores/${storeId}/articles`)
               .set("Authorization", `Bearer ${idToken}`)
               .send(articlePayloadForDelete)
               .then((value) => {
                   articleDocIdForDelete = value.body.articleDocId;
               });

           const {statusCode} = await supertest(app)
               .delete(`/api/stores/${storeId}/articles/${articleDocIdForDelete}`)
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
            .collection(STORES_COLLECTION+`/${storeId}/`+ARTICLE_COLLECTION)
            .doc(articleDocId)
            .delete();
        await firestore()
            .collection(STORES_COLLECTION)
            .doc(storeId)
            .delete()
    });

});