<script setup lang="ts">
import dynamicText from '@/text/dynamicText.json'
import { computed, ref, watch } from 'vue'
import type { BTMArticle } from '@/utils/types/btmArticle'
import { useArticleGroupStore } from '@/stores/articleGroupStore'
import { useStorageSpaceStore } from '@/stores/storageSpaceStore'
import BTMCustomModalFooter from '@/components/modals/BTMCustomModalFooter.vue'

interface Props {
  /**
   * The article to display in the modal
   */
  article: BTMArticle

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

const articleGroupStore = useArticleGroupStore()
const storageSpaceStore = useStorageSpaceStore()
const currentArticle = ref(props.article)
const showModal = ref(props.visible)

const saveButtonDisabled = computed(() => {
  return !(
    currentArticle.value.articleId &&
    currentArticle.value.name &&
    currentArticle.value.price > 0 &&
    currentArticle.value.articleGroup &&
    currentArticle.value.storageSpace
  )
})

const invalidFeedbackPriceState = computed(() => {
  if (currentArticle.value.price > 0) {
    if (currentArticle.value.price.toString().includes('.')) {
      return currentArticle.value.price.toString().split('.')[1].length <= 2
    }
    return true
  } else {
    return false
  }
})

const invalidFeedbackArticleGroupState = computed(() => {
  return !!currentArticle.value.articleGroup
})

const invalidFeedbackStorageSpaceState = computed(() => {
  return !!currentArticle.value.storageSpace
})

const invalidFeedbackNameState = computed(() => {
  return !!currentArticle.value.name
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
  () => props.article,
  (value) => {
    currentArticle.value = value
    currentArticle.value.articleGroup =
      articleGroupStore.articleGroups.find(
        (articleGroup) => articleGroup.groupDocId === value.articleGroup.groupDocId
      ) ?? currentArticle.value.articleGroup
    currentArticle.value.storageSpace =
      storageSpaceStore.storageSpaces.find(
        (storageSpace) => storageSpace.storageSpaceDocId === value.storageSpace.storageSpaceDocId
      ) ?? currentArticle.value.storageSpace
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
          <BFormGroup :label="`${dynamicText.article_number}*`">
            <BFormInput v-model="currentArticle.articleId" disabled />
          </BFormGroup>
        </BCol>
        <BCol>
          <BFormGroup
            :label="`${dynamicText.selling_price}*`"
            :state="invalidFeedbackPriceState"
            :invalid-feedback="dynamicText.invalid_price"
          >
            <BFormInput v-model="currentArticle.price" type="number" />
          </BFormGroup>
        </BCol>
      </BRow>
      <BRow>
        <BCol>
          <BFormGroup
            :label="`${dynamicText.article_group}*`"
            :state="invalidFeedbackArticleGroupState"
            :invalid-feedback="dynamicText.invalid_article_group"
          >
            <BFormSelect v-model="currentArticle.articleGroup">
              <BFormSelectOption
                v-for="articleGroup in articleGroupStore.articleGroups"
                :key="articleGroup.groupId"
                :value="articleGroup"
                @click="currentArticle.articleGroup = articleGroup"
              >
                {{ articleGroup.groupId }}: {{ articleGroup.groupName }}
              </BFormSelectOption>
            </BFormSelect>
          </BFormGroup>
        </BCol>
        <BCol>
          <BFormGroup
            :label="`${dynamicText.storage_space}*`"
            :state="invalidFeedbackStorageSpaceState"
            :invalid-feedback="dynamicText.invalid_storage_space"
          >
            <BFormSelect v-model="currentArticle.storageSpace">
              <BFormSelectOption
                v-for="storageSpace in storageSpaceStore.storageSpaces"
                :key="storageSpace.storageSpaceId"
                :value="storageSpace"
                @click="currentArticle.storageSpace = storageSpace"
              >
                {{ storageSpace.storageSpaceId }}: {{ storageSpace.storageSpaceType }}
              </BFormSelectOption>
            </BFormSelect>
          </BFormGroup>
        </BCol>
      </BRow>
      <BRow>
        <BCol>
          <BFormGroup
            :label="`${dynamicText.name}*`"
            :invalid-feedback="dynamicText.invalid_article_name"
            :state="invalidFeedbackNameState"
          >
            <BFormInput v-model="currentArticle.name" />
          </BFormGroup>
        </BCol>
      </BRow>
      <BRow>
        <BCol>
          <BFormGroup :label="dynamicText.description">
            <BFormInput v-model="currentArticle.description" />
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
