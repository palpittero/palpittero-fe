<template>
  <BaseDialog
    :visible="visible"
    :style="{ width: '30vw' }"
    :header="header"
    modal
    @submit="handleSubmit"
    @hide="handleHide"
  >
    <div class="flex align-items-center">
      <i class="pi pi-sign-in mr-3" style="font-size: 2rem" />
      <span v-html="message" />
    </div>
    <template #footer>
      <Button
        :label="$t('common.no')"
        icon="pi pi-times"
        class="p-button-text"
        @click="handleHide"
      />
      <Button
        :label="$t('common.yes')"
        icon="pi pi-check"
        class="p-button-text"
        @click="handleSubmit"
      />
    </template>
  </BaseDialog>
</template>

<script setup>
import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'

defineProps({
  header: String,
  message: String,
  visible: Boolean
})

const emits = defineEmits(['submit', 'hide'])

const handleSubmit = () => emits('submit')
const handleHide = () => emits('hide')
</script>
