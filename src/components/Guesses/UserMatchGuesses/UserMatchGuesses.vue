<template>
  <div>
    <BaseDataRenderer :state="{ ...match, loading }">
      <div v-if="match.data">
        <div class="mb-3">
          <h1 class="mb-0">
            {{ league.data.name }} - Partida #{{ match.data.id }}
          </h1>
          <h5 class="mt-2">
            {{ match.data.round.championship.name }}
            {{ match.data.round.championship.year }}
            // {{ match.data.round.name }}
          </h5>
        </div>
        <MatchCard :match="match.data" />
        <UsersGuessesMatchDataTable :match="match.data" :guesses="guesses" />
      </div>
      <!-- <UserMatchGuess v-for="userMatchGuess in userMatchGuesses" /> -->
    </BaseDataRenderer>

    <!-- <BaseDataRenderer :state="{}"></BaseDataRenderer> -->
    <!-- <template>
      <div>
        
      </div>
    </template> -->
    <!-- <div v-for="championship in championships.data" :key="championship.id">
      <ChampionshipsRoundsMatchesList
        v-model="matchesGuesses[championship.id]"
        :championship="championship"
        :league-id="leagueId"
        empty-state="app.guesses.noRounds"
      />
    </div> -->
  </div>
  <!-- <h1>Guesses</h1> -->
</template>

<script setup>
import services from '@/services'
// import { reduce, flatMap, pipe, map, filter } from 'lodash/fp'
import { onMounted, ref } from 'vue'
import BaseDataRenderer from '@/components/Shared/BaseDataRenderer/BaseDataRenderer.vue'
// import BaseDataTable from '@/components/Shared/BaseDataTable/BaseDataTable.vue'
import MatchCard from '@/components/Shared/Matches/MatchCard/MatchCard.vue'
// import MatchScore from '@/components/Shared/Matches/MatchScore/MatchScore.vue'
// import GuessPointsBadge from '@/components/App/Championships/ChampionshipsRoundsMatchesList/RoundsMatchesList/GuessPointsBadge/GuessPointsBadge.vue'
import UsersGuessesMatchDataTable from '@/components/Shared/Guesses/UsersGuessesMatchDataTable/UsersGuessesMatchDataTable.vue'
// import { useToast } from 'primevue/usetoast'
// import { useI18n } from 'vue-i18n'

// import ChampionshipsRoundsMatchesList from '@/components/App/Championships/ChampionshipsRoundsMatchesList/ChampionshipsRoundsMatchesList.vue'
//
// import { MATCH_STATUSES } from '@/constants/matches'

// const toast = useToast()
// const i18n = useI18n()

const props = defineProps({
  leagueId: {
    type: Number,
    required: true
  },
  matchId: {
    type: Number,
    required: true
  }
})

// const championships = reactive({
//   loading: false,
//   error: null,
//   data: []
// })

const league = ref({
  loading: false,
  error: null,
  data: {}
})

const match = ref({
  loading: false,
  error: null,
  data: null
})

const guesses = ref({
  loading: false,
  error: null,
  data: []
})

const loading = ref(false)

// const matchesGuesses = ref(null)

// const isLoading = computed(())

// const guesses = computed(() =>
//   pipe(
//     reduce(
//       (result, matchGuess) => [...result, ...flatMap((it) => it, matchGuess)],
//       []
//     ),
//     map(({ guess }) => ({
//       ...guess,
//       leagueId: props.leagueId
//     })),
//     filter(({ match }) => !match || match?.status === MATCH_STATUSES.SCHEDULED)
//   )(matchesGuesses.value)
// )

// const hasNoGuess = computed(() => guesses.value.length === 0)

onMounted(async () => {
  loading.value = true
  match.value.data = await services.matches.fetchMatchById(props.matchId)
  league.value.data = await services.leagues.fetchLeagueById(props.leagueId)
  guesses.value.data = await services.guesses.fetchGuesses({
    leagueId: props.leagueId,
    matchId: props.matchId,
    roundId: match.value.data.round.id
  })
  console.log(guesses.value.data)
  loading.value = false
  // console.log(match.value.data)

  // championships.data = await services.leagues.fetchChampionships(props.leagueId)
  // matchesGuesses.value = championships.data.reduce(
  //   (result, championship) => ({
  //     ...result,
  //     [championship.id]: reactive({})
  //   }),
  //   {}
  // )
})

// const parseMatchGuess = (guess) => ({
//   ...match.value.data,
//   regularTimeHomeTeamGoals: guess.homeTeamRegularTimeGoals,
//   regularTimeAwayTeamGoals: guess.awayTeamRegularTimeGoals
// })

// const handleRegisterGuesses = async () => {
//   const validGuesses = guesses.value.filter(
//     ({ leagueId, matchId }) => leagueId && matchId
//   )
//   await services.guesses.registerGuesses(validGuesses)

//   toast.add({
//     severity: 'success',
//     summary: i18n.t('common.success'),
//     detail: i18n.t('app.guesses.guessesCreated'),
//     life: 3000,
//     group: 'app'
//   })
// }
</script>
