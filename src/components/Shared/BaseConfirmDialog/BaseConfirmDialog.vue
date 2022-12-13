<template>
  <Modal
    :visible="visible"
    :header="header"
    :disabled="disabled"
    :target="target"
    @submit="handleSubmit"
    @hide="handleHide"
  >
    <span v-html="message" />
    <!-- <div class="flex align-items-center">
    </div> -->
  </Modal>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { Modal } from '@/components/Common'

defineProps({
  visible: Boolean,
  target: String,
  header: {
    type: String,
    default: () => {
      const i18n = useI18n()
      return i18n.t('common.confirm')
    }
  },
  message: String,
  disabled: Boolean
})

const emits = defineEmits(['submit', 'hide'])

const handleSubmit = (modal) => emits('submit', modal)
const handleHide = () => emits('hide')
</script>
