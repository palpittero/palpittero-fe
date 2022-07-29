<template>
  <Dialog
    :visible="visible"
    :style="style"
    :header="header"
    modal
    @hide="handleHide"
    @update:visible="handleUpdateVisible"
  >
    <slot />
    <template #footer>
      <slot name="footer">
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="handleHide"
          :class="cancelButtonClass"
          :disabled="disabled"
        />
        <Button
          label="Ok"
          icon="pi pi-check"
          class="p-button-text"
          :class="okButtonClass"
          @click="handleSubmit"
          :disabled="disabled"
        />
      </slot>
    </template>
  </Dialog>
</template>

<script setup>
defineProps({
  visible: Boolean,
  disabled: Boolean,
  header: String,
  okButtonClass: String,
  cancelButtonClass: String,
  style: {
    type: Object,
    default: () => ({ width: '60vw' })
  }
})

const emits = defineEmits(['submit', 'hide'])

const handleUpdateVisible = (visible) => !visible && emits('hide')

const handleHide = () => emits('hide')
const handleSubmit = () => emits('submit')
</script>
