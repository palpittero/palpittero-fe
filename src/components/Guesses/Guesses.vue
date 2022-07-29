<template>
  <div>
    <div class="flex justify-content-between align-items-center mb-3">
      <h1 class="mb-0">
        {{ league.data.name }}
      </h1>
      <!-- {{ guesses }} -->
      <Button @click="handleRegisterGuesses" :disabled="hasNoGuess">
        {{ $t('app.guesses.register') }}
      </Button>
    </div>
    <div v-for="championship in championships.data" :key="championship.id">
      <!-- <pre>
        {{ matchesGuesses }}
      </pre> -->
      <ChampionshipsRoundsMatchesList
        v-model="matchesGuesses[championship.id]"
        :championship="championship"
        :league-id="leagueId"
        empty-state="app.guesses.noRounds"
      />
    </div>
  </div>
  <!-- <h1>Guesses</h1> -->
</template>

<script setup>
import services from '@/services'
import { reduce, flatMap, pipe, map, filter } from 'lodash/fp'
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

const matchesGuesses = ref(null)

const guesses = computed(() =>
  pipe(
    reduce(
      (result, matchGuess) => [...result, ...flatMap((it) => it, matchGuess)],
      []
    ),
    map(({ guess }) => ({
      ...guess,
      leagueId: props.leagueId
    })),
    filter(({ match }) => !match || match?.status === MATCH_STATUSES.SCHEDULED)
  )(matchesGuesses.value)
)

const hasNoGuess = computed(() => guesses.value.length === 0)

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
  await services.guesses.registerGuesses(guesses.value)

  toast.add({
    severity: 'success',
    summary: i18n.t('common.success'),
    detail: i18n.t('app.guesses.guessesCreated'),
    life: 3000,
    group: 'app'
  })
}
</script>
