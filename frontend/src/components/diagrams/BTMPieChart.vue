<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { computed } from 'vue'
import dynamicText from '@/text/dynamicText.json'
import { monthsConstant } from '@/utils/contants'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  /**
   * food revenue
   */
  foodValue: number

  /**
   * non-food revenue
   */
  nonFoodValue: number

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

  /**
   * Emitted when the user selects a month
   */
  (event: 'changeMonth', value: string): void
}

const emit = defineEmits<Emits>()

const selectedMonth = computed({
  get: () => monthsConstant[0],
  set: (value: string) => emit('changeMonth', value)
})

const selectedYear = computed({
  get: () => props.availableYears[0],
  set: (value: number) => emit('changeYear', value)
})

const chartData = computed(() => {
  return {
    labels: [dynamicText.non_food, dynamicText.food],
    datasets: [
      {
        backgroundColor: ['#5AC2F7', '#c5164e'],
        data: [props.nonFoodValue, props.foodValue],
        label: dynamicText.revenue
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
</script>

<template>
  <div class="btm-pie-chart-host">
    <section class="header">
      <span class="title">{{ dynamicText.month_revenue }}</span>
      <section class="select-options">
        <BFormGroup>
          <BFormSelect v-model="selectedMonth" :options="monthsConstant" />
        </BFormGroup>
        <BFormGroup>
          <BFormSelect v-model="selectedYear" :options="availableYears" />
        </BFormGroup>
      </section>
    </section>
    <section class="pie-chart">
      <Pie :data="chartData" :options="chartOptions" />
    </section>
  </div>
</template>

<style scoped lang="scss">
@import '@/custom';

.btm-pie-chart-host {
  padding: 30px;
  width: 800px;
  height: 500px;
  background-color: $light;
  box-shadow: $main-box-shadow;
  border-radius: $outer-elements-border-radius;

  .header {
    display: grid;
    grid-template-columns: 1fr 1fr;

    .title {
      margin-left: 50px;
      font-size: 30px;
    }

    .select-options {
      border-radius: 10px;
      justify-self: end;
      width: fit-content;
      display: flex;
      flex-direction: row;
      gap: 20px;
      align-items: center;
    }
  }

  .pie-chart {
    width: 100%;
    height: 400px;
  }
}

@media screen and (max-width: 720px) {
  .btm-pie-chart-host {
    .header {
      grid-template-columns: 1fr;

      .title {
        margin-left: 20px;
      }
    }
  }
}
</style>
