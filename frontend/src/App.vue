<script setup lang="ts">
import BTMLogin from '@/views/auth/BTMLogin.vue'
import BTMHome from '@/views/BTMHome.vue'
import {ref} from 'vue'
import {useUserStore} from "@/stores/userStore";

const loading = ref(true)

const userStore = useUserStore();

setTimeout(() => {
  loading.value = false
}, 200)

</script>

<template>
  <div v-if="loading" class="loading-wrapper">
    <BSpinner label="Spinning" />
  </div>
  <div v-else>
    <BTMLogin v-if="!userStore.isLoggedIn" />
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
