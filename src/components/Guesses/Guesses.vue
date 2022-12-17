<template>
  <div
    class="guesses__top-bar hstack bg-blur justify-content-between pt-2 px-2"
  >
    <Heading class="mb-0" :label="league.data.name" icon="fas fa-flag" />
    <div class="hstack gap-2 d-none d-lg-flex">
      <PButton
        @click="handleLeagueRanking"
        icon="fas fa-ranking-star"
        :label="$t('app.leagues.ranking')"
      />
      <PButton
        @click="handleCopyGuesses"
        icon="fas fa-copy"
        :label="$t('app.guesses.copy')"
      />
    </div>
  </div>
  <!-- <div class="guesses__top-bar hstack justify-content-between bg-white">
    <Heading :label="league.data.name" icon="fas fa-flag" class="mb-0" />

    <PButton
      @click="handleRegisterGuesses"
      icon="fas fa-bolt-lightning"
      class="d-none d-lg-flex"
      variant="success"
      :label="$t('app.guesses.register')"
      :disabled="isRegisterGuessesDisabled"
    />
  </div> -->
  <hr />

  <!-- <div
      class="guesses__top-bar d-flex flex-column flex-lg-row align-items-center justify-content-between position-sticky w-100 bg-white gap-2 p-3"
    >
      <Heading :label="league.data.name" icon="fas fa-flag" />

      <div class="d-flex gap-2">
        <PButton
          @click="handleRegisterGuesses"
          icon="fas fa-bolt-lightning"
          :label="$t('app.guesses.register')"
          :disabled="isRegisterGuessesDisabled"
        />
        <PButton
          @click="handleCopyGuesses"
          :disabled="isLoading"
          icon="fas fa-copy"
          variant="outline-primary"
          :label="$t('app.guesses.copy')"
        />
      </div>
    </div> -->
  <div class="flex flex-column gap-3 mb-3" :key="renderKey">
    <div
      v-for="(championship, index) in championships.data"
      :key="championship.id"
    >
      <ChampionshipsRoundsMatchesList
        v-model="matchesGuesses[championship.id]"
        :is-open="isChampionshipRoundsMatchesListOpen(index)"
        :championship="championship"
        :league-id="leagueId"
        :enable-position-guesses="championship.enableGuesses"
        :memory-registered-guesses="memoryRegisteredGuesses"
        empty-state="app.guesses.noRounds"
        @update:championship-guesses="handleUpdateChampionshipGuesses"
      />
    </div>
  </div>

  <div class="d-none d-lg-flex justify-content-end">
    <PButton
      @click="handleRegisterGuesses"
      icon="fas fa-bolt-lightning"
      class="d-none d-lg-flex"
      variant="success"
      :label="$t('app.guesses.register')"
      :disabled="isRegisterGuessesDisabled"
    />
  </div>

  <div class="guesses__bottom-bar position-fixed d-block bg-blur p-3 w-100">
    <PButton
      @click="handleRegisterGuesses"
      icon="fas fa-bolt-lightning"
      class="w-100 fs-3"
      variant="success"
      :label="$t('app.guesses.register')"
      :disabled="isRegisterGuessesDisabled"
    />
  </div>

  <CopyGuessesDialog
    :visible="isCopyGuessesDialogOpen"
    :league="league.data"
    :championships="championships.data"
    @hide="handleCopyGuessesDialogHide"
    @submit="handleCopyGuessesDialogSubmit"
  />

  <LeagueRankingDialog
    :league="league.data"
    :visible="isLeagueRankingDialogVisible"
    @hide="handleLeagueRankingDialogHide"
  />
  <!-- </div> -->
</template>

<script setup>
import { reduce, flatMap, pipe, map, filter, isNil, uniqBy } from 'lodash/fp'
import { computed, onMounted, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'

import services from '@/services'
import { useAuthStore } from '@/stores/auth'

import ChampionshipsRoundsMatchesList from '@/components/App/Championships/ChampionshipsRoundsMatchesList/ChampionshipsRoundsMatchesList.vue'
import CopyGuessesDialog from './CopyGuessesDialog/CopyGuessesDialog.vue'
import Heading from '@/components/Shared/Heading/Heading.vue'
import LeagueRankingDialog from '@/components/App/Leagues/LeagueRankingDialog/LeagueRankingDialog.vue'

import { MATCH_STATUSES } from '@/constants/matches'
import { CHAMPIONSHIPS_ROUND_TYPE } from '@/constants/championships'

const toast = useToast()
const i18n = useI18n()
const { loggedUser } = useAuthStore()

const props = defineProps({
  leagueId: {
    type: Number,
    required: true
  }
})

const emits = defineEmits(['ready'])

const championships = reactive({
  loading: false,
  error: null,
  data: []
})

const league = reactive({
  loading: false,
  error: null,
  data: {}
})

const renderKey = ref(0)
const memoryRegisteredGuesses = ref([])
const matchesGuesses = ref(null)
const championshipsGuesses = ref([])
const isCopyGuessesDialogOpen = ref(false)
const isLeagueRankingDialogVisible = ref(false)
const isLoading = ref(false)

const guesses = computed(() =>
  pipe(
    reduce(
      (result, matchGuess) => [...result, ...flatMap((it) => it, matchGuess)],
      []
    ),
    map((guess) => ({
      ...guess,
      leagueId: props.leagueId
    })),
    filter(
      ({ match, leagueId, matchId }) =>
        leagueId &&
        matchId &&
        (!match || match?.status === MATCH_STATUSES.SCHEDULED)
    )
  )(matchesGuesses.value)
)

const hasInvalidGuesses = computed(
  () =>
    championships.data.every(({ enableGuesses }) => !enableGuesses) &&
    (guesses.value.length === 0 ||
      guesses.value.some(
        ({
          homeTeamRegularTimeGoals,
          awayTeamRegularTimeGoals,
          homeTeamPenaltiesTimeGoals,
          awayTeamPenaltiesTimeGoals,
          match
        }) => {
          const isPenaltiesRound = [
            CHAMPIONSHIPS_ROUND_TYPE.EXTRA_TIME,
            CHAMPIONSHIPS_ROUND_TYPE.PENALTIES
          ].includes(match.round.type)

          const hasInvalidPenaltiesGuesses =
            (isPenaltiesRound &&
              !isNil(homeTeamPenaltiesTimeGoals) &&
              isNil(awayTeamPenaltiesTimeGoals)) ||
            (!isNil(awayTeamPenaltiesTimeGoals) &&
              isNil(homeTeamPenaltiesTimeGoals)) ||
            (homeTeamPenaltiesTimeGoals &&
              awayTeamPenaltiesTimeGoals &&
              homeTeamPenaltiesTimeGoals === awayTeamPenaltiesTimeGoals)

          return (
            isNil(homeTeamRegularTimeGoals) ||
            isNil(awayTeamRegularTimeGoals) ||
            hasInvalidPenaltiesGuesses
          )
        }
      ))
)

onMounted(async () => {
  league.data = await services.leagues.fetchLeagueById(props.leagueId)
  championships.data = await services.leagues.fetchChampionships(props.leagueId)
  matchesGuesses.value = championships.data.reduce(
    (result, championship) => ({
      ...result,
      [championship.id]: reactive({})
    }),
    {}
  )

  emits('ready', { league: league.data })
})

const handleRegisterGuesses = async () => {
  isLoading.value = true
  memoryRegisteredGuesses.value = guesses.value.map(({ matchId }) => matchId)

  const { invalidGuesses } = await services.guesses.registerGuesses({
    matchesGuesses: guesses.value,
    championshipsGuesses: championshipsGuesses.value.map((guess) => ({
      ...guess,
      leagueId: props.leagueId,
      userId: loggedUser?.id
    }))
  })

  const total = guesses.value.length - invalidGuesses //+ championshipsGuesses.value.length

  const toastType = invalidGuesses === 0 ? 'success' : 'warning'

  toast[toastType](i18n.t('app.guesses.guessesCreated', { total }, total))

  if (invalidGuesses > 0) {
    renderKey.value++
  }

  isLoading.value = false
}

const isRegisterGuessesDisabled = computed(
  () => hasInvalidGuesses.value || isLoading.value
)

const handleCopyGuesses = () => (isCopyGuessesDialogOpen.value = true)

const handleCopyGuessesDialogHide = () =>
  (isCopyGuessesDialogOpen.value = false)

const handleCopyGuessesDialogSubmit = async ({
  sourceLeagueId,
  targetLeagueId,
  championshipsIds,
  copyMatchesGuesses,
  copyChampionshipsGuesses
}) => {
  isLoading.value = true
  const { total = 0 } = await services.guesses.copyGuesses({
    sourceLeagueId,
    targetLeagueId,
    championshipsIds,
    copyMatchesGuesses,
    copyChampionshipsGuesses
  })

  const toastType = total > 0 ? 'success' : 'warning'

  toast[toastType](i18n.t('app.guesses.guessesCopied', { total }, total))
  handleCopyGuessesDialogHide()
  renderKey.value++
  isLoading.value = false
}

const handleLeagueRanking = () => (isLeagueRankingDialogVisible.value = true)
const handleLeagueRankingDialogHide = () =>
  (isLeagueRankingDialogVisible.value = false)

const isChampionshipRoundsMatchesListOpen = (index) => index === 0

const handleUpdateChampionshipGuesses = (championshipGuesses) => {
  championshipsGuesses.value = uniqBy(
    ({ championshipId, leagueId, userId, position }) =>
      [championshipId, leagueId, userId, position].join(),
    [...championshipsGuesses.value, ...Object.values(championshipGuesses)]
  )
}
</script>

<style lang="scss">
@import '@/assets/styles/styles.scss';
.guesses {
  &__top-bar {
    // position: -webkit-sticky;
    // position: -moz-sticky;
    // position: -o-sticky;
    // position: -ms-sticky;
    // position: sticky;
    // top: 80px;
    // z-index: 1;

    // padding: 0.5rem 0;
    // width: inherit;

    @media screen and (max-width: 960px) {
      // .btn {
      //   --bs-btn-padding-y: 0.25rem;
      //   --bs-btn-padding-x: 0.5rem;
      //   --bs-btn-font-size: 0.875rem;
      //   --bs-btn-border-radius: 0.25rem;
      // }

      // padding: 0.8rem 1rem;
      top: 70px;

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

  &__bottom-bar {
    z-index: 1;
    bottom: 0;
    right: 0;
    left: 0;
  }
}
</style>
