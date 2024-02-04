<script setup lang="ts">
import dynamicText from '@/text/dynamicText.json'
import BTMPlusIcon from '@/components/icons/BTMPlusIcon.vue'
import BTMTransactionsList from '@/components/lists/BTMTransactionsList.vue'
import { useTransactionsStore } from '@/stores/transactionsStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { BTMTransaction } from '@/utils/types/btmTransaction'
import { BFormInput } from 'bootstrap-vue-3'
import BTMTransactionModal from '@/components/modals/BTMTransactionModal.vue'
import { getHighestIdOfTransactions } from '@/utils/functions/transaction/getHighestIdOfTransactions'
import { updateItemsStock } from '@/utils/functions/transaction/updateItemsStock'

const transactionStore = useTransactionsStore()
const { transactions } = storeToRefs(transactionStore)
const transactionsFilter = ref('')
const currentTransaction: Ref<BTMTransaction> = ref({
  transactionDocId: '',
  transactionId: 'T-1',
  transactionType: '',
  day: 0,
  month: 0,
  year: 0,
  items: [],
  total_amount: 0,
  description: ''
})

const showModalAddTransaction = ref(false)

const showErrorModal = ref(false)
const errorModalTitle = ref('')
const errorModalText = ref('')

const handleShowModalAddTransaction = () => {
  resetCurrentTransaction()
  showModalAddTransaction.value = true
}

const handleCloseModalAddTransaction = () => {
  showModalAddTransaction.value = false
}

const handleAddTransaction = async () => {
  currentTransaction.value.items.forEach((items) => {
    items.article = Object.assign({}, items.article)
  })
  const { state, message } = await transactionStore.addTransaction(currentTransaction.value)
  if (!state) {
    showErrorModal.value = true
    errorModalTitle.value = dynamicText.error_add
    errorModalText.value = message
  }
  const { state: state2, message: message2 } = await updateItemsStock(
    currentTransaction.value,
    false
  )
  if (!state2) {
    showErrorModal.value = true
    errorModalTitle.value = dynamicText.error_edit
    errorModalText.value = message2
  }
  handleCloseModalAddTransaction()
}

const resetCurrentTransaction = () => {
  currentTransaction.value = {
    transactionDocId: '',
    transactionId:
      transactions.value.length > 0
        ? `T-${getHighestIdOfTransactions(transactions.value) + 1}`
        : 'T-1',
    transactionType: dynamicText.income_storage,
    day: 0,
    month: 0,
    year: 0,
    items: [],
    total_amount: 0,
    description: ''
  }
}
</script>

<template>
  <div class="btm-transaction-host">
    <header>
      <BFormInput
        :placeholder="dynamicText.search_transaction"
        class="form-input"
        v-model="transactionsFilter"
      />
      <BButton variant="primary" @click="handleShowModalAddTransaction">
        <BTMPlusIcon />
        {{ dynamicText.add_transaction }}
      </BButton>
    </header>
    <main>
      <BTMTransactionsList :filter="transactionsFilter" :data="transactions" />
    </main>
  </div>
  <BTMTransactionModal
    v-model:visible="showModalAddTransaction"
    :handle-close-modal="handleCloseModalAddTransaction"
    :modal-title="dynamicText.add_transaction"
    :handle-close-modal-on-save="handleAddTransaction"
    :is-add-modal="true"
    :transaction="currentTransaction"
  />
  <BModal v-model="showErrorModal" :title="errorModalTitle">{{ errorModalText }}</BModal>
</template>

<style scoped lang="scss">
@import '@/custom.scss';

.btm-transaction-host {
  header {
    background-color: #dddddd;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 56px;

    .form-input {
      width: 600px;
    }
  }

  main {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

@media screen and (max-width: 900px) {
  .btm-transaction-host {
    main {
      align-items: unset;
    }
  }
}

@media screen and (max-width: 853px) {
  .btm-transaction-host {
    header {
      flex-direction: column;
      height: 100px;

      .form-input {
        width: 100%;
      }
    }
  }
}
</style>
