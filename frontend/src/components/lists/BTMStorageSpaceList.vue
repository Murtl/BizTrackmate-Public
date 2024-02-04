<script setup lang="ts">
import { ref, watch } from 'vue'
import BTMPlusIcon from '@/components/icons/BTMPlusIcon.vue'
import { BButton, BFormInput, BTable } from 'bootstrap-vue-3'
import BTMEditItemIcon from '@/components/icons/BTMEditItemIcon.vue'
import { useStorageSpaceStore } from '@/stores/storageSpaceStore'
import dynamicText from '@/text/dynamicText.json'
import type { BTMStorageSpace } from '@/utils/types/btmStorageSpace'
import type { Ref } from 'vue'
import BTMDeleteModal from '@/components/modals/BTMDeleteModal.vue'
import BTMStorageSpaceModal from '@/components/modals/BTMStorageSpaceModal.vue'
import { filterStorageSpaces } from '@/utils/functions/storage-space/filterStorageSpaces'

interface Props {
  /**
   * The data to display in the table
   * Needs to come from outside the component so the searchbar works properly
   */
  data: BTMStorageSpace[]
}

const props = defineProps<Props>()

const storageSpaceStore = useStorageSpaceStore()
const storageSpaceData = ref(props.data)
const storageSpaceDataFilter = ref('')
const storageSpaceDataFields = [
  { key: 'storageSpaceId', label: dynamicText.place_number },
  { key: 'storageSpaceName', label: dynamicText.storage_space_name },
  { key: 'storageSpaceType', label: dynamicText.storage_type },
  { key: 'actions', label: '' }
]
const storageSpaceTypeOptions = [
  dynamicText.shelf,
  dynamicText.room,
  dynamicText.frozen,
  dynamicText.cellar
]
const currentStorageSpace: Ref<BTMStorageSpace> = ref({
  storageSpaceDocId: '',
  storageSpaceId: '',
  storageSpaceName: '',
  storageSpaceType: '',
  description: ''
})

const showModal = ref(false)
const modalTitle = ref('')
const isAddModal = ref(false)

const showSafeDeleteModal = ref(false)

const showErrorModal = ref(false)
const errorModalTitle = ref('')
const errorModalText = ref('')

watch(storageSpaceDataFilter, (newFilter) => {
  storageSpaceData.value = props.data
  storageSpaceData.value = filterStorageSpaces(storageSpaceData.value, newFilter)
})

watch(
  () => props.data,
  (newData) => {
    storageSpaceData.value = newData
    storageSpaceData.value = filterStorageSpaces(
      storageSpaceData.value,
      storageSpaceDataFilter.value
    )
  },
  { deep: true }
)

const showAddModal = () => {
  resetCurrentStorageSpace()
  isAddModal.value = true
  modalTitle.value = dynamicText.add_storage_space
  showModal.value = true
}

const showEditModal = (storageSpace: BTMStorageSpace) => {
  currentStorageSpace.value = {
    storageSpaceDocId: storageSpace.storageSpaceDocId,
    storageSpaceId: storageSpace.storageSpaceId,
    storageSpaceName: storageSpace.storageSpaceName,
    storageSpaceType: storageSpace.storageSpaceType,
    description: storageSpace.description
  }
  isAddModal.value = false
  modalTitle.value = dynamicText.edit_storage_space
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
    const { state, message } = await storageSpaceStore.addStorageSpace(currentStorageSpace.value)
    if (!state) {
      showErrorModal.value = true
      errorModalTitle.value = dynamicText.error_add
      errorModalText.value = message
    }
  } else {
    const { state, message } = await storageSpaceStore.updateStorageSpace(currentStorageSpace.value)
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
  const { state, message } = await storageSpaceStore.removeStorageSpace(
    currentStorageSpace.value.storageSpaceDocId
  )
  if (!state) {
    showErrorModal.value = true
    errorModalTitle.value = dynamicText.error_delete
    errorModalText.value = message
  }
}

const resetCurrentStorageSpace = () => {
  currentStorageSpace.value = {
    storageSpaceDocId: '',
    storageSpaceId:
      props.data.length > 0
        ? `L-${parseInt(props.data[props.data.length - 1].storageSpaceId.split('-')[1]) + 1}`
        : 'L-1',
    storageSpaceType: storageSpaceTypeOptions[0],
    storageSpaceName: '',
    description: ''
  }
}
</script>

<template>
  <div class="btm-storage-space-list-host">
    <label>{{ dynamicText.storage_spaces }}</label>
    <section class="header-table">
      <BFormInput
        :placeholder="dynamicText.search_storage_space"
        v-model="storageSpaceDataFilter"
      />
      <BButton variant="primary" @click="showAddModal">
        <BTMPlusIcon />
      </BButton>
    </section>
    <BTable responsive :items="storageSpaceData" :fields="storageSpaceDataFields">
      <template #cell(actions)="row">
        <BTMEditItemIcon class="edit-icon" @click="showEditModal(row.item)" />
      </template>
    </BTable>
  </div>
  <BTMStorageSpaceModal
    v-model:visible="showModal"
    :handle-close-modal="handleCloseModal"
    :modal-title="modalTitle"
    :handle-close-modal-on-save="handleCloseModalOnSave"
    :storage-space="currentStorageSpace"
    :is-add-modal="isAddModal"
    :handle-close-modal-on-delete="handleCloseModalOnDelete"
  />
  <BTMDeleteModal v-model:visible="showSafeDeleteModal" :handle-safe-delete="handleSafeDelete" />
  <BModal v-model="showErrorModal" :title="errorModalTitle">{{ errorModalText }}</BModal>
</template>

<style scoped lang="scss">
@import '@/custom.scss';

.btm-storage-space-list-host {
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
