<template>
  <div>
    <div
      class="flex flex-wrap justify-content-between align-items-center guesses__top-bar guesses__top-bar--is-pinned gap-2"
    >
      <Heading
        :label="league.data.name"
        icon="pi pi-flag md:text-4xl"
        class="mb-0 md:text-4xl"
      />

      <div class="flex gap-2">
        <Button
          @click="handleRegisterGuesses"
          :disabled="isRegisterGuessesDisabled"
          icon="pi pi-bolt"
          :label="$t('app.guesses.register')"
        />
        <Button
          @click="handleCopyGuesses"
          :disabled="isLoading"
          icon="pi pi-copy"
          class="bg-white text-primary"
          :label="$t('app.guesses.copy')"
        />
      </div>
    </div>
    <div class="flex flex-column gap-3" :key="renderKey">
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
  </div>

  <CopyGuessesDialog
    v-if="isCopyGuessesDialogOpen"
    :visible="isCopyGuessesDialogOpen"
    :league="league.data"
    :championships="championships.data"
    @hide="handleCopyGuessesDialogHide"
    @submit="handleCopyGuessesDialogSubmit"
  />
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

import { MATCH_STATUSES } from '@/constants/matches'
import { CHAMPIONSHIPS_ROUND_TYPE } from '@/constants/championships'
import Heading from '@/components/Shared/Heading/Heading.vue'

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

  const total =
    guesses.value.length - invalidGuesses + championshipsGuesses.value.length

  const toastType = total > 0 ? 'warning' : 'success'

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
.guesses {
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
        padding: 10px 0;

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
}
</style>
