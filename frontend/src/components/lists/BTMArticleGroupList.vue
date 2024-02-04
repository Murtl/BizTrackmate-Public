<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import BTMPlusIcon from '@/components/icons/BTMPlusIcon.vue'
import { BButton, BFormInput, BTable } from 'bootstrap-vue-3'
import BTMEditItemIcon from '@/components/icons/BTMEditItemIcon.vue'
import { useArticleGroupStore } from '@/stores/articleGroupStore'
import type { BTMArticleGroup } from '@/utils/types/btmArticleGroup'
import dynamicText from '@/text/dynamicText.json'
import BTMDeleteModal from '@/components/modals/BTMDeleteModal.vue'
import BTMArticleGroupModal from '@/components/modals/BTMArticleGroupModal.vue'
import { filterArticleGroups } from '@/utils/functions/article-group/filterArticleGroups'

interface Props {
  /**
   * The data to display in the table
   * Needs to come from outside the component so the searchbar works properly
   */
  data: BTMArticleGroup[]
}

const props = defineProps<Props>()

const articleGroupStore = useArticleGroupStore()
const articleGroupData = ref(props.data)
const articleGroupDataFilter = ref('')
const articleGroupDataFields = [
  { key: 'groupId', label: dynamicText.group_id },
  { key: 'groupName', label: dynamicText.group_name },
  { key: 'groupType', label: dynamicText.group_type },
  { key: 'currentStock', label: dynamicText.current_stock },
  { key: 'actions', label: '' }
]
const groupTypeOptions = [dynamicText.food, dynamicText.non_food]
const currentArticleGroup: Ref<BTMArticleGroup> = ref({
  groupDocId: '',
  groupId: '',
  groupName: '',
  groupType: '',
  currentStock: 0,
  description: ''
})

const showModal = ref(false)
const modalTitle = ref('')
const isAddModal = ref(false)

const showSafeDeleteModal = ref(false)

const showErrorModal = ref(false)
const errorModalTitle = ref('')
const errorModalText = ref('')

watch(articleGroupDataFilter, (newFilter) => {
  articleGroupData.value = props.data
  articleGroupData.value = filterArticleGroups(articleGroupData.value, newFilter)
})

watch(
  () => props.data,
  (newData) => {
    articleGroupData.value = newData
    articleGroupData.value = filterArticleGroups(
      articleGroupData.value,
      articleGroupDataFilter.value
    )
  },
  { deep: true }
)

const showAddModal = () => {
  resetCurrentArticleGroup()
  isAddModal.value = true
  modalTitle.value = dynamicText.add_article_group
  showModal.value = true
}

const showEditModal = (articleGroup: BTMArticleGroup) => {
  currentArticleGroup.value = {
    groupDocId: articleGroup.groupDocId,
    groupId: articleGroup.groupId,
    groupName: articleGroup.groupName,
    groupType: articleGroup.groupType,
    currentStock: articleGroup.currentStock,
    description: articleGroup.description
  }
  isAddModal.value = false
  modalTitle.value = dynamicText.edit_article_group
  showModal.value = true
}

const handleCloseModal = () => {
  showModal.value = false
  setTimeout(() => {
    isAddModal.value = false
  }, 500)
}

const handleCloseModalOnSave = async () => {
  if (isAddModal.value) {
    const { state, message } = await articleGroupStore.addArticleGroup(currentArticleGroup.value)
    if (!state) {
      showErrorModal.value = true
      errorModalTitle.value = dynamicText.error_add
      errorModalText.value = message
    }
  } else {
    const { state, message } = await articleGroupStore.updateArticleGroup(currentArticleGroup.value)
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
  const { state, message } = await articleGroupStore.removeArticleGroup(
    currentArticleGroup.value.groupDocId
  )
  if (!state) {
    showErrorModal.value = true
    errorModalTitle.value = dynamicText.error_delete
    errorModalText.value = message
  }
}

const resetCurrentArticleGroup = () => {
  currentArticleGroup.value = {
    groupDocId: '',
    groupId:
      props.data.length > 0
        ? `GR-${parseInt(props.data[props.data.length - 1].groupId.split('-')[1]) + 1}`
        : 'GR-1',
    groupName: '',
    groupType: groupTypeOptions[0],
    currentStock: 0,
    description: ''
  }
}
</script>

<template>
  <div class="btm-article-group-list-host">
    <label>{{ dynamicText.article_group }}</label>
    <section class="header-table">
      <BFormInput
        :placeholder="dynamicText.search_article_group"
        v-model="articleGroupDataFilter"
      />
      <BButton variant="primary" @click="showAddModal">
        <BTMPlusIcon />
      </BButton>
    </section>
    <BTable responsive :items="articleGroupData" :fields="articleGroupDataFields">
      <template #cell(actions)="row">
        <BTMEditItemIcon class="edit-icon" @click="showEditModal(row.item)" />
      </template>
    </BTable>
  </div>
  <BTMArticleGroupModal
    v-model:visible="showModal"
    :handle-close-modal="handleCloseModal"
    :modal-title="modalTitle"
    :article-group="currentArticleGroup"
    :handle-close-modal-on-save="handleCloseModalOnSave"
    :is-add-modal="isAddModal"
    :handle-close-modal-on-delete="handleCloseModalOnDelete"
  />
  <BTMDeleteModal v-model:visible="showSafeDeleteModal" :handle-safe-delete="handleSafeDelete" />
  <BModal v-model="showErrorModal" :title="errorModalTitle">{{ errorModalText }}</BModal>
</template>

<style scoped lang="scss">
@import '@/custom.scss';

.btm-article-group-list-host {
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
