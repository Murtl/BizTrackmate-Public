<script setup lang="ts">
import dynamicText from '@/text/dynamicText.json'
import { computed, ref, watch } from 'vue'
import type { BTMStorageSpace } from '@/utils/types/btmStorageSpace'
import BTMCustomModalFooter from '@/components/modals/BTMCustomModalFooter.vue'

interface Props {
  /**
   * The storage space to display in the modal
   */
  storageSpace: BTMStorageSpace

  /**
   * The title of the modal
   */
  modalTitle: string

  /**
   * The visibility state of the modal
   */
  visible: boolean

  /**
   * whether the modal is an add modal or an edit modal
   */
  isAddModal: boolean

  /**
   * The function to call when the user clicks the close button
   */
  handleCloseModal: () => void

  /**
   * The function to call when the user clicks the delete button
   */
  handleCloseModalOnDelete: () => void

  /**
   * The function to call when the user clicks the save button
   */
  handleCloseModalOnSave: () => void
}

const props = defineProps<Props>()

interface Emits {
  /**
   * The event to emit when the visibility state of the modal changes
   * @param event the event name
   * @param value the new visibility state
   */
  (event: 'update:visible', value: boolean): void
}

const emit = defineEmits<Emits>()

const showModal = ref(props.visible)
const currentStorageSpace = ref(props.storageSpace)
const placeTypeOptions = [
  dynamicText.shelf,
  dynamicText.room,
  dynamicText.frozen,
  dynamicText.cellar
]

const invalidFeedbackStoragePlaceNameState = computed(() => {
  return !!currentStorageSpace.value.storageSpaceName
})

const saveButtonDisabled = computed(() => {
  return !(
    currentStorageSpace.value.storageSpaceId &&
    currentStorageSpace.value.storageSpaceName &&
    currentStorageSpace.value.storageSpaceType
  )
})

watch(
  () => props.visible,
  (value) => {
    showModal.value = value
  }
)

watch(
  () => showModal.value,
  (value) => {
    emit('update:visible', value)
  }
)

watch(
  () => props.storageSpace,
  (value) => {
    currentStorageSpace.value = value
  }
)
</script>

<template>
  <BModal
    v-model="showModal"
    :title="modalTitle"
    size="lg"
    :no-close-on-backdrop="true"
    :no-close-on-esc="true"
  >
    <BContainer>
      <BRow>
        <BCol>
          <BFormGroup :label="`${dynamicText.place_number}*`">
            <BFormInput v-model="currentStorageSpace.storageSpaceId" disabled />
          </BFormGroup>
        </BCol>
        <BCol>
          <BFormGroup :label="`${dynamicText.storage_type}*`">
            <BFormSelect v-model="currentStorageSpace.storageSpaceType">
              <BFormSelectOption
                v-for="placeType in placeTypeOptions"
                :key="placeType"
                :value="placeType"
              >
                {{ placeType }}
              </BFormSelectOption>
            </BFormSelect>
          </BFormGroup>
        </BCol>
      </BRow>
      <BRow>
        <BCol>
          <BFormGroup
            :label="`${dynamicText.storage_space_name}*`"
            :state="invalidFeedbackStoragePlaceNameState"
            :invalid-feedback="dynamicText.invalid_storage_space_name"
          >
            <BFormInput v-model="currentStorageSpace.storageSpaceName" />
          </BFormGroup>
        </BCol>
      </BRow>
      <BRow>
        <BCol>
          <BFormGroup :label="dynamicText.description">
            <BFormInput v-model="currentStorageSpace.description" />
          </BFormGroup>
        </BCol>
      </BRow>
    </BContainer>
    <template #footer>
      <BTMCustomModalFooter
        :handle-close-modal="handleCloseModal"
        :handle-close-modal-on-save="handleCloseModalOnSave"
        :is-add-modal="isAddModal"
        :save-button-disabled="saveButtonDisabled"
        :handle-close-modal-on-delete="handleCloseModalOnDelete"
      />
    </template>
  </BModal>
</template>
