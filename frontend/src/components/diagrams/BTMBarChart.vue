<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import dynamicText from '@/text/dynamicText.json'
import { monthsConstant } from '@/utils/contants'
import { computed, onBeforeMount, ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { BTMSortedTransactions } from '@/utils/types/btmSortedTransaction'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

interface Props {
  /**
   * The sorted transactions by year and month
   */
  sortedTransactions: BTMSortedTransactions[]

  /**
   * The available years of the transactions
   */
  availableYears: number[]
}

const props = defineProps<Props>()

interface Emits {
  /**
   * Emitted when the user selects a year
   */
  (event: 'changeYear', value: number): void
}

const emit = defineEmits<Emits>()

const data: Ref<number[]> = ref([])
const selectedYear = ref(props.availableYears[0])

onBeforeMount(() => {
  selectedYear.value = props.availableYears[0]
  data.value = sortTransactionDataInChartData()
})

const chartData = computed(() => {
  return {
    labels: monthsConstant,
    datasets: [
      {
        data: data.value,
        backgroundColor: '#006af5',
        label: dynamicText.revenue
      }
    ]
  }
})

watch(selectedYear, (newYear) => {
  emit('changeYear', newYear)
  sortTransactionDataInChartData()
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      title: {
        display: true,
        text: dynamicText.revenue_in_euro
      }
    },
    x: {
      grid: {
        color: '#FFFFFF'
      }
    }
  }
}

const sortTransactionDataInChartData = () => {
  data.value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  props.sortedTransactions.forEach((sortedTransaction) => {
    sortedTransaction.transactions.forEach((transaction) => {
      if (
        transaction.transactionType === dynamicText.outcome_storage &&
        transaction.year === selectedYear.value
      ) {
        data.value[transaction.month - 1] += transaction.total_amount
      }
    })
  })
  return data.value
}
</script>

<template>
  <div class="btm-bar-chart-host">
    <section class="header">
      <span class="title">{{ dynamicText.year_revenue }}</span>
      <BFormGroup class="select-options">
        <BFormSelect v-model="selectedYear" :options="availableYears" />
      </BFormGroup>
    </section>
    <section class="bar-chart">
      <Bar :options="chartOptions" :data="chartData" />
    </section>
  </div>
</template>

<style scoped lang="scss">
@import '@/custom.scss';

.btm-bar-chart-host {
  background-color: $light;
  padding: 30px;
  border-radius: $outer-elements-border-radius;
  box-shadow: $main-box-shadow;

  .header {
    display: grid;
    grid-template-columns: 1fr 1fr;

    .title {
      margin-left: 50px;
      font-size: 30px;
    }

    .select-options {
      justify-self: end;
      width: fit-content;
    }
  }

  .bar-chart {
    width: 100%;
    height: 400px;
  }
}

@media screen and (max-width: 720px) {
  .btm-bar-chart-host {
    .header {
      grid-template-columns: 1fr;

      .title {
        margin-left: 20px;
      }
    }
  }
}
</style>
