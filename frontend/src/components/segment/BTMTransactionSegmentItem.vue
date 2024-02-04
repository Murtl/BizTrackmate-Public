<script setup lang="ts">
import type { BTMTransaction } from '@/utils/types/btmTransaction'
import { onBeforeMount, ref } from 'vue'
import dynamicText from '@/text/dynamicText.json'
import { useTransactionsStore } from '@/stores/transactionsStore'
import BTMDeleteModal from '@/components/modals/BTMDeleteModal.vue'
import BTMTransactionModal from '@/components/modals/BTMTransactionModal.vue'
import { updateItemsStock } from '@/utils/functions/transaction/updateItemsStock'

interface Props {
  /**
   * The transaction to display
   */
  transaction: BTMTransaction
}

const props = defineProps<Props>()

onBeforeMount(() => {
  if (props.transaction.transactionType === dynamicText.outcome_storage) {
    outcome.value = true
  }
})

const outcome = ref(false)

const transactionStore = useTransactionsStore()
const showSafeDeleteModal = ref(false)
const showModalShowTransaction = ref(false)

const showErrorModal = ref(false)
const errorModalTitle = ref('')
const errorModalText = ref('')

const handleShowModalShowTransaction = () => {
  showModalShowTransaction.value = true
}

const handleCloseModalShowTransaction = () => {
  showModalShowTransaction.value = false
}

const handleDeleteTransaction = () => {
  showSafeDeleteModal.value = true
}
const handleSafeDelete = async () => {
  const { state, message } = await transactionStore.removeTransaction(
    props.transaction.transactionDocId
  )
  if (!state) {
    showErrorModal.value = true
    errorModalTitle.value = dynamicText.error_add
    errorModalText.value = message
  }
  const { state: state2, message: message2 } = await updateItemsStock(props.transaction, true)
  if (!state2) {
    showErrorModal.value = true
    errorModalTitle.value = dynamicText.error_edit
    errorModalText.value = message2
  }
}
</script>

<template>
  <div class="btm-transaction-segment-item-host" @click="handleShowModalShowTransaction">
    <section class="type" :class="{ outcome }">{{ transaction.transactionType }}</section>
    <section class="date">
      {{ transaction.day < 10 ? `0${transaction.day}` : transaction.day }}.{{
        transaction.month < 10 ? `0${transaction.month}` : transaction.month
      }}
    </section>
    <section class="main">
      <span v-for="item in transaction.items" v-bind:key="item.article.articleId">
        {{ item.quantity }}x {{ item.article.name }};
      </span>
    </section>
    <section class="amount">{{ transaction.total_amount }} €</section>
  </div>
  <BTMTransactionModal
    v-model:visible="showModalShowTransaction"
    :handle-close-modal="handleCloseModalShowTransaction"
    :modal-title="dynamicText.show_transaction"
    :handle-close-modal-on-save="handleDeleteTransaction"
    :is-add-modal="false"
    :transaction="transaction"
  />
  <BTMDeleteModal v-model:visible="showSafeDeleteModal" :handle-safe-delete="handleSafeDelete" />
  <BModal v-model="showErrorModal" :title="errorModalTitle">{{ errorModalText }}</BModal>
</template>

<style scoped lang="scss">
@import '@/custom';

.btm-transaction-segment-item-host {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 40px;
  align-items: center;
  padding: 10px;
  background-color: $light;
  border-radius: 10px;
  margin: 5px;
  width: 900px;
  cursor: pointer;

  .type {
    width: 20%;
    color: #13be59;
    background-color: #e8f6ec;
    text-align: center;
    border-radius: 5px;

    &.outcome {
      color: #c5164e;
      background-color: #f5d8e1;
    }
  }

  .date {
    width: 10%;
  }

  .main {
    width: 55%;
  }

  .amount {
    width: 15%;
  }
}

.btm-transaction-segment-item-host:hover {
  background-color: $light-hover;
}

@media screen and (max-width: 900px) {
  .btm-transaction-segment-item-host {
    width: 90%;

    .type {
      width: 40%;
    }

    .date {
      width: 30%;
    }

    .main {
      display: none;
    }

    .amount {
      width: 30%;
    }
  }
}
</style>
