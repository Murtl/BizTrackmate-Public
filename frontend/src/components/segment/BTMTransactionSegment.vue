<script setup lang="ts">
interface Props {
  /**
   * The year of the segment
   */
  year: number

  /**
   * The month of the segment
   */
  month: string
}

defineProps<Props>()
</script>

<template>
  <div class="btm-transaction-segment-host">
    <span class="title">{{ month }} {{ year }}</span>
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.btm-transaction-segment-host {
  margin-bottom: 20px;
  margin-left: 20px;

  .title {
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
