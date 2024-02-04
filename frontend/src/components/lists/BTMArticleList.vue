<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import BTMPlusIcon from '@/components/icons/BTMPlusIcon.vue'
import { BButton, BFormInput, BTable } from 'bootstrap-vue-3'
import BTMEditItemIcon from '@/components/icons/BTMEditItemIcon.vue'
import type { BTMArticle } from '@/utils/types/btmArticle'
import dynamicText from '@/text/dynamicText.json'
import { useArticleStore } from '@/stores/articleStore'
import { useArticleGroupStore } from '@/stores/articleGroupStore'
import { useStorageSpaceStore } from '@/stores/storageSpaceStore'
import BTMDeleteModal from '@/components/modals/BTMDeleteModal.vue'
import BTMArticleListModal from '@/components/modals/BTMArticleModal.vue'
import { filterArticles } from '@/utils/functions/article/filterArticles'

interface Props {
  /**
   * The data to display in the table
   * Needs to come from outside the component so the searchbar works properly
   */
  data: BTMArticle[]
}

const props = defineProps<Props>()

const articleGroupStore = useArticleGroupStore()
const storageSpaceStore = useStorageSpaceStore()

const articleStore = useArticleStore()
const articleList = ref(props.data)
const articleDataFilter = ref('')
const articleDataFields = [
  { key: 'articleId', label: dynamicText.article_number },
  { key: 'name', label: dynamicText.name },
  { key: 'price', label: dynamicText.selling_price },
  { key: 'stock', label: dynamicText.stock },
  { key: 'actions', label: '' }
]
const currentArticle: Ref<BTMArticle> = ref({
  articleDocId: '',
  articleId: 'A-1',
  name: '',
  price: 0,
  stock: 0,
  articleGroup: {
    groupDocId: '',
    groupId: '',
    groupName: '',
    groupType: '',
    currentStock: 0,
    description: ''
  },
  storageSpace: {
    storageSpaceDocId: '',
    storageSpaceId: '',
    storageSpaceName: '',
    storageSpaceType: '',
    description: ''
  },
  description: ''
})

const showModal = ref(false)
const modalTitle = ref('')
const isAddModal = ref(false)

const showSafeDeleteModal = ref(false)

const showErrorModal = ref(false)
const errorModalTitle = ref('')
const errorModalText = ref('')

watch(articleDataFilter, (newFilter) => {
  articleList.value = props.data
  articleList.value = filterArticles(articleList.value, newFilter)
})

watch(
  () => props.data,
  (newData) => {
    articleList.value = newData
    articleList.value = filterArticles(articleList.value, articleDataFilter.value)
  },
  { deep: true }
)

const showAddModal = () => {
  resetCurrentArticle()
  isAddModal.value = true
  modalTitle.value = dynamicText.add_article
  showModal.value = true
}

const showEditModal = (article: BTMArticle) => {
  currentArticle.value = {
    articleDocId: article.articleDocId,
    articleId: article.articleId,
    name: article.name,
    price: article.price,
    stock: article.stock,
    articleGroup: article.articleGroup,
    storageSpace: article.storageSpace,
    description: article.description
  }
  isAddModal.value = false
  modalTitle.value = dynamicText.edit_article
  showModal.value = true
}

const handleCloseModal = () => {
  showModal.value = false
  setTimeout(() => {
    isAddModal.value = false
  }, 500)
}

const handleCloseModalOnSave = async () => {
  currentArticle.value.price = parseFloat(currentArticle.value.price.toString())
  currentArticle.value.articleGroup = Object.assign({}, currentArticle.value.articleGroup)
  currentArticle.value.storageSpace = Object.assign({}, currentArticle.value.storageSpace)
  if (isAddModal.value) {
    const { state, message } = await articleStore.addArticle(currentArticle.value)
    if (!state) {
      showErrorModal.value = true
      errorModalTitle.value = dynamicText.error_add
      errorModalText.value = message
    }
  } else {
    const { state, message } = await articleStore.updateArticle(currentArticle.value)
    if (!state) {
      showErrorModal.value = true
      errorModalTitle.value = dynamicText.error_edit
      errorModalText.value = message
    }
  }
  handleCloseModal()
}

const handleCloseModalOnDelete = () => {
  if (!isAddModal.value) {
    showSafeDeleteModal.value = true
  }
  handleCloseModal()
}

const handleSafeDelete = async () => {
  const { state, message } = await articleStore.removeArticle(currentArticle.value.articleDocId)
  if (!state) {
    showErrorModal.value = true
    errorModalTitle.value = dynamicText.error_delete
    errorModalText.value = message
  }
}

const resetCurrentArticle = () => {
  currentArticle.value = {
    articleDocId: '',
    articleId:
      props.data.length > 0
        ? `A-${parseInt(props.data[props.data.length - 1].articleId.split('-')[1]) + 1}`
        : 'A-1',
    name: '',
    price: 0,
    stock: 0,
    articleGroup:
      articleGroupStore.articleGroups.length > 0
        ? articleGroupStore.articleGroups[0]
        : {
            groupDocId: '',
            groupId: '',
            groupName: '',
            groupType: '',
            currentStock: 0,
            description: ''
          },
    storageSpace:
      storageSpaceStore.storageSpaces.length > 0
        ? storageSpaceStore.storageSpaces[0]
        : {
            storageSpaceDocId: '',
            storageSpaceId: '',
            storageSpaceName: '',
            storageSpaceType: '',
            description: ''
          },
    description: ''
  }
}
</script>

<template>
  <div class="btm-article-list-host">
    <label>{{ dynamicText.article }}</label>
    <section class="header-table">
      <BFormInput :placeholder="dynamicText.search_article" v-model="articleDataFilter" />
      <BButton variant="primary" @click="showAddModal">
        <BTMPlusIcon />
      </BButton>
    </section>
    <BTable responsive :items="articleList" :fields="articleDataFields">
      <template #cell(price)="row"> {{ row.item.price }} € </template>
      <template #cell(actions)="row">
        <BTMEditItemIcon @click="showEditModal(row.item)" class="edit-icon" />
      </template>
    </BTable>
  </div>
  <BTMArticleListModal
    v-model:visible="showModal"
    :handle-close-modal="handleCloseModal"
    :modal-title="modalTitle"
    :handle-close-modal-on-save="handleCloseModalOnSave"
    :is-add-modal="isAddModal"
    :article="currentArticle"
    :handle-close-modal-on-delete="handleCloseModalOnDelete"
  />
  <BTMDeleteModal v-model:visible="showSafeDeleteModal" :handle-safe-delete="handleSafeDelete" />
  <BModal v-model="showErrorModal" :title="errorModalTitle">{{ errorModalText }}</BModal>
</template>

<style scoped lang="scss">
@import '@/custom.scss';

.btm-article-list-host {
  box-shadow: $main-box-shadow;
  background-color: $light;
  border-radius: $outer-elements-border-radius;
  padding: 20px;
  margin: 10px;

  .edit-icon {
    cursor: pointer;
  }

  .header-table {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    gap: 10px;
  }
}
</style>
