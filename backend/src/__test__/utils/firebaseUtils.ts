import axios from 'axios';
import config from 'config';

const FIREBASE_URI : string = config.get<string>("firebase_uri");
const FIREBASE_API_TOKEN : string = config.get<string>("firebase_api_token");

type FirebaseTokenResponse = {
    kind : string,
    localId : string,
    email : string,
    displayName : string,
    idToken : string,
    registered : boolean,
    refreshToken : string,
    expiresIn : string
}

/**
 * Diese Methode ist nur für die Tests und simuliert einen Client, der sich ein Token bei Firebase holt.
 * Ansonsten könnte man keinen End-to-End-Test durchführen.
 *
 * !!! NICHT IM BACKEND VERWENDEN !!!
 *
 * @param email
 * @param password
 */
export async function getFirebaseIdToken(email: string, password: string){
    return await axios
        .post<FirebaseTokenResponse>(`${FIREBASE_URI}${FIREBASE_API_TOKEN}`,
            {
                email: email,
                password: password,
                returnSecureToken: true
            });
}

