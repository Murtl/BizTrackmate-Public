<script setup lang="ts">
import dynamicText from '@/text/dynamicText.json'
import { transactionsTypesConstant } from '@/utils/contants'
import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { BTMTransaction } from '@/utils/types/btmTransaction'
import BTMCrossIcon from '@/components/icons/BTMCrossIcon.vue'
import BTMPlusIcon from '@/components/icons/BTMPlusIcon.vue'
import { calculateTotalAmountOfTransaction } from '@/utils/functions/transaction/calculateTotalAmountOfTransaction'
import type { BTMTransactionItem } from '@/utils/types/btmTransactionItem'
import { useArticleStore } from '@/stores/articleStore'
import { checkIfItemIsInStock } from '@/utils/functions/transaction/checkIfItemIsInStock'
import { useArticleGroupStore } from '@/stores/articleGroupStore'
import { useStorageSpaceStore } from '@/stores/storageSpaceStore'
import { checkFor2Digits } from '@/utils/functions/transaction/checkFor2Digits'

interface Props {
  /**
   * The visibility of the modal
   */
  visible: boolean

  /**
   * The transaction to display
   */
  transaction: BTMTransaction

  /**
   * The title of the modal
   */
  modalTitle: string

  /**
   * whether the modal is an add modal or an edit modal
   */
  isAddModal: boolean

  /**
   * The function to call when the user clicks the close button
   */
  handleCloseModal: () => void

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

const articleStore = useArticleStore()
const articleGroupStore = useArticleGroupStore()
const storageSpaceStore = useStorageSpaceStore()
const showModal = ref(props.visible)
const currentTransaction = ref(props.transaction)
const currentDate = ref('')

const currentItem: Ref<BTMTransactionItem> = ref({
  quantity: 1,
  price: 0,
  article:
    articleStore.articles.length > 0
      ? articleStore.articles[0]
      : {
          articleDocId: '',
          articleId: '',
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
})

const transactionTypeSelectDisabled = computed(() => {
  return currentTransaction.value.items.length > 0 || !props.isAddModal
})

const saveButtonDisabled = computed(() => {
  return !(
    currentTransaction.value.day &&
    currentTransaction.value.month &&
    currentTransaction.value.year !== 0 &&
    currentTransaction.value.items.length > 0 &&
    currentTransaction.value.transactionId &&
    currentTransaction.value.transactionType
  )
})

const invalidFeedbackDateState = computed(() => {
  return !!currentDate.value
})

const invalidFeedbackTransactionItemsState = computed(() => {
  return currentTransaction.value.items.length > 0
})

const addButtonDisabled = computed(() => {
  return !(
    currentItem.value.quantity > 0 &&
    checkIfItemIsInStock(currentTransaction.value, articleStore.articles, currentItem.value) &&
    currentItem.value.price > 0 &&
    checkFor2Digits(currentItem.value.price) &&
    currentItem.value.article
  )
})

const invalidFeedbackArticleCount = computed(() => {
  return articleStore.articles.length > 0
})

const invalidFeedbackItemQuantityState = computed(() => {
  return (
    currentItem.value.quantity > 0 &&
    checkIfItemIsInStock(currentTransaction.value, articleStore.articles, currentItem.value)
  )
})

const invalidFeedbackItemPriceState = computed(() => {
  if (currentItem.value.price > 0) {
    return checkFor2Digits(currentItem.value.price)
  } else {
    return false
  }
})

const determineInvalidFeedbackItemQuantity = computed(() => {
  if (currentItem.value.quantity <= 0) {
    return dynamicText.invalid_item_quantity
  }
  if (!checkIfItemIsInStock(currentTransaction.value, articleStore.articles, currentItem.value)) {
    return dynamicText.invalid_item_quantity_in_stock
  }
  return ''
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
  () => props.transaction,
  (value) => {
    currentDate.value = new Date().toISOString().slice(0, 10)
    currentTransaction.value = value
  }
)

watch(currentDate, () => {
  currentTransaction.value.day = parseInt(currentDate.value.split('-')[2])
  currentTransaction.value.month = parseInt(currentDate.value.split('-')[1])
  currentTransaction.value.year = parseInt(currentDate.value.split('-')[0])
})

watch(
  currentItem,
  () => {
    if (currentTransaction.value.transactionType === dynamicText.outcome_storage) {
      articleStore.articles.forEach((article) => {
        if (article === currentItem.value.article) {
          currentItem.value.price = article.price
        }
      })
    }
  },
  { deep: true }
)

watch(
  () => currentTransaction.value.transactionType,
  () => {
    if (currentTransaction.value.transactionType === dynamicText.outcome_storage) {
      currentItem.value.price = currentItem.value.article.price
    }
    if (currentTransaction.value.transactionType === dynamicText.income_storage) {
      currentItem.value.price = 0
    }
  },
  { deep: true, immediate: true }
)

const handleAddItemToCurrentTransaction = () => {
  currentItem.value.price = parseFloat(currentItem.value.price.toString())
  currentTransaction.value.items.push(Object.assign(currentItem.value))
  currentItem.value = {
    quantity: 1,
    price: 0,
    article: articleStore.articles[0]
  }
  currentTransaction.value.total_amount = calculateTotalAmountOfTransaction(
    currentTransaction.value
  )
}
const handleRemoveItemFromCurrentTransaction = (item: BTMTransactionItem) => {
  currentTransaction.value.items = currentTransaction.value.items.filter(
    (i) => i.article.articleId !== item.article.articleId
  )
  currentTransaction.value.total_amount = calculateTotalAmountOfTransaction(
    currentTransaction.value
  )
}
</script>

<template>
  <BModal
    v-model="showModal"
    :title="modalTitle"
    :ok-title="isAddModal ? dynamicText.save : dynamicText.delete"
    :ok-disabled="saveButtonDisabled"
    :cancel-title="dynamicText.cancel"
    :no-close-on-backdrop="true"
    :no-close-on-esc="true"
    :ok-variant="isAddModal ? 'primary' : 'danger'"
    @close="handleCloseModal"
    @cancel="handleCloseModal"
    @ok="handleCloseModalOnSave"
    size="xl"
  >
    <BContainer>
      <BRow>
        <BCol>
          <BFormGroup :label="`${dynamicText.transaction_type}*`">
            <BFormSelect
              v-model="currentTransaction.transactionType"
              :disabled="transactionTypeSelectDisabled"
            >
              <BFormSelectOption
                v-for="transactionType in transactionsTypesConstant"
                :key="transactionType"
                :value="transactionType"
              >
                {{ transactionType }}
              </BFormSelectOption>
            </BFormSelect>
          </BFormGroup>
        </BCol>
        <BCol>
          <BFormGroup
            :label="`${dynamicText.date}*`"
            :state="isAddModal ? invalidFeedbackDateState : ''"
            :invalid-feedback="dynamicText.invalid_date"
          >
            <BFormInput v-if="isAddModal" type="date" v-model="currentDate" />
            <BFormInput
              v-else
              :model-value="`${currentTransaction.day}.${currentTransaction.month}.${currentTransaction.year}`"
              disabled
            />
          </BFormGroup>
        </BCol>
        <BCol></BCol>
        <BCol class="col-label">
          <label>{{ dynamicText.transaction_id }}: {{ currentTransaction.transactionId }}</label>
        </BCol>
      </BRow>
      <BRow v-if="isAddModal">
        <BCol class="col-header">
          {{ dynamicText.add_article_to_transaction }}
        </BCol>
      </BRow>
      <BRow v-if="isAddModal">
        <BCol>
          <BFormGroup
            :label="dynamicText.article"
            :state="invalidFeedbackArticleCount"
            :invalid-feedback="dynamicText.invalid_items"
          >
            <BFormSelect v-model="currentItem.article">
              <BFormSelectOption
                v-for="item in articleStore.articles"
                :key="item.articleId"
                :value="item"
              >
                {{ item.articleId }}: {{ item.name }}
              </BFormSelectOption>
            </BFormSelect>
          </BFormGroup>
        </BCol>
        <BCol md="auto" class="col-small">
          <BFormGroup
            :label="dynamicText.quantity"
            :state="invalidFeedbackItemQuantityState"
            :invalid-feedback="determineInvalidFeedbackItemQuantity"
          >
            <BFormInput v-model="currentItem.quantity" type="number" />
          </BFormGroup>
        </BCol>
        <BCol md="auto" class="col-small">
          <BFormGroup
            :label="
              currentTransaction.transactionType === dynamicText.outcome_storage
                ? dynamicText.selling_price
                : dynamicText.purchase_price
            "
            :state="invalidFeedbackItemPriceState"
            :invalid-feedback="dynamicText.invalid_price"
            :disabled="currentTransaction.transactionType === dynamicText.outcome_storage"
          >
            <BFormInput v-model="currentItem.price" type="number" />
          </BFormGroup>
        </BCol>
        <BCol class="col-button" md="auto">
          <BButton
            variant="primary"
            @click="handleAddItemToCurrentTransaction"
            :disabled="addButtonDisabled"
          >
            <BTMPlusIcon />
          </BButton>
        </BCol>
      </BRow>
      <BRow>
        <BCol class="col-header" md="auto"> {{ dynamicText.article }}* </BCol>
        <BCol class="col-invalid">{{
          invalidFeedbackTransactionItemsState ? '' : dynamicText.invalid_transactions_items
        }}</BCol>
      </BRow>
      <BRow v-for="item in currentTransaction.items" v-bind:key="item.article.articleId">
        <BCol>
          <BFormGroup :label="dynamicText.name">
            <BFormInput :model-value="`${item.article.articleId}: ${item.article.name}`" disabled />
          </BFormGroup>
        </BCol>
        <BCol md="auto" class="col-small">
          <BFormGroup :label="dynamicText.quantity">
            <BFormInput :model-value="item.quantity" disabled />
          </BFormGroup>
        </BCol>
        <BCol md="auto" class="col-small">
          <BFormGroup
            :label="
              currentTransaction.transactionType === dynamicText.outcome_storage
                ? dynamicText.selling_price
                : dynamicText.purchase_price
            "
          >
            <BFormInput :model-value="`${item.price} €`" disabled />
          </BFormGroup>
        </BCol>
        <BCol class="col-button" md="auto" v-if="isAddModal">
          <BButton variant="danger" @click="handleRemoveItemFromCurrentTransaction(item)">
            <BTMCrossIcon />
          </BButton>
        </BCol>
      </BRow>
      <BRow>
        <BCol></BCol>
        <BCol></BCol>
        <BCol md="auto" class="col-total-amount">
          <BFormGroup :label="dynamicText.total_amount">
            <BFormInput :model-value="`${currentTransaction.total_amount} €`" disabled />
          </BFormGroup>
        </BCol>
        <BCol md="auto" class="empty-container" v-if="isAddModal"></BCol>
      </BRow>
      <BRow>
        <BCol>
          <BFormGroup :label="dynamicText.description">
            <BFormInput v-model="currentTransaction.description" :disabled="!isAddModal" />
          </BFormGroup>
        </BCol>
      </BRow>
    </BContainer>
  </BModal>
</template>

<style scoped lang="scss">
.col-small {
  width: 150px;
}

.col-total-amount {
  width: 300px;
}

.col-button {
  padding-top: 30px;
}

.empty-container {
  width: 74px;
}

.col-label {
  text-align: right;
}

.col-header {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 20px;
  margin-top: 20px;
}

.col-invalid {
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
}
</style>
