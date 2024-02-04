import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword
} from 'firebase/auth'
import { getCurrentUser } from '@/firebase'
import dynamicText from '@/text/dynamicText.json'
import axios, { AxiosError } from 'axios'
import { useShopNameStore } from '@/stores/shopNameStore'

/**
 * @description This class contains all the functions for the authentication of the user.
 */
export class BTMAuthService {
  static async register(
    shopName: string,
    email: string,
    password: string
  ): Promise<{ state: boolean; message: string }> {
    const shopNameStore = useShopNameStore()
    try {
      const responseCreateUserAndStore = await axios.post('http://localhost:3000/api/users', {
        email: email,
        password: password,
        confirmPassword: password,
        disabled: false,
        displayName: shopName,
        storeName: shopName
      })
      shopNameStore.setShopNameAndId(shopName, responseCreateUserAndStore.data.storeId)
      return { state: true, message: dynamicText.auth_register_successful }
    } catch (e: any) {
      const axiosError = JSON.parse((e as AxiosError).request.response)
      if (axiosError.message === 'Validation failed!') {
        return { state: false, message: dynamicText.auth_weak_password }
      }
      switch (axiosError.additionalInfo.code) {
        case 'auth/email-already-exists':
          return { state: false, message: dynamicText.auth_E_Mail_already_in_use }
        case 'auth/invalid-email':
          return { state: false, message: dynamicText.auth_invalid_E_Mail }
        default:
          return { state: false, message: dynamicText.auth_unknown_error }
      }
    }
  }

  /**
   * @description This function logs the user in.
   * @param email E-Mail of the user
   * @param password Password of the user
   * @returns {Promise<{state: boolean, message: string}>} Returns a promise with the state and the message.
   */
  static async login(
    email: string,
    password: string
  ): Promise<{ state: boolean; message: string }> {
    const auth = getAuth()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { state: true, message: dynamicText.auth_login_successful }
    } catch (e: any) {
      switch (e.message) {
        case 'Firebase: Error (auth/user-not-found).':
          return { state: false, message: dynamicText.auth_user_not_found }
        case 'Firebase: Error (auth/wrong-password).':
          return { state: false, message: dynamicText.auth_wrong_password }
        case 'Firebase: Error (auth/invalid-email).':
          return { state: false, message: dynamicText.auth_invalid_E_Mail }
        case 'Firebase: Error (auth/user-disabled).':
          return { state: false, message: dynamicText.auth_user_disabled }
        default:
          return { state: false, message: dynamicText.auth_unknown_error }
      }
    }
  }

  /**
   * @description This function changes the E-Mail of the user.
   * @param newMail New E-Mail of the user
   * @returns {Promise<{state: boolean, message: string}>} Returns a promise with the state and the message.
   */
  static async changeMail(newMail: string): Promise<{ state: boolean; message: string }> {
    const user = getCurrentUser()
    if (user) {
      try {
        await updateEmail(user, newMail)
        return { state: true, message: dynamicText.auth_E_Mail_change_successful }
      } catch (e: any) {
        switch (e.message) {
          case 'Firebase: Error (auth/requires-recent-login).':
            return { state: false, message: 'auth/requires-recent-login' }
          case 'Firebase: Error (auth/email-already-in-use).':
            return { state: false, message: dynamicText.auth_E_Mail_already_in_use }
          case 'Firebase: Error (auth/invalid-email).':
            return { state: false, message: dynamicText.auth_invalid_E_Mail }
          default:
            return { state: false, message: dynamicText.auth_unknown_error }
        }
      }
    }
    return { state: false, message: dynamicText.auth_no_user_logged_in }
  }

  /**
   * @description This function changes the password of the user.
   * @param oldPassword Old password of the user
   * @param newPassword New password of the user
   * @returns {Promise<{state: boolean, message: string}>} Returns a promise with the state and the message.
   */
  static async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<{
    state: boolean
    message: string
  }> {
    const user = getCurrentUser()
    if (user) {
      try {
        await BTMAuthService.reauthenticate(oldPassword)
        await updatePassword(user, newPassword)
        return { state: true, message: dynamicText.auth_password_change_successful }
      } catch (e: any) {
        if (e.message.toString().includes('auth/weak-password')) {
          return { state: false, message: dynamicText.auth_weak_password }
        }
        return { state: false, message: dynamicText.auth_unknown_error }
      }
    }
    return { state: false, message: dynamicText.auth_no_user_logged_in }
  }

  /**
   * @description This function reauthenticates the user.
   * @param password Password of the user
   * @returns {Promise<{state: boolean, message: string}>} Returns a promise with the state and the message.
   */
  static async reauthenticate(password: string): Promise<{ state: boolean; message: string }> {
    const user = getCurrentUser()
    if (user && typeof user.email === 'string') {
      const credentials = EmailAuthProvider.credential(user.email, password)
      try {
        await reauthenticateWithCredential(user, credentials)
        return { state: true, message: dynamicText.auth_reauthenticate_successful }
      } catch (e: any) {
        switch (e.message) {
          case 'Firebase: Error (auth/user-mismatch).':
            return { state: false, message: dynamicText.auth_user_mismatch }
          case 'Firebase: Error (auth/user-not-found).':
            return { state: false, message: dynamicText.auth_user_not_found }
          case 'Firebase: Error (auth/invalid-email).':
            return { state: false, message: dynamicText.auth_invalid_E_Mail }
          case 'Firebase: Error (auth/invalid-credential).':
            return { state: false, message: dynamicText.auth_invalid_credentials }
          case 'Firebase: Error (auth/wrong-password).':
            return { state: false, message: dynamicText.auth_wrong_password }
          case 'Firebase: Error (auth/invalid-verification-code).':
            return { state: false, message: dynamicText.auth_invalid_verification_code }
          case 'Firebase: Error (auth/invalid-verification-id).':
            return { state: false, message: dynamicText.auth_invalid_verification_id }
          default:
            return { state: false, message: dynamicText.auth_unknown_error }
        }
      }
    }
    return { state: false, message: dynamicText.auth_no_user_logged_in }
  }

  /**
   * @description This function logs out the user.
   * @returns {Promise<{state: boolean, message: string}>} Returns a promise with the state and the message.
   */
  static async logout(): Promise<{
    state: boolean
    message: string
  }> {
    const user = getCurrentUser()
    if (user) {
      try {
        await getAuth().signOut()
        return { state: true, message: dynamicText.auth_logout_successful }
      } catch (e: any) {
        return { state: false, message: dynamicText.auth_unknown_error }
      }
    }
    return { state: false, message: dynamicText.auth_no_user_logged_in }
  }
}
