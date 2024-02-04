<script setup lang="ts">
import dynamicText from '@/text/dynamicText.json'
import type { BTMArticleGroup } from '@/utils/types/btmArticleGroup'
import { computed, ref, watch } from 'vue'
import BTMCustomModalFooter from '@/components/modals/BTMCustomModalFooter.vue'

interface Props {
  /**
   * The article group to display in the modal
   */
  articleGroup: BTMArticleGroup

  /**
   * The visibility state of the modal
   */
  visible: boolean

  /**
   * whether the modal is an add modal or an edit modal
   */
  isAddModal: boolean

  /**
   * The title of the modal
   */
  modalTitle: string

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

const groupTypeOptions = [dynamicText.food, dynamicText.non_food]
const currentArticleGroup = ref(props.articleGroup)
const showModal = ref(props.visible)

const invalidFeedbackGroupNameState = computed(() => {
  return !!currentArticleGroup.value.groupName
})

const saveButtonDisabled = computed(() => {
  return !(
    currentArticleGroup.value.groupName &&
    currentArticleGroup.value.groupType &&
    currentArticleGroup.value.groupId
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
  () => props.articleGroup,
  (value) => {
    currentArticleGroup.value = value
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
          <BFormGroup :label="`${dynamicText.group_id}*`">
            <BFormInput v-model="currentArticleGroup.groupId" disabled />
          </BFormGroup>
        </BCol>
        <BCol>
          <BFormGroup :label="`${dynamicText.group_type}*`">
            <BFormSelect v-model="currentArticleGroup.groupType">
              <BFormSelectOption
                v-for="groupType in groupTypeOptions"
                :key="groupType"
                :value="groupType"
                @click="currentArticleGroup.groupType = groupType"
              >
                {{ groupType }}
              </BFormSelectOption>
            </BFormSelect>
          </BFormGroup>
        </BCol>
      </BRow>
      <BRow>
        <BCol>
          <BFormGroup
            :label="`${dynamicText.group_name}*`"
            :state="invalidFeedbackGroupNameState"
            :invalid-feedback="dynamicText.invalid_article_group_name"
          >
            <BFormInput v-model="currentArticleGroup.groupName" />
          </BFormGroup>
        </BCol>
      </BRow>
      <BRow>
        <BCol>
          <BFormGroup :label="dynamicText.description">
            <BFormInput v-model="currentArticleGroup.description" />
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
