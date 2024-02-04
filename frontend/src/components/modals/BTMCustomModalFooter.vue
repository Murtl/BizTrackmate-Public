<script setup lang="ts">
import dynamicText from '@/text/dynamicText.json'

interface Props {
  /**
   * whether the modal is an add modal or an edit modal
   */
  isAddModal: boolean

  /**
   * The function to call when the user clicks the close button
   */
  handleCloseModal: () => void

  /**
   * the function to call when the user clicks the delete button
   */
  handleCloseModalOnDelete: () => void

  /**
   * The function to call when the user clicks the save button
   */
  handleCloseModalOnSave: () => void

  /**
   * the computed disabled state of the save button
   */
  saveButtonDisabled: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="my-custom-footer-class" :class="{ 'no-delete-button': isAddModal }">
    <section class="delete-button" v-if="!isAddModal">
      <BButton variant="danger" @click="handleCloseModalOnDelete">{{ dynamicText.delete }}</BButton>
    </section>
    <section class="main-button">
      <BButton variant="secondary" @click="handleCloseModal">{{ dynamicText.cancel }}</BButton>
      <BButton variant="primary" @click="handleCloseModalOnSave" :disabled="saveButtonDisabled">{{
        dynamicText.save
      }}</BButton>
    </section>
  </div>
</template>

<style scoped lang="scss">
.my-custom-footer-class {
  display: flex;
  justify-content: space-between;
  width: 100%;

  &.no-delete-button {
    justify-content: flex-end;
  }

  .main-button {
    display: flex;
    align-self: flex-end;
    gap: 10px;
  }
}

@media (max-width: 400px) {
  .my-custom-footer-class {
    display: grid;
    grid-template-columns: 1fr;

    .main-button {
      margin-top: 10px;
    }
  }
}

@media (max-width: 260px) {
  .my-custom-footer-class {
    .delete-button {
      display: grid;
      grid-template-columns: 1fr;
    }
    .main-button {
      display: grid;
      grid-template-columns: 1fr;
    }
  }
}
</style>
