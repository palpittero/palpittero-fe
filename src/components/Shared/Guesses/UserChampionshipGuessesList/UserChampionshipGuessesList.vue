<template>
  <div class="surface-section">
    <div class="flex justify-content-between cursor-pointer">
      <div class="flex gap-3 py-3">
        <span class="font-medium text-3xl text-900">
          {{ championship.name }} {{ championship.year }}
        </span>
        <Button
          v-if="!readonly"
          @click="handleProcessGuesses"
          class="p-button p-button-text border border-1 border-primary p-button-sm py-0 px-2"
          icon="pi pi-bolt"
          :label="$t('admin.guesses.processGuesses')"
        />
      </div>
      <span
        class="flex align-items-center gap-3"
        @click="handleToggle"
        v-if="!readonly"
      >
        {{ toggle.label }} <span :class="toggle.icon" />
      </span>
    </div>

    <Transition name="championships-matches-list">
      <BaseDataTable
        v-show="isOpen"
        :items="{ data: championship.users }"
        paginator
      >
        <Column field="user.name" :header="$t('common.player')">
          <template #body="{ data }">
            {{ data.name }}
          </template>
        </Column>
        <Column
          field="guess"
          :header="$t('common.guesses')"
          headerClass="flex align-items-start"
        >
          <template #body="{ data }">
            <div class="grid flex-column md:flex-row gap-5">
              <div
                v-for="guess in data.guesses"
                :key="guess.id"
                class="col-12 md:col-3 field"
              >
                <label class="text-bold text-right md:text-left">
                  {{ positionLabels[guess.position] }}
                </label>
                <div class="flex align-items-center gap-2">
                  <BadgeAvatar :image="guess.team.badge" />
                  {{ guess.team.name }}
                </div>
              </div>
            </div>
          </template>
        </Column>
        <Column field="points" :header="$t('common.points', 2)">
          <template #body="{ data }">
            <GuessPointsBadge
              :guess="{
                id: data.id,
                points: calculateTotalPoints(data.guesses)
              }"
            />
          </template>
        </Column>
      </BaseDataTable>
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
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'

import services from '@/services'

import BaseDataTable from '@/components/Shared/BaseDataTable/BaseDataTable.vue'
import GuessPointsBadge from '@/components/App/Championships/ChampionshipsRoundsMatchesList/RoundsMatchesList/GuessPointsBadge/GuessPointsBadge.vue'
import BadgeAvatar from '@/components/Shared/BadgeAvatar/BadgeAvatar.vue'
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
  },
  readonly: Boolean,
  open: Boolean
})

const emits = defineEmits(['refresh'])

const isOpen = ref(props.open)
const isSubmitting = ref(false)
const isConfirmDialogVisible = ref(false)

const positionLabels = {
  1: i18n.t('admin.championships.champion'),
  2: i18n.t('admin.championships.runnerUp')
}

const calculateTotalPoints = (guesses) =>
  guesses.reduce((acc, guess) => acc + guess.points || 0, 0) || null

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
