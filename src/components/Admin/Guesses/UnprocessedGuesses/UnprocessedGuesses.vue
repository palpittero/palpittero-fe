<template>
  <BaseDataRenderer class="unprocessed-guesses" :state="{ loading: isLoading }">
    <div
      class="flex flex-wrap justify-content-between align-items-center guesses__top-bar--is-pinned unprocessed-guesses__top-bar"
    >
      <h1 class="mb-0">{{ league.name }}</h1>

      <Button
        v-if="hasGuesses"
        @click="handleProcessGuesses"
        icon="pi pi-bolt"
        :label="$t('admin.guesses.processGuesses')"
      />
    </div>
    <TabView>
      <TabPanel :header="matchesGuessesTabHeader">
        <div class="flex flex-column gap-3" v-if="hasGuesses">
          <ChampionshipMatchesList
            :championship="championship"
            v-for="championship in championships"
            :key="championship.id"
            :league="league"
            @refresh="loadGuesses"
          />
        </div>
        <div v-else class="surface-section p-5">
          {{ $t('admin.guesses.allGuessesWereProcessed') }}
        </div>
      </TabPanel>
      <TabPanel :header="championshipsGuessesTabHeader">
        <div class="flex flex-column gap-3" v-if="hasChampionshipGuesses">
          <UserChampionshipGuessesList
            class="p-3"
            v-for="championship in guessesChampionships"
            open
            :key="championship.id"
            :championship="championship"
            :league="league"
          />
        </div>
        <div v-else class="surface-section p-5">
          {{ $t('admin.guesses.allGuessesWereProcessed') }}
        </div>
      </TabPanel>
    </TabView>
  </BaseDataRenderer>

  <BaseConfirmDialog
    :header="
      $t('admin.dashboard.unprocessedGuesses.league.header', {
        leagueName: league.name
      })
    "
    :message="
      $t('admin.dashboard.unprocessedGuesses.league.message', {
        leagueName: league.name
      })
    "
    :visible="isConfirmDialogVisible"
    :disabled="isSubmitting"
    @hide="handleConfirmDialogHide"
    @submit="handleConfirmDialogSubmit"
  />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import services from '@/services'
import {
  parseChampionshipsGuesses,
  parseMatchesGuesses
} from '@/helpers/guesses'

import BaseDataRenderer from '@/components/Shared/BaseDataRenderer/BaseDataRenderer.vue'
import ChampionshipMatchesList from '@/components/Admin/Championships/ChampionshipMatchesList/ChampionshipMatchesList.vue'
import UserChampionshipGuessesList from '@/components/Shared/Guesses/UserChampionshipGuessesList/UserChampionshipGuessesList.vue'
import BaseConfirmDialog from '@/components/Shared/BaseConfirmDialog/BaseConfirmDialog.vue'

const toast = useToast()
const i18n = useI18n()
const router = useRouter()

const props = defineProps({
  leagueId: {
    type: Number,
    required: true
  }
})

const emits = defineEmits(['ready'])

const league = ref([])
const guesses = ref([])
const isLoading = ref(true)

const isSubmitting = ref(false)
const isConfirmDialogVisible = ref(false)

onMounted(async () => {
  const { leagueId } = props
  isLoading.value = true
  league.value = await services.leagues.fetchLeagueById(leagueId)
  await loadGuesses()
  isLoading.value = false
  emits('ready', { league: league.value })
})

const loadGuesses = async () => {
  const { leagueId } = props
  guesses.value = await services.dashboard.fetchUnprocessedGuesses({
    leagueId
  })
  if (guesses.value.length === 0) {
    router.push({
      name: 'AdminUnprocessedGuessesLeagues'
    })
  }
  isLoading.value = false
}

const championships = computed(() =>
  parseMatchesGuesses(guesses.value.matchesGuesses)
)

const guessesChampionships = computed(() =>
  parseChampionshipsGuesses(guesses.value.championshipsGuesses)
)

const handleProcessGuesses = () => (isConfirmDialogVisible.value = true)

const handleConfirmDialogHide = () => (isConfirmDialogVisible.value = false)

const handleConfirmDialogSubmit = async () => {
  isSubmitting.value = true
  await services.guesses.processGuesses({ leagueId: league.value.id })
  toast.add({
    group: 'app',
    severity: 'success',
    summary: i18n.t('common.success'),
    detail: i18n.t('admin.dashboard.guessesProcessedSuccess'),
    life: 4000
  })
  handleConfirmDialogHide()
  loadGuesses()
  isSubmitting.value = false
}

const hasGuesses = computed(() => guesses.value.matchesGuesses.length > 0)
const hasChampionshipGuesses = computed(
  () => guesses.value.championshipsGuesses.length > 0
)

const matchesGuessesTabHeader = computed(
  () => `${i18n.t('common.matches')} (${guesses.value.matchesGuesses.length})`
)
const championshipsGuessesTabHeader = computed(
  () =>
    `${i18n.t('common.positions')} (${
      guesses.value.championshipsGuesses.length
    })`
)
</script>

<style lang="scss">
.unprocessed-guesses {
  &__top-bar {
    background-color: #fafafa;
    position: -webkit-sticky;
    position: -moz-sticky;
    position: -o-sticky;
    position: -ms-sticky;
    position: sticky;
    top: 60px;
    z-index: 1;

    &--is-pinned {
      padding: 20px 0;

      @media screen and (max-width: 960px) {
        padding: 10px;

        h1 {
          font-size: 1.1rem;
          font-weight: bold;
        }

        .p-button {
          padding: 8px;
          font-size: 0.9rem;
        }
      }
    }
  }

  .p-tabview-panels {
    background: transparent !important;
    padding: 0 !important;
  }
}
</style>
