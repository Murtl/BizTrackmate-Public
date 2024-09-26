import { defineStore } from 'pinia'
import {type Ref, ref} from 'vue'
import type {userType} from "@/services/BTMAuthService";

/**
 * store for the current user + state
 */
export const useUserStore = defineStore('userStore', () => {
    const isLoggedIn = ref(false)
    const currentUser: Ref<userType> = ref({
        id: '',
        email: '',
        password: '',
        displayName: '',
        storeName: '',
        disabled: false
    })

    function setLoggedInUser(user: userType) {
        currentUser.value = user
        isLoggedIn.value = true
    }

    function logout() {
        currentUser.value = {
            id: '',
            email: '',
            password: '',
            displayName: '',
            storeName: '',
            disabled: false
        }
        isLoggedIn.value = false
    }

    return { isLoggedIn, currentUser, setLoggedInUser, logout }
})
