<template>
  <UnprocessedGuessesFetcher>
    <BaseDataRenderer :state="{ loading: isLoading }">
      <div
        class="flex flex-wrap justify-content-between align-items-center mb-3 unprocessed-guesses__top-bar"
      >
        <h1 class="mb-0">{{ league.name }}</h1>

        <Button v-if="hasGuesses" @click="handleProcessGuesses">
          {{ $t('admin.guesses.processGuesses') }}
        </Button>
      </div>
      <div class="flex flex-column gap-3" v-if="hasGuesses">
        <ChampionshipMatchesList
          v-for="championship in championships"
          :key="championship.id"
          :championship="championship"
        />
      </div>
      <div v-else class="surface-section p-5">
        {{ $t('admin.guesses.allGuessesWereProcessed') }}
      </div>
    </BaseDataRenderer>
  </UnprocessedGuessesFetcher>

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
import { computed, onMounted, ref } from 'vue'
import services from '@/services'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { parseGuessesChampionships } from '@/helpers/guesses'

import BaseDataRenderer from '@/components/Shared/BaseDataRenderer/BaseDataRenderer.vue'
import UnprocessedGuessesFetcher from '../UnprocessedGuessesFetcher/UnprocessedGuessesFetcher.vue'
import ChampionshipMatchesList from '@/components/Admin/Championships/ChampionshipMatchesList/ChampionshipMatchesList.vue'
import BaseConfirmDialog from '@/components/Shared/BaseConfirmDialog/BaseConfirmDialog.vue'
import { useRouter } from 'vue-router'

const toast = useToast()
const i18n = useI18n()
const router = useRouter()

const props = defineProps({
  leagueId: {
    type: Number,
    required: true
  }
})

const league = ref([])
const guesses = ref([])
const isLoading = ref(true)

const isSubmitting = ref(false)
const isConfirmDialogVisible = ref(false)

onMounted(async () => {
  isLoading.value = true
  const { leagueId } = props

  league.value = await services.leagues.fetchLeagueById(leagueId)
  await loadGuesses()

  isLoading.value = false
})

const loadGuesses = async () => {
  const { leagueId } = props
  isLoading.value = true
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

const championships = computed(() => parseGuessesChampionships(guesses.value))

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
  handleConfirmDialogHide()
  loadGuesses()
  isSubmitting.value = false
}

const hasGuesses = computed(() => guesses.value.length > 0)
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
    top: 70px;
    z-index: 1;

    &--is-pinned {
      padding: 20px 0;

      @media screen and (max-width: 960px) {
        h1 {
          font-size: 1.5rem;
        }
      }
    }
  }
}
</style>
