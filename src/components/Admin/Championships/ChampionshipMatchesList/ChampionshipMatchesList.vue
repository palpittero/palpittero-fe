<template>
  <div class="surface-section flex flex-column gap-3 p-3">
    <div
      @click="handleToggle"
      class="flex gap-3 flex-row justify-content-between cursor-pointer"
    >
      <div class="flex align-items-center justify-content-between gap-3">
        <span
          class="font-medium md:text-3xl text-900 championship-matches-list__championship-name"
        >
          {{ championship.name }} {{ championship.year }}
        </span>

        <Button
          @click.stop="handleProcessGuesses"
          class="p-button p-button-text border border-1 border-primary p-button-sm p-2"
          icon="pi pi-bolt"
          :label="$t('admin.guesses.processGuesses')"
        />
      </div>
      <span class="flex align-items-center gap-3">
        <span class="hidden md:inline">
          {{ toggle.label }}
        </span>
        <span :class="toggle.icon" />
      </span>
    </div>

    <Transition name="championships-matches-list">
      <UsersGuessesDataTable v-show="isOpen" :guesses="championship.guesses" />
    </Transition>
  </div>

  <BaseConfirmDialog
    :header="
      $t('admin.dashboard.unprocessedGuesses.championship.header', {
        leagueName: league.name,
        championshipName: championship.name
      })
    "
    :message="
      $t('admin.dashboard.unprocessedGuesses.championship.message', {
        leagueName: league.name,
        championshipName: championship.name
      })
    "
    :visible="isConfirmDialogVisible"
    :disabled="isSubmitting"
    @hide="handleConfirmDialogHide"
    @submit="handleConfirmDialogSubmit"
  />
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'

import services from '@/services'

import UsersGuessesDataTable from '../../Guesses/UsersGuessesDataTable/UsersGuessesDataTable.vue'
import BaseConfirmDialog from '@/components/Shared/BaseConfirmDialog/BaseConfirmDialog.vue'

const i18n = useI18n()
const toast = useToast()

const props = defineProps({
  championship: {
    type: Object,
    required: true
  },
  league: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(['refresh'])

const isOpen = ref(true)
const isSubmitting = ref(false)
const isConfirmDialogVisible = ref(false)

const toggle = computed(() => {
  return isOpen.value
    ? {
        icon: 'pi pi-angle-down',
        label: i18n.t('common.hide')
      }
    : {
        icon: 'pi pi-angle-right',
        label: i18n.t('common.show')
      }
})

const handleToggle = () => (isOpen.value = !isOpen.value)

const handleProcessGuesses = () => (isConfirmDialogVisible.value = true)
const handleConfirmDialogHide = () => (isConfirmDialogVisible.value = false)

const handleConfirmDialogSubmit = async () => {
  isSubmitting.value = true
  await services.guesses.processGuesses({
    leagueId: props.league.id,
    championshipId: props.championship.id
  })
  toast.add({
    group: 'app',
    severity: 'success',
    summary: i18n.t('common.success'),
    detail: i18n.t('admin.dashboard.guessesProcessedSuccess'),
    life: 4000
  })
  handleConfirmDialogHide()
  emits('refresh')
  isSubmitting.value = false
}
</script>

<style lang="scss">
.championships-matches-list {
  &-enter-active,
  &-leave-active {
    transition: all 0.3s ease-in-out;
  }

  &-enter-from,
  &-leave-to {
    transform: translateX(30px);
    opacity: 0;
  }
}
</style>
