<template>
  <UnprocessedGuessesFetcher>
    <template
      #default="{
        data: { matchesGuesses, championshipsGuesses },
        fetch: fetchUnprocessedGuesses
      }"
    >
      <LeaguesDescriptionList
        :leagues="
          parseGuessesLeagues([...matchesGuesses, ...championshipsGuesses])
        "
        :title="$t('common.unprocessedGuesses')"
        :description="$t('common.unprocessedGuesses')"
        :empty-state="$t('admin.guesses.allGuessesWereProcessed')"
      >
        <template #header-actions>
          <Button
            v-if="
              parseGuessesLeagues([...matchesGuesses, ...championshipsGuesses])
                .length > 0
            "
            :label="$t('admin.guesses.processAllGuesses')"
            icon="pi pi-bolt"
            class="p-button-primary p-button-sm"
            @click="handleProcessAllGuesses"
          />
        </template>
        <template #actions="{ league }">
          <div>
            <Button
              :label="$t('admin.guesses.viewGuesses')"
              icon="pi pi-eye"
              class="p-button-text"
              @click="handleViewGuesses(league)"
            />
            <Button
              :label="$t('admin.guesses.processGuesses')"
              icon="pi pi-bolt"
              class="p-button-text"
              @click="handleProcessGuesses(league)"
            />
          </div>
        </template>
      </LeaguesDescriptionList>
      <BaseConfirmDialog
        v-if="isConfirmDialogVisible"
        :header="confirmDialog.header"
        :message="confirmDialog.message"
        :visible="isConfirmDialogVisible"
        :disabled="isSubmitting"
        @hide="handleConfirmDialogHide"
        @submit="() => handleConfirmDialogSubmit(fetchUnprocessedGuesses)"
      />
    </template>
  </UnprocessedGuessesFetcher>
</template>

<script setup>
import { computed, ref } from 'vue'
import { uniqBy } from 'lodash/fp'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useToast } from 'primevue/usetoast'
import services from '@/services'

import UnprocessedGuessesFetcher from '@/components/Admin/Guesses/UnprocessedGuessesFetcher/UnprocessedGuessesFetcher.vue'
import LeaguesDescriptionList from '@/components/App/Leagues/LeaguesDescriptionList/LeaguesDescriptionList.vue'
import BaseConfirmDialog from '@/components/Shared/BaseConfirmDialog/BaseConfirmDialog.vue'

const router = useRouter()
const toast = useToast()
const i18n = useI18n()

defineProps({
  guesses: {
    type: Array,
    default: () => []
  }
})

const selectedLeague = ref(null)
const isSubmitting = ref(false)
const isConfirmDialogVisible = ref(false)

const parseGuessesLeagues = (unprocessedGuesses) =>
  uniqBy(
    'id',
    unprocessedGuesses.map(({ league }) => league)
  )

const handleViewGuesses = (league) =>
  router.push({
    name: 'AdminUnprocessedGuesses',
    params: {
      leagueId: league.id
    }
  })

const handleProcessGuesses = (league) => {
  selectedLeague.value = league
  isConfirmDialogVisible.value = true
}

const handleProcessAllGuesses = () => {
  // selectedLeague.value = league
  isConfirmDialogVisible.value = true
}

const handleConfirmDialogHide = () => {
  isConfirmDialogVisible.value = false
  selectedLeague.value = null
}

const confirmDialog = computed(() => {
  return selectedLeague.value
    ? {
        header: i18n.t('admin.dashboard.unprocessedGuesses.league.header', {
          leagueName: selectedLeague.value.name
        }),
        message: i18n.t('admin.dashboard.unprocessedGuesses.league.message', {
          leagueName: selectedLeague.value.name
        })
      }
    : {
        header: i18n.t('admin.dashboard.unprocessedGuesses.all.header'),
        message: i18n.t('admin.dashboard.unprocessedGuesses.all.message')
      }
})

const handleConfirmDialogSubmit = async (fetchUnprocessedGuesses) => {
  isSubmitting.value = true
  await services.guesses.processGuesses({ leagueId: selectedLeague.value?.id })
  toast.add({
    group: 'app',
    severity: 'success',
    summary: i18n.t('common.success'),
    detail: i18n.t('admin.dashboard.guessesProcessedSuccess'),
    life: 4000
  })

  handleConfirmDialogHide()
  fetchUnprocessedGuesses()
  isSubmitting.value = false
}
</script>
