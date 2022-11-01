<template>
  <div>
    <div
      class="flex flex-wrap justify-content-between align-items-center guesses__top-bar guesses__top-bar--is-pinned gap-2"
    >
      <h1 class="mb-0">
        {{ league.data.name }}
      </h1>
      <Button @click="handleRegisterGuesses" :disabled="hasNoGuesses">
        {{ $t('app.guesses.register') }}
        <span id="test"></span>
      </Button>
    </div>
    <div class="flex flex-column gap-3">
      <div
        v-for="(championship, index) in championships.data"
        :key="championship.id"
      >
        <ChampionshipsRoundsMatchesList
          v-model="matchesGuesses[championship.id]"
          :is-open="isChampionshipRoundsMatchesListOpen(index)"
          :championship="championship"
          :league-id="leagueId"
          :memory-registered-guesses="memoryRegisteredGuesses"
          empty-state="app.guesses.noRounds"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import services from '@/services'
import { reduce, flatMap, pipe, map, filter, isNil } from 'lodash/fp'
import { computed, onMounted, reactive, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

import ChampionshipsRoundsMatchesList from '@/components/App/Championships/ChampionshipsRoundsMatchesList/ChampionshipsRoundsMatchesList.vue'

import { MATCH_STATUSES } from '@/constants/matches'

const toast = useToast()
const i18n = useI18n()

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

const memoryRegisteredGuesses = ref([])

const matchesGuesses = ref(null)

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

const hasNoGuesses = computed(
  () =>
    guesses.value.length === 0 ||
    guesses.value.some(
      ({ homeTeamRegularTimeGoals, awayTeamRegularTimeGoals }) =>
        isNil(homeTeamRegularTimeGoals) || isNil(awayTeamRegularTimeGoals)
    )
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
  memoryRegisteredGuesses.value = guesses.value.map(({ matchId }) => matchId)

  await services.guesses.registerGuesses(guesses.value)
  const total = guesses.value.length

  toast.add({
    severity: 'success',
    summary: i18n.t('common.success'),
    detail: i18n.t('app.guesses.guessesCreated', { total }, total),
    life: 4000,
    group: 'app'
  })
}

const isChampionshipRoundsMatchesListOpen = (index) => index === 0
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
        h1 {
          font-size: 1.5rem;
        }
      }
    }
  }
}
</style>
