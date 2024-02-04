<script setup lang="ts">
import BTMArticleList from '@/components/lists/BTMArticleList.vue'
import BTMArticleGroupList from '@/components/lists/BTMArticleGroupList.vue'
import BTMStorageSpaceList from '@/components/lists/BTMStorageSpaceList.vue'
import { useArticleStore } from '@/stores/articleStore'
import { useArticleGroupStore } from '@/stores/articleGroupStore'
import { storeToRefs } from 'pinia'
import { useStorageSpaceStore } from '@/stores/storageSpaceStore'

const articleStore = useArticleStore()
const { articles } = storeToRefs(articleStore)

const articleGroupStore = useArticleGroupStore()
const { articleGroups } = storeToRefs(articleGroupStore)

const storageSpaceStore = useStorageSpaceStore()
const { storageSpaces } = storeToRefs(storageSpaceStore)
</script>

<template>
  <div class="btm-inventar-host">
    <BTMArticleList :data="articles" />
    <section class="second-column-wrapper">
      <BTMArticleGroupList :data="articleGroups" />
      <BTMStorageSpaceList :data="storageSpaces" />
    </section>
  </div>
</template>

<style scoped lang="scss">
@import '@/custom.scss';

.btm-inventar-host {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

@media screen and (max-width: 1370px) {
  .btm-inventar-host {
    display: block;
  }
}
</style>
