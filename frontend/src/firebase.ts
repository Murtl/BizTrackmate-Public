import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

/**
 * @description: This is the firebase config for the application
 */
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
}

initializeApp(firebaseConfig)

/**
 * @description: Gets the current user
 */
export const getCurrentUser = () => {
  return getAuth().currentUser
}
