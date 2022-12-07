<template>
  <Dialog
    :visible="visible"
    :style="style"
    modal
    @hide="handleHide"
    @update:visible="handleUpdateVisible"
    :class="`base-dialog--${type}`"
  >
    <template #header>
      <div class="modal-header">
        {{ header }}
      </div>
    </template>
    <slot />
    <template #footer>
      <slot name="footer">
        <Button
          :label="$t('common.cancel')"
          icon="pi pi-times"
          class="p-button-text"
          @click="handleHide"
          :class="cancelButtonClass"
          :disabled="disabled"
        />
        <Button
          :label="$t('common.ok')"
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
  header: {
    type: String,
    default: ''
  },
  okButtonClass: {
    type: String,
    default: ''
  },
  cancelButtonClass: {
    type: String,
    default: ''
  },
  style: {
    type: Object,
    default: () => ({})
  },
  type: {
    type: String,
    validator: (value) => ['prompt', 'dynamic'].includes(value),
    default: 'prompt'
  }
})

const emits = defineEmits(['submit', 'hide'])

const handleUpdateVisible = (visible) => !visible && emits('hide')

const handleHide = () => emits('hide')
const handleSubmit = () => emits('submit')
</script>

<style lang="scss">
.base-dialog {
  &--dynamic {
    @media screen and (max-width: 960px) {
      width: 90vw;
    }
    width: 50vw;
  }
}
</style>
