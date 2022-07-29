<template>
  <div class="rounds-matches-list">
    <div class="flex align-items-center justify-content-between py-3">
      <Button
        class="p-button-text p-button-plain"
        :disabled="isCurrentFirstRound"
        @click="handlePreviousRound"
      >
        <span class="pi pi-angle-left" />
      </Button>
      {{ selectedRound.name }}
      <Button
        class="p-button-text p-button-plain"
        :disabled="isCurrentLastRound"
        @click="handleNextRound"
      >
        <span class="pi pi-angle-right" />
      </Button>
    </div>
    <ul class="list-none p-0 m-0">
      <li
        v-for="match in matches.data"
        :key="match.id"
        class="py-3 px-2 border-top-1 surface-border grid align-items-center"
      >
        <div class="col">
          <div class="grid align-items-center justify-content-end">
            <div
              class="col-6 flex gap-2 justify-content-end align-items-center flex-column-reverse md:flex-row"
            >
              {{ match.homeTeam.name }}
              <Avatar
                :image="match.homeTeam.badge"
                size="small"
                shape="circle"
              />
            </div>
            <InputNumber
              v-if="isScheduled(match)"
              :model-value="
                matchesGuesses[match.id].guess.homeTeamRegularTimeGoals
              "
              :step="1"
              :min="0"
              class="col-6"
              :class="{ 'p-invalid': submitted && errors.year }"
              @input="
                ({ value }) =>
                  handleUpdateRegularTimeGoals('homeTeam', match.id, value)
              "
            />
            <span
              v-else
              class="px-3 gap-2 flex"
              :class="getHomeTeamTeamScoreClass(matchesGuesses[match.id])"
            >
              <span>
                {{ matchesGuesses[match.id].guess.homeTeamRegularTimeGoals }}
              </span>
              <span>
                ({{ matchesGuesses[match.id].regularTimeHomeTeamGoals }})
              </span>
            </span>
          </div>
        </div>
        <div class="col-1 text-center">
          <span class="pi pi-times" />
        </div>
        <div class="col">
          <div class="grid align-items-center">
            <InputNumber
              v-if="isScheduled(match)"
              :step="1"
              class="col-6"
              :model-value="
                matchesGuesses[match.id].guess.awayTeamRegularTimeGoals
              "
              :class="{ 'p-invalid': submitted && errors.year }"
              @input="
                ({ value }) =>
                  handleUpdateRegularTimeGoals('awayTeam', match.id, value)
              "
            />
            <span
              v-else
              class="px-3 gap-2 flex"
              :class="getAwayTeamTeamScoreClass(matchesGuesses[match.id])"
            >
              <span>
                {{ matchesGuesses[match.id].guess.awayTeamRegularTimeGoals }}
              </span>
              <span>
                ({{ matchesGuesses[match.id].regularTimeAwayTeamGoals }})
              </span>
            </span>
            <div
              class="col-6 flex align-items-center justify-content-start gap-2 flex-column md:flex-row"
            >
              <Avatar
                :image="match.awayTeam.badge"
                size="small"
                shape="circle"
              />
              {{ match.awayTeam.name }}
            </div>
          </div>
        </div>
        <!-- <div class="text-500 font-medium flex align-items-center gap-5"> -->
        <!-- <Avatar :image="league.badge" size="large" shape="circle" /> -->
        <!-- {{ league.name }} -->
        <!-- </div> -->
        <!-- <div class="flex flex-column md:flex-row">
          <Button
            v-if="!isParticipant(league)"
            :label="$t('app.leagues.join')"
            icon="pi pi-sign-in"
            class="p-button-text"
            @click="emits('join', league)"
          />
          <Button
            v-if="isParticipant(league)"
            :label="$t('app.leagues.ranking')"
            icon="pi pi-list"
            class="p-button-text"
            @click="emits('ranking', league)"
          />

          <Button
            v-if="isParticipant(league)"
            :label="$t('app.leagues.participants')"
            icon="pi pi-users"
            class="p-button-text"
            @click="emits('manage', league)"
          />

          <Button
            v-if="isParticipant(league)"
            :label="$t('app.leagues.guesses')"
            icon="pi pi-user-edit"
            class="p-button-text"
            @click="emits('guesses', league)"
          />

          <Button
            v-if="canLeave(league)"
            :label="$t('app.leagues.leave')"
            icon="pi pi-sign-out"
            class="p-button-text"
            @click="emits('leave', league)"
          />
        </div> -->
      </li>
    </ul>
  </div>
</template>

<script setup>
import { MATCH_RESULTS, MATCH_STATUSES } from '@/constants/matches'
import services from '@/services'
import { reduce } from 'lodash/fp'
import { computed, reactive, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  rounds: {
    type: Array,
    default: () => []
  },
  leagueId: {
    type: Number,
    required: true
  }
})

const emits = defineEmits(['update:modelValue'])

const matches = reactive({
  loading: false,
  error: null,
  data: []
})

const guesses = reactive({
  loading: false,
  error: null,
  data: []
})

const currentRound = computed(() => props.rounds.find((round) => round.current))

const isCurrentFirstRound = computed(() => selectedRound.value?.first)

const isCurrentLastRound = computed(() => selectedRound.value?.last)

const selectedRoundIndex = ref(
  props.rounds.findIndex((round) => round.id === currentRound.value?.id)
)

const selectedRound = computed(() => props.rounds[selectedRoundIndex.value])

const matchesGuesses = computed(() =>
  reduce(
    (result, match) => {
      const guess = guesses.data.find(
        (guess) => guess.matchId === match.id
      ) || {
        homeTeamRegularTimeGoals: null,
        awayTeamRegularTimeGoals: null
      }

      return {
        ...result,
        [match.id]: {
          ...match,
          guess
        }
      }
    },
    {},
    matches.data
  )
)

watch(
  selectedRound,
  async (value) => {
    if (value) {
      matches.loading = true
      matches.data = await services.matches.fetchMatches({ roundId: value.id })
      matches.loading = false

      guesses.loading = true
      guesses.data = await services.guesses.fetchMyGuesses({
        roundId: value.id,
        leagueId: props.leagueId
      })
      guesses.loading = false
    }
  },
  { immediate: true }
)

const isScheduled = (match) => match.status === MATCH_STATUSES.SCHEDULED

const handlePreviousRound = () => selectedRoundIndex.value--

const handleNextRound = () => selectedRoundIndex.value++

const getHomeTeamTeamScoreClass = (match) => [
  match.result === MATCH_RESULTS.HOME_TEAM_REGULAR_TIME_WIN && 'text-bold'
]

const getAwayTeamTeamScoreClass = (match) => [
  match.result === MATCH_RESULTS.AWAY_TEAM_REGULAR_TIME_WIN && 'text-bold'
]

const handleUpdateRegularTimeGoals = (team, matchId, value) => {
  const guess = guesses.data.find((guess) => guess.matchId === matchId)

  if (guess) {
    guesses.data = [
      ...guesses.data.filter((guess) => guess.matchId !== matchId),
      {
        ...guess,
        [`${team}RegularTimeGoals`]: value
      }
    ]
  } else {
    guesses.data = [
      ...guesses.data,
      {
        matchId,
        [`${team}RegularTimeGoals`]: value
      }
    ]
  }

  emits('update:modelValue', matchesGuesses.value)
}
</script>

<style lang="scss">
.rounds-matches-list {
  .p-inputnumber {
    max-width: 60px;

    &-input {
      width: 100%;
    }
  }

  .grid {
    margin-top: 0;
  }
}
</style>
