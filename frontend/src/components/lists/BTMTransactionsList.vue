<script setup lang="ts">
import type { BTMTransaction } from '@/utils/types/btmTransaction'
import { onBeforeMount, ref, watch } from 'vue'
import type { Ref } from 'vue'
import BTMTransactionSegment from '@/components/segment/BTMTransactionSegment.vue'
import BTMTransactionSegmentItem from '@/components/segment/BTMTransactionSegmentItem.vue'
import type { BTMSortedTransactions } from '@/utils/types/btmSortedTransaction'
import {
  initSortedTransactions,
  sortTransactionsInSortedTransactions,
  sortSortedTransactionsByYearAndMonth,
  sortSortedTransactionsByDay
} from '@/utils/functions/transaction/sortTransactions'
import { getAvailableYearsOfTransactions } from '@/utils/functions/transaction/getAvailableYearsOfTransactions'
import { monthsConstant } from '@/utils/contants'
import { getAvailableMonthsOfTransactions } from '@/utils/functions/transaction/getAvailableMonthsOfTransactions'
import { filterTransactions } from '@/utils/functions/transaction/filterTransactions'

interface Props {
  /**
   * The data to display in the table
   * Needs to come from outside the component so the searchbar works properly
   */
  data: BTMTransaction[]

  /**
   * The filter to apply to the data
   */
  filter: string
}

const props = defineProps<Props>()

let availableYears: number[] = []
let availableMonths: { year: number; month: number }[] = []
const sortedTransactions: Ref<BTMSortedTransactions[]> = ref([])
const filteredTransactions: Ref<BTMSortedTransactions[]> = ref([])

onBeforeMount(() => {
  initData()
})

const initData = () => {
  availableYears = getAvailableYearsOfTransactions(props.data)
  availableMonths = getAvailableMonthsOfTransactions(availableYears, props.data)
  sortedTransactions.value = initSortedTransactions(availableMonths)
  sortedTransactions.value = sortTransactionsInSortedTransactions(
    props.data,
    sortedTransactions.value
  )
  sortedTransactions.value = sortSortedTransactionsByYearAndMonth(sortedTransactions.value)
  sortedTransactions.value = sortSortedTransactionsByDay(sortedTransactions.value)
  filteredTransactions.value = sortedTransactions.value
}

watch(
  () => props.filter,
  (newFilter) => {
    initData()
    const filterArray = newFilter.toLowerCase().split(' ')
    filteredTransactions.value = filterTransactions(sortedTransactions.value, filterArray)
  }
)

watch(
  () => props.data,
  () => {
    initData()
    const filterArray = props.filter.toLowerCase().split(' ')
    filteredTransactions.value = filterTransactions(sortedTransactions.value, filterArray)
  },
  { deep: true }
)
</script>

<template>
  <div class="btm-transactions-list-host">
    <BTMTransactionSegment
      v-for="(list, index) in filteredTransactions.slice().reverse()"
      v-bind:key="index"
      :year="list.year"
      :month="monthsConstant[list.month - 1]"
    >
      <BTMTransactionSegmentItem
        v-for="transaction in list.transactions"
        v-bind:key="transaction.transactionId"
        :transaction="transaction"
      />
    </BTMTransactionSegment>
  </div>
</template>
