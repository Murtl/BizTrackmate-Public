<script setup lang="ts">
import dynamicText from '@/text/dynamicText.json'
import { ref, watch } from 'vue'

interface Props {
  /**
   * the visibility state of the modal
   */
  visible: boolean

  /**
   * the function to call when the user clicks the delete button
   */
  handleSafeDelete: () => void
}

const props = defineProps<Props>()

interface Emits {
  /**
   * The event to emit when the visibility state of the modal changes
   * @param event the event name
   * @param value the new visibility state
   */
  (event: 'update:visible', value: boolean): void
}

const emit = defineEmits<Emits>()

const showSafeDeleteModal = ref(props.visible)

watch(
  () => props.visible,
  (value) => {
    showSafeDeleteModal.value = value
  }
)

watch(
  () => showSafeDeleteModal.value,
  (value) => {
    emit('update:visible', value)
  }
)
</script>

<template>
  <BModal
    v-model="showSafeDeleteModal"
    :ok-only="true"
    ok-variant="danger"
    :ok-title="dynamicText.delete"
    @ok="handleSafeDelete"
  >
    {{ dynamicText.safe_delete }}
  </BModal>
</template>
