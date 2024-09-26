import dynamicText from '@/text/dynamicText.json'
import { useShopNameStore } from '@/stores/shopNameStore'
import { v4 as uuidv4 } from 'uuid'
import {useUserStore} from "@/stores/userStore";

export type userType = {
    id: string
    email: string
    password: string
    displayName: string
    storeName: string
    disabled: boolean
}

const users = [
  {
    id: '12345',
    email: 'murtl@btm.de',
    password: '1234',
    displayName: 'Murtl',
    storeName: 'Murtls Shop',
    disabled: false
  }
]

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
      users.push({
        id: uuidv4(),
        email: email,
        password: password,
        displayName: email,
        storeName: shopName,
        disabled: false
      })
      shopNameStore.setShopNameAndId(shopName, uuidv4())
      return { state: true, message: dynamicText.auth_register_successful }
    } catch (e: any) {
        return { state: false, message: e.message}
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
    try {
        const user = users.find((user) => user.email === email)
        if (!user) {
          return { state: false, message: dynamicText.auth_user_not_found }
        }
        if (user.password !== password) {
          return { state: false, message: dynamicText.auth_wrong_password }
        }
        if (user.disabled) {
          return { state: false, message: dynamicText.auth_user_disabled }
        }
        const shopNameStore = useShopNameStore()
        shopNameStore.setShopNameAndId(user.storeName, user.id)
        const userStore = useUserStore();
        userStore.setLoggedInUser(user)
      return { state: true, message: dynamicText.auth_login_successful }
    } catch (e: any) {
      return { state: false, message: e.message}
    }
  }

  /**
   * @description This function changes the E-Mail of the user.
   * @param newMail New E-Mail of the user
   * @returns {Promise<{state: boolean, message: string}>} Returns a promise with the state and the message.
   */
  static async changeMail(newMail: string): Promise<{ state: boolean; message: string }> {
    const userStore = useUserStore()
    const user = users.find((user) => user.id === userStore.currentUser?.id)
    if (userStore.currentUser && user) {
      try {
        user.email = newMail
        userStore.currentUser.email = newMail
        return { state: true, message: dynamicText.auth_E_Mail_change_successful }
      } catch (e: any) {
        return { state: false, message: e.message}
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
    const userStore = useUserStore()
    const user = users.find((user) => user.id === userStore.currentUser?.id)
    if (userStore.currentUser && user) {
      try {
        if (user.password !== oldPassword) {
          return { state: false, message: dynamicText.auth_wrong_password }
        }
        user.password = newPassword
        userStore.currentUser.password = newPassword
        return { state: true, message: dynamicText.auth_password_change_successful }
      } catch (e: any) {
        return { state: false, message: e.message}
      }
    }
    return { state: false, message: dynamicText.auth_no_user_logged_in }
  }
}
