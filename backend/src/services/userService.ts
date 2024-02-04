import firebase from "../../firebase";
import {User, UserResponse} from "../models/userModel";
import {auth, firestore} from "firebase-admin";
import {Store} from "../models/storeModel";
import UserRecord = auth.UserRecord;
import {USERS_COLLECTION} from "../utils/consts";

/**
 * Legt den übergebenen Nutzer in Firebase an. Dazu wird das Firebase Admin SDK benutzt.
 *
 * @param user - Der Nutzer, der angelegt werden soll
 */
export async function createUser(user : User) : Promise<UserRecord> {
    return await firebase
        .auth()
        .createUser({
            email : user.email,
            password : user.password,
            displayName : user.displayName
        });
}

/**
 * Weist dem übergebenen Nutzer die übergebene StoreId zu.
 * Dazu wird das Firebase Admin SDK benutzt.
 *
 * @param userResponse - Darin wird die StoreId und UserId gespeichert.
 */
export async function applyStoreIdToUser(userResponse : UserResponse) {
    return await firebase
        .auth()
        .setCustomUserClaims(userResponse.uid, {storeId : userResponse.storeId});
}

/**
 * Legt den übergebenen Nutzer und Store in Firestore an und verknüpft diese miteinander.
 * Dazu wird das Firebase Admin SDK benutzt.
 * Die StoreId wird dem Nutzer als Custom Claim zugewiesen.
 *
 * @param userRecord - Der Nutzer, der angelegt werden soll
 * @param store - Der Store, der angelegt werden soll
 */
export async function createUserAndStoreInFirestore(userRecord : UserRecord, store : Store) : Promise<UserResponse>{
    const document = await firestore()
        .collection("stores")
        .add({
            storeName : store.storeName,
            userID : userRecord.uid
        });
    await firestore()
        .collection("users")
        .doc(userRecord.uid)
        .set({
            uid : userRecord.uid,
            storeId : document.id,
            storeName : store.storeName,
            displayName : userRecord.displayName
        });
    return {
        uid: userRecord.uid,
        storeId: document.id,
        storeName : store.storeName
    };
}

/**
 * Holt den Nutzer aus Firestore anhand der übergebenen UserId.
 * Dazu wird das Firebase Admin SDK benutzt.
 *
 * @param uid - Die UserId des Nutzers
 */
export async function getUserInformation(uid : string) : Promise<UserResponse> {
    const userRef = await firestore()
        .collection(USERS_COLLECTION)
        .doc(uid);
    const userDoc = await userRef.get();
    if(userDoc.exists){
        const userResponse = userDoc.data() as UserResponse;
        return {
            uid : userResponse.uid,
            storeId : userResponse.storeId,
            storeName : userResponse.storeName
        }
    } else {
        throw new Error("User not found");
    }
}