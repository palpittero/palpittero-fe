<template>
  <div
    class="px-4 py-5 shadow-2 flex flex-column md:flex-row md:align-items-center justify-content-between mb-3 unprocessed-guesses-banner__process-guesses"
  >
    <div>
      <div class="text-white font-medium text-5xl">
        {{ $t('admin.dashboard.unprocessedGuesses.title', { total }, total) }}
      </div>
    </div>
    <div class="mt-4 mr-auto md:mt-0 md:mr-0">
      <Button
        @click="handleProcessGuesses"
        class="p-button font-bold px-5 py-3 p-button-warning p-button-rounded p-button-raised"
      >
        {{ $t('admin.dashboard.unprocessedGuesses.cta') }}
      </Button>
    </div>
  </div>

  <BaseConfirmDialog
    :header="$t('admin.dashboard.processGuesses.header')"
    :message="$t('admin.dashboard.processGuesses.message')"
    :visible="isConfirmDialogVisible"
    :disabled="isSubmitting"
    @hide="handleConfirmDialogHide"
    @submit="handleConfirmDialogSubmit"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import services from '@/services'

import BaseConfirmDialog from '@/components/Shared/BaseConfirmDialog/BaseConfirmDialog.vue'

const toast = useToast()
const i18n = useI18n()

defineProps({
  total: {
    type: Number,
    default: 0
  }
})

const emits = defineEmits(['refresh'])

const isSubmitting = ref(false)
const isConfirmDialogVisible = ref(false)

const handleProcessGuesses = () => (isConfirmDialogVisible.value = true)

const handleConfirmDialogHide = () => (isConfirmDialogVisible.value = false)

const handleConfirmDialogSubmit = async () => {
  isSubmitting.value = true
  await services.guesses.processGuesses()
  toast.add({
    group: 'app',
    severity: 'success',
    summary: i18n.t('common.success'),
    detail: i18n.t('admin.dashboard.guessesProcessedSuccess'),
    life: 4000
  })
  emits('refresh')
  handleConfirmDialogHide()
  isSubmitting.value = false
}
</script>

<style lang="scss" scoped>
.unprocessed-guesses-banner {
  &__process-guesses {
    border-radius: 1rem;
    background: linear-gradient(
        0deg,
        rgba(0, 123, 255, 0.5),
        rgba(0, 123, 255, 0.5)
      ),
      linear-gradient(92.54deg, #1c80cf 47.88%, #ffffff 100.01%);
  }
}
</style>
