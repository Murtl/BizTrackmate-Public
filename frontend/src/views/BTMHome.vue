<script setup lang="ts">
import dynamicText from '@/text/dynamicText.json'
import BTMGridBigIcon from '@/components/icons/BTMGridBigIcon.vue'
import BTMEditIcon from '@/components/icons/BTMEditIcon.vue'
import BTMHandshakeIcon from '@/components/icons/BTMHandshakeIcon.vue'
import { onBeforeMount, ref } from 'vue'
import BTMHandsUpIcon from '@/components/icons/BTMHandsUpIcon.vue'
import BTMArrowRightIcon from '@/components/icons/BTMArrowRightIcon.vue'
import router from '@/router'
import { BTMAuthService } from '@/services/BTMAuthService'
import { getCurrentUser } from '@/firebase'
import { useShopNameStore } from '@/stores/shopNameStore'
import { useArticleStore } from '@/stores/articleStore'
import { useArticleGroupStore } from '@/stores/articleGroupStore'
import { useStorageSpaceStore } from '@/stores/storageSpaceStore'
import { useTransactionsStore } from '@/stores/transactionsStore'

const shopNameStore = useShopNameStore()
const avatarRef = ref<HTMLElement>()

const articleStore = useArticleStore()
const articleGroupStore = useArticleGroupStore()
const storageSpaceStore = useStorageSpaceStore()
const transactionsStore = useTransactionsStore()

const loading = ref(true)

onBeforeMount(async () => {
  await articleStore.fetchArticles()
  await articleGroupStore.fetchArticleGroups()
  await storageSpaceStore.fetchStorageSpaces()
  await transactionsStore.fetchTransactions()
  loading.value = false
})

/**
 * Show the account view
 */
const handleShowAccountView = () => {
  router.push('/account')
}

/**
 * Logout the user
 */
const handleLogout = () => {
  setTimeout(async () => {
    const { state, message } = await BTMAuthService.logout()
    if (!state) {
      console.log(message)
    }
    articleStore.resetArticles()
    articleGroupStore.resetArticleGroups()
    storageSpaceStore.resetStorageSpaces()
    transactionsStore.resetTransactions()
  }, 200)
}
</script>

<template>
  <div v-if="loading" class="loading-wrapper">
    <BSpinner label="Spinning" />
  </div>
  <div class="btm-home-host" v-else>
    <header class="sticky-top">
      <BNavbar toggleable="lg" type="light" variant="light">
        <BNavbarBrand>{{ dynamicText.BIZ_Trackmate }}</BNavbarBrand>

        <BNavbarToggle target="nav-collapse"></BNavbarToggle>

        <BCollapse id="nav-collapse" :is-nav="true">
          <BNavbarNav class="mx-auto">
            <BNavItem to="/">
              <BTMGridBigIcon />
              <span>{{ dynamicText.Dashboard }}</span>
            </BNavItem>
            <BNavItem to="/transactions">
              <BTMEditIcon />
              <span>{{ dynamicText.Transactions }}</span>
            </BNavItem>
            <BNavItem to="/inventory">
              <BTMHandshakeIcon />
              <span>{{ dynamicText.Inventory }}</span>
            </BNavItem>
          </BNavbarNav>

          <section class="avatar-wrapper">
            <label>{{ shopNameStore.getShopName() }}</label>
            <BAvatar
              ref="avatarRef"
              variant="primary"
              :text="getCurrentUser()?.email!.toUpperCase().substring(0, 2)"
              :button="true"
            />
            <BPopover :target="avatarRef" placement="bottom" triggers="focus">
              <p>
                <BButton variant="light" @click="handleShowAccountView">
                  <BTMHandsUpIcon />
                  {{ dynamicText.Account }}
                </BButton>
              </p>
              <BButton variant="light" @click="handleLogout">
                <BTMArrowRightIcon />
                {{ dynamicText.Logout }}
              </BButton>
            </BPopover>
          </section>
        </BCollapse>
      </BNavbar>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
@import '@/custom';

.avatar-wrapper {
  display: flex;
  flex-direction: row;
  width: fit-content;
  gap: 10px;
  text-align: right;
  align-items: center;
}

@media screen and (max-width: 991px) {
  .avatar-wrapper {
    text-align: left;
  }
}
</style>
