<script setup lang="ts">
interface Props {
  /**
   * The key figure to display
   */
  keyFigure: number

  /**
   * The label to display
   */
  label: string

  /**
   * Whether the key figure should be green
   */
  isGreen?: boolean

  /**
   * Whether the key figure is a euro value
   */
  isEuro?: boolean
}

withDefaults(defineProps<Props>(), {
  isGreen: false
})
</script>

<template>
  <div class="btm-number-tile-host">
    <section class="main-part" :class="{ 'is-green': isGreen }">
      {{ keyFigure }} {{ isEuro ? '€' : '' }}
    </section>
    <section>
      {{ label }}
    </section>
  </div>
</template>

<style scoped lang="scss">
@import '@/custom.scss';

.btm-number-tile-host {
  background-color: $light;
  text-align: center;
  width: 330px;
  height: 230px;
  box-shadow: $main-box-shadow;
  border-radius: $outer-elements-border-radius;

  .main-part {
    color: #980000;
    height: 80%;
    font-size: 40px;
    padding-top: 15%;

    &.is-green {
      color: #009834;
    }
  }
}

@media screen and (max-width: 720px) {
  .btm-number-tile-host {
    width: 100%;
    height: 100%;
    padding-bottom: 15px;

    .main-part {
      padding-top: 5%;
    }
  }
}
</style>
