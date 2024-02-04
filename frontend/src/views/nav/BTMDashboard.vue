<script setup lang="ts">
import BTMBarChart from '@/components/diagrams/BTMBarChart.vue'
import BTMNumberTile from '@/components/diagrams/BTMNumberTile.vue'
import BTMDoughnutChart from '@/components/diagrams/BTMDoughnutChart.vue'
import BTMPieChart from '@/components/diagrams/BTMPieChart.vue'
import dynamicText from '@/text/dynamicText.json'
import { monthsConstant } from '@/utils/contants'
import { computed, onBeforeMount, ref, watch } from 'vue'
import type { Ref } from 'vue'
import {
  initSortedTransactions,
  sortTransactionsInSortedTransactions,
  sortSortedTransactionsByYearAndMonth
} from '@/utils/functions/transaction/sortTransactions'
import { getAvailableYearsOfTransactions } from '@/utils/functions/transaction/getAvailableYearsOfTransactions'
import { getAvailableMonthsOfTransactions } from '@/utils/functions/transaction/getAvailableMonthsOfTransactions'
import type { BTMSortedTransactions } from '@/utils/types/btmSortedTransaction'
import { useTransactionsStore } from '@/stores/transactionsStore'
import { getStorages } from '@/utils/functions/dashboard/getStorages'
import { getProfit } from '@/utils/functions/dashboard/getProfit'
import { getTotalQuantity } from '@/utils/functions/dashboard/getTotalQuantity'
import { getRevenue } from '@/utils/functions/dashboard/getRevenue'
import BTMCalenderClockIcon from '@/components/icons/BTMCalenderIcon.vue'
import BTMCalenderPaperIcon from '@/components/icons/BTMCalenderPaperIcon.vue'

let availableYears: number[] = []
let availableMonths: { year: number; month: number }[] = []
const transactionsStore = useTransactionsStore()
const sortedTransactions: Ref<BTMSortedTransactions[]> = ref([])

const selectedMonth = ref(monthsConstant[0])
const selectedYear = ref(availableYears[0])

const yearOverview = ref(true)

const computedIncomeStorages = computed(() => {
  return getStorages(
    sortedTransactions.value,
    selectedYear.value,
    selectedMonth.value,
    dynamicText.income_storage,
    yearOverview.value
  )
})

const computedOutcomeStorages = computed(() => {
  return getStorages(
    sortedTransactions.value,
    selectedYear.value,
    selectedMonth.value,
    dynamicText.outcome_storage,
    yearOverview.value
  )
})

const computedProfit = computed(() => {
  return getProfit(
    sortedTransactions.value,
    selectedYear.value,
    selectedMonth.value,
    yearOverview.value
  )
})

const computedFoodRevenue = computed(() => {
  return getRevenue(
    sortedTransactions.value,
    selectedYear.value,
    selectedMonth.value,
    dynamicText.food,
    yearOverview.value
  )
})

const computedNonFoodRevenue = computed(() => {
  return getRevenue(
    sortedTransactions.value,
    selectedYear.value,
    selectedMonth.value,
    dynamicText.non_food,
    yearOverview.value
  )
})

const computedFoodAmount = computed(() => {
  return getTotalQuantity(
    sortedTransactions.value,
    selectedYear.value,
    selectedMonth.value,
    dynamicText.food,
    yearOverview.value
  )
})

const computedNonFoodAmount = computed(() => {
  return getTotalQuantity(
    sortedTransactions.value,
    selectedYear.value,
    selectedMonth.value,
    dynamicText.non_food,
    yearOverview.value
  )
})

onBeforeMount(async () => {
  availableYears = getAvailableYearsOfTransactions(transactionsStore.transactions)
  availableMonths = getAvailableMonthsOfTransactions(availableYears, transactionsStore.transactions)
  sortedTransactions.value = initSortedTransactions(availableMonths)
  sortedTransactions.value = sortTransactionsInSortedTransactions(
    transactionsStore.transactions,
    sortedTransactions.value
  )
  sortedTransactions.value = sortSortedTransactionsByYearAndMonth(sortedTransactions.value)
  selectedYear.value = availableYears[0]
})

watch(yearOverview, () => {
  selectedMonth.value = monthsConstant[0]
  selectedYear.value = availableYears[0]
})
</script>

<template>
  <div class="btm-dashboard-host">
    <header>
      <section :class="{ yearOverview: yearOverview }" @click="yearOverview = true">
        <BTMCalenderClockIcon />
        <span>{{ dynamicText.year_overview }}</span>
      </section>
      <section :class="{ yearOverview: !yearOverview }" @click="yearOverview = false">
        <BTMCalenderPaperIcon />
        <span>{{ dynamicText.month_overview }}</span>
      </section>
    </header>

    <main>
      <BTMBarChart
        v-if="yearOverview"
        :sorted-transactions="sortedTransactions"
        :available-years="availableYears"
        @change-year="selectedYear = $event"
        class="chart"
      />
      <BTMPieChart
        v-else
        :non-food-value="computedNonFoodRevenue"
        :food-value="computedFoodRevenue"
        :available-years="availableYears"
        @change-year="selectedYear = $event"
        @change-month="selectedMonth = $event"
        class="chart"
      />
      <section class="tile-section">
        <BTMNumberTile
          :label="dynamicText.income_storages"
          :key-figure="computedIncomeStorages"
          isGreen
        />
        <BTMNumberTile
          :label="dynamicText.outcome_storages"
          :key-figure="computedOutcomeStorages"
        />
        <BTMNumberTile
          :label="computedProfit > 0 ? dynamicText.profit : dynamicText.loss"
          :key-figure="computedProfit"
          :isGreen="computedProfit > 0"
          isEuro
        />
        <BTMDoughnutChart
          :label="dynamicText.sold_products_after_kategorie"
          :food-amount="computedFoodAmount"
          :non-food-amount="computedNonFoodAmount"
        />
      </section>
    </main>
  </div>
</template>

<style scoped lang="scss">
@import '@/custom.scss';

.btm-dashboard-host {
  header {
    background-color: #dddddd;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 56px;

    section {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      padding: 0 5px;

      &.yearOverview {
        color: $primary;
      }
    }
  }

  main {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 20px 20px 50px;
    gap: 50px;

    .chart {
      width: 800px;
      height: 500px;
    }

    .tile-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }
  }
}

@media screen and (max-width: 1600px) {
  .btm-dashboard-host {
    main {
      flex-direction: column;
      align-items: center;

      .chart {
        width: 700px;
      }

      .tile-section {
        gap: 40px;
      }
    }
  }
}

@media screen and (max-width: 720px) {
  .btm-dashboard-host {
    main {
      flex-direction: column;
      align-items: center;

      .chart {
        width: 100%;
        height: 550px;
      }

      .tile-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 40px;
        width: 100%;
      }
    }
  }
}

@media screen and (max-width: 350px) {
  .btm-dashboard-host {
    header {
      flex-direction: column;
      height: 70px;
    }
  }
}
</style>
