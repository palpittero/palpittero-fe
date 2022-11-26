<template>
  <!-- <pre>{{ championshipsGuesses }}</pre> -->
  <div>
    <div
      class="flex flex-wrap justify-content-between align-items-center guesses__top-bar guesses__top-bar--is-pinned gap-2"
    >
      <h1 class="mb-0">
        {{ league.data.name }}
      </h1>
      <Button
        @click="handleRegisterGuesses"
        :disabled="disableRegisterGuesses"
        icon="pi pi-bolt"
        :label="$t('app.guesses.register')"
      />
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
</template>

<script setup>
import { reduce, flatMap, pipe, map, filter, isNil, uniqBy } from 'lodash/fp'
import { computed, onMounted, reactive, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

import services from '@/services'
import ChampionshipsRoundsMatchesList from '@/components/App/Championships/ChampionshipsRoundsMatchesList/ChampionshipsRoundsMatchesList.vue'

import { MATCH_STATUSES } from '@/constants/matches'
import { CHAMPIONSHIPS_ROUND_TYPE } from '@/constants/championships'
import { useAuthStore } from '@/stores/auth'

const toast = useToast()
const i18n = useI18n()
const { loggedUser } = useAuthStore()

const props = defineProps({
  leagueId: {
    type: Number,
    required: true
  }
})

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

  const toastOptions =
    total > 0
      ? {
          severity: 'success',
          summary: i18n.t('common.success')
        }
      : {
          severity: 'warn',
          summary: i18n.t('common.warning')
        }

  toast.add({
    detail: i18n.t('app.guesses.guessesCreated', { total }, total),
    life: 4000,
    group: 'app',
    ...toastOptions
  })

  if (invalidGuesses > 0) {
    renderKey.value++
  }

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

const disableRegisterGuesses = computed(
  () => hasInvalidGuesses.value || isLoading.value
)
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
    top: 70px;
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
}
</style>
