<script setup lang="ts">
import BTMLogin from '@/views/auth/BTMLogin.vue'
import BTMHome from '@/views/BTMHome.vue'
import { onAuthStateChanged } from 'firebase/auth'
import { getAuth } from 'firebase/auth'
import { ref } from 'vue'
import { useShopNameStore } from '@/stores/shopNameStore'

const loggedIn = ref(false)
const loading = ref(true)
const shopNameStore = useShopNameStore()

onAuthStateChanged(getAuth(), async (user) => {
  if (user) {
    // Benutzer ist angemeldet
    const token = await user.getIdTokenResult()
    shopNameStore.setShopNameAndId(token.claims.name, token.claims.storeId)
    loading.value = false
    loggedIn.value = true
  } else {
    // Benutzer ist abgemeldet
    loading.value = false
    loggedIn.value = false
  }
})
</script>

<template>
  <div v-if="loading" class="loading-wrapper">
    <BSpinner label="Spinning" />
  </div>
  <div v-else>
    <BTMLogin v-if="!loggedIn" />
    <BTMHome v-else />
  </div>
</template>

<style lang="scss">
@import '@/custom';

body {
  background-color: $background-main-color !important;
  margin: 0;
  font-family: $font-family-base !important;
  user-select: none;
}

.active {
  color: $primary !important;
}

.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}
</style>
