<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import { computed } from 'vue'
import dynamicText from '@/text/dynamicText.json'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  /**
   * The label to display
   */
  label: string

  /**
   * food amount
   */
  foodAmount: number

  /**
   * non-food amount
   */
  nonFoodAmount: number
}

const props = defineProps<Props>()

const chartData = computed(() => {
  return {
    labels: [dynamicText.non_food, dynamicText.food],
    datasets: [
      {
        backgroundColor: ['#5AC2F7', '#c5164e'],
        data: [props.nonFoodAmount, props.foodAmount],
        label: dynamicText.amount
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
  <div class="btm-doughnut-chart-host">
    <section class="main-part">
      <Doughnut :data="chartData" :options="chartOptions" />
    </section>
    <section>
      {{ label }}
    </section>
  </div>
</template>

<style scoped lang="scss">
@import '@/custom.scss';

.btm-doughnut-chart-host {
  background-color: $light;
  text-align: center;
  width: 330px;
  height: 230px;
  box-shadow: $main-box-shadow;
  border-radius: $outer-elements-border-radius;

  .main-part {
    height: 80%;
    font-size: 40px;
    padding-bottom: 5%;
  }
}

@media screen and (max-width: 720px) {
  .btm-doughnut-chart-host {
    width: 100%;
    height: 300px;
    padding-bottom: 15px;

    .main-part {
      padding-top: 5%;
    }
  }
}
</style>
