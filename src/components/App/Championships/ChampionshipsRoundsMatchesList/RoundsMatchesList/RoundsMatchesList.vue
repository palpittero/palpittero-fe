<template>
  <div class="rounds-matches-list">
    <!-- RoundsNavigator -->
    <RoundsNavigator
      :selected-round="selectedRound"
      @previous="handlePreviousRound"
      @next="handleNextRound"
    />

    <ul class="list-group list-group-flush">
      <template v-if="hasMatches">
        <li
          v-for="match in orderedMatches"
          :key="match.id"
          class="list-group-item vstack gap-3 p-1 p-lg-3"
          :class="getMatchClass(matchesGuesses[match.id])"
        >
          <div
            class="d-flex flex-column flex-lg-row align-items-start justify-content-between"
          >
            <!-- Group name -->
            <div
              v-if="match.group"
              class="d-flex text-bold justify-content-center justify-content-lg-start w-100"
            >
              {{ match.group.name }}
            </div>
            <!-- Match status -->
            <div
              class="d-flex flex-column flex-lg-row align-self-center align-items-center gap-2 w-100"
            >
              <div class="vstack align-items-center gap-2">
                <em>{{ $d(new Date(match.date), 'long', 'pt-BR') }}</em>
                <MatchStatusBadge :status="match.status" />
              </div>
            </div>
            <!-- Guess status / view other badges -->
            <div
              class="w-full gap-2 d-none d-lg-flex flex-column align-items-end w-100"
            >
              <GuessPointsBadge
                v-if="isMatchFinished(match)"
                :guess="matchesGuesses[match.id]"
              />
            </div>
          </div>
          <div class="rounded shadow-lg p-3">
            <div class="d-flex align-items-center gap-2">
              <!-- Home team name and badge -->
              <TeamAvatar
                class="rounds-matches-list__team-avatar"
                :team="match.homeTeam"
                :class="getGuessHomeTeamScoreClass(match)"
              />
              <!-- Regular time inputs -->
              <div
                class="d-flex gap-2 w-100 justify-content-evenly align-items-start align-self-center"
              >
                <PInput
                  v-if="isMatchScheduled(match)"
                  type="number"
                  class="text-center"
                  :model-value="
                    matchesGuesses[match.id].homeTeamRegularTimeGoals
                  "
                  :min="0"
                  @update:model-value="
                    (value) =>
                      handleUpdateRegularTimeGoals('homeTeam', match.id, value)
                  "
                />
                <span v-else class="fs-1">
                  <!-- Home team regular time goals -->
                  <span :class="getGuessHomeTeamRegularTimeScoreClass(match)">
                    {{
                      parseMatchGoals(
                        matchesGuesses[match.id].homeTeamRegularTimeGoals
                      )
                    }}
                  </span>
                  <!-- Home team penalties time goals -->
                  <span
                    v-if="showPenaltiesResult(match)"
                    :class="getGuessHomeTeamPenaltiesTimeScoreClass(match)"
                  >
                    ({{
                      parseMatchGoals(
                        matchesGuesses[match.id].homeTeamPenaltiesTimeGoals
                      )
                    }})
                  </span>
                </span>
                <font-awesome-icon
                  icon="fas fa-times"
                  class="align-self-center"
                />
                <PInput
                  v-if="isMatchScheduled(match)"
                  inputClass="text-center"
                  type="number"
                  :model-value="
                    matchesGuesses[match.id].awayTeamRegularTimeGoals
                  "
                  :step="1"
                  :min="0"
                  @update:model-value="
                    (value) =>
                      handleUpdateRegularTimeGoals('awayTeam', match.id, value)
                  "
                />
                <span v-else class="fs-1">
                  <span
                    v-if="showPenaltiesResult(match)"
                    :class="getGuessAwayTeamPenaltiesTimeScoreClass(match)"
                  >
                    <span>
                      ({{
                        parseMatchGoals(
                          matchesGuesses[match.id].awayTeamPenaltiesTimeGoals
                        )
                      }})
                    </span>
                  </span>
                  <!-- Away team regular time goals -->
                  <span :class="getGuessAwayTeamRegularTimeScoreClass(match)">
                    <span>
                      {{
                        parseMatchGoals(
                          matchesGuesses[match.id].awayTeamRegularTimeGoals
                        )
                      }}
                    </span>
                  </span>
                </span>
              </div>
              <!-- Away team regular time input -->
              <TeamAvatar
                class="rounds-matches-list__team-avatar"
                :team="match.awayTeam"
                :class="getGuessAwayTeamScoreClass(match)"
              />
            </div>

            <div v-if="allowPenaltiesGuess(match)">
              <div class="d-flex justify-content-center">
                <PButton
                  :variant="getPenaltiesGuessToggle(match).variant"
                  @click="handleShowPenaltiesToggle(match)"
                  :label="getPenaltiesGuessToggle(match).label"
                  size="sm"
                />
              </div>
              <template v-if="showPenaltiesGuess[match.id]">
                <div class="hstack gap-2 py-3">
                  <!-- Fake home team -->
                  <div class="rounds-matches-list__team-avatar" />
                  <!-- Penalties time inputs -->
                  <div class="hstack gap-2">
                    <PInput
                      inputClass="text-center"
                      type="number"
                      :model-value="
                        matchesGuesses[match.id].homeTeamPenaltiesTimeGoals
                      "
                      :min="0"
                      @update:model-value="
                        (value) =>
                          handleUpdatePenaltiesTimeGoals(
                            'homeTeam',
                            match.id,
                            value
                          )
                      "
                    />
                    <font-awesome-icon icon="fas fa-times" />
                    <PInput
                      className="text-center"
                      type="number"
                      :model-value="
                        matchesGuesses[match.id].awayTeamPenaltiesTimeGoals
                      "
                      :step="1"
                      :min="0"
                      @update:model-value="
                        (value) =>
                          handleUpdatePenaltiesTimeGoals(
                            'awayTeam',
                            match.id,
                            value
                          )
                      "
                    />
                  </div>
                  <!-- Fake away team -->
                  <div class="rounds-matches-list__team-avatar" />
                </div>
              </template>
            </div>
          </div>

          <div class="d-flex flex-column align-items-center gap-2">
            <template v-if="isMatchFinished(match)">
              <MatchNoResult v-if="matchHasNoResult(match)" align="center" />
              <RoundMatchFinalResult v-else :guess="matchesGuesses[match.id]" />
              <GuessPointsBadge
                class="d-lg-none"
                :guess="matchesGuesses[match.id]"
              />
            </template>
            <PButton
              @click="openLeagueMatchGuessesDialog(match)"
              :label="$t('app.guesses.viewOtherGuesses')"
              variant="link"
              class="px-0"
              icon="fas fa-search"
            />
          </div>
        </li>
      </template>
      <div v-else class="text-center">
        {{ $t('app.guesses.noMatches') }}
      </div>
    </ul>
  </div>
  <!-- <Menu ref="menu" :model="menuItems" popup /> -->

  <LeagueMatchGuessesDialog
    v-if="isLeagueGuessesDialogVisible"
    :league-id="leagueId"
    :match-id="matchId"
    :visible="isLeagueGuessesDialogVisible"
    @hide="handleLeagueMatchGuessesDialogHide"
  />
</template>

<script setup>
import { reduce, isNil, isEmpty, uniqueId, orderBy } from 'lodash/fp'
import { computed, reactive, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import services from '@/services'
import {
  isMatchScheduled,
  isMatchFinished,
  matchHasNoResult
} from '@/helpers/matches'

import MatchStatusBadge from './MatchStatusBadge/MatchStatusBadge.vue'
import GuessPointsBadge from './GuessPointsBadge/GuessPointsBadge.vue'
import RoundMatchFinalResult from './RoundMatchFinalResult/RoundMatchFinalResult.vue'
import MatchNoResult from '@/components/Shared/Matches/MatchNoResult.vue'
// import Avatar from '@/components/Shared/Avatar/Avatar.vue'
import LeagueMatchGuessesDialog from './LeagueMatchGuessesDialog/LeagueMatchGuessesDialog.vue'

import TeamAvatar from '@/components/Shared/TeamAvatar/TeamAvatar.vue'
import RoundsNavigator from './RoundsNavigator.vue'

import { CHAMPIONSHIPS_ROUND_TYPE } from '@/constants/championships'
import { MATCH_STATUSES } from '@/constants/matches'

const router = useRouter()
const route = useRoute()
const i18n = useI18n()

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
  },
  memoryRegisteredGuesses: {
    type: Array,
    default: () => []
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

const showPenaltiesGuess = ref({})
const isLeagueGuessesDialogVisible = ref(false)
const matchId = ref(null)

const handleShowPenaltiesToggle = (match) => {
  showPenaltiesGuess.value[match.id] = !showPenaltiesGuess.value[match.id]
  if (showPenaltiesGuess.value[match.id]) {
    matchesGuesses.value[match.id].homeTeamPenaltiesTimeGoals = null
    matchesGuesses.value[match.id].awayTeamPenaltiesTimeGoals = null
  }
}

const getPenaltiesGuessToggle = (match) =>
  showPenaltiesGuess.value[match.id]
    ? {
        variant: 'danger',
        label: i18n.t('app.guesses.cancelPenalties')
      }
    : {
        variant: 'info',
        label: i18n.t('app.guesses.guessPenalties')
      }

const currentRound = computed(() =>
  props.rounds.find((round) => {
    return route.query[round.championshipId]
      ? round.id === parseInt(route.query[round.championshipId])
      : round.current
  })
)

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
        awayTeamRegularTimeGoals: null,
        homeTeamPenaltiesTimeGoals: null,
        awayTeamPenaltiesTimeGoals: null,
        uuid: uniqueId('unregistered-guess--')
      }

      if (
        !isNil(guess.homeTeamPenaltiesTimeGoals) &&
        !isNil(guess.awayTeamPenaltiesTimeGoals)
      ) {
        showPenaltiesGuess.value[match.id] = true
      }

      return {
        ...result,
        [match.id]: {
          ...guess,
          match
        }
      }
    },
    {},
    matches.data
  )
)

const hasMatches = computed(() => matches.data.length > 0)

const orderedMatches = computed(() => {
  return orderBy(
    (match) =>
      match.status === MATCH_STATUSES.SCHEDULED ? match.status : match.date,
    'desc',
    matches.data
  )
})

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

      const action = isEmpty(route.query) ? 'replace' : 'push'

      router[action]({
        ...route,
        query: {
          ...route.query,
          [value.championshipId]: value.id
        }
      })
      guesses.loading = false
    }
  },
  { immediate: true }
)

const handlePreviousRound = () => selectedRoundIndex.value--

const handleNextRound = () => selectedRoundIndex.value++

// Guess
const getGuessHomeTeamScoreClass = (match) => [
  getGuessHomeTeamRegularTimeScoreClass(match),
  getGuessHomeTeamPenaltiesTimeScoreClass(match)
]

const getGuessHomeTeamRegularTimeScoreClass = (match) => {
  const guess = matchesGuesses.value[match.id]

  return (
    guess.homeTeamRegularTimeGoals > guess.awayTeamRegularTimeGoals &&
    'text-bold'
  )
}

const getGuessHomeTeamPenaltiesTimeScoreClass = (match) => {
  const guess = matchesGuesses.value[match.id]

  return (
    guess.homeTeamPenaltiesTimeGoals > guess.awayTeamPenaltiesTimeGoals &&
    'text-bold'
  )
}

const getGuessAwayTeamScoreClass = (match) => [
  getGuessAwayTeamRegularTimeScoreClass(match),
  getGuessAwayTeamPenaltiesTimeScoreClass(match)
]

const getGuessAwayTeamRegularTimeScoreClass = (match) => {
  const guess = matchesGuesses.value[match.id]

  return (
    guess.awayTeamRegularTimeGoals > guess.homeTeamRegularTimeGoals &&
    'text-bold'
  )
}

const getGuessAwayTeamPenaltiesTimeScoreClass = (match) => {
  const guess = matchesGuesses.value[match.id]

  return (
    guess.awayTeamPenaltiesTimeGoals > guess.homeTeamPenaltiesTimeGoals &&
    'text-bold'
  )
}

const handleUpdateRegularTimeGoals = (team, matchId, value) => {
  const parsedValue = parseInt(value || 0)
  const guess = guesses.data.find((guess) => guess.matchId === matchId)

  if (guess) {
    guesses.data = [
      ...guesses.data.filter((guess) => guess.matchId !== matchId),
      {
        ...guess,
        [`${team}RegularTimeGoals`]: parsedValue
      }
    ]
  } else {
    guesses.data = [
      ...guesses.data,
      {
        matchId,
        [`${team}RegularTimeGoals`]: parsedValue
      }
    ]
  }

  emits('update:modelValue', matchesGuesses.value)

  if (
    !isNil(matchesGuesses.value[matchId].homeTeamRegularTimeGoals) &&
    !isNil(matchesGuesses.value[matchId].awayTeamRegularTimeGoals) &&
    matchesGuesses.value[matchId].homeTeamRegularTimeGoals !==
      matchesGuesses.value[matchId].awayTeamRegularTimeGoals
  ) {
    handleUpdatePenaltiesTimeGoals('homeTeam', matchId, null)
    handleUpdatePenaltiesTimeGoals('awayTeam', matchId, null)

    showPenaltiesGuess.value[matchId] = false
  }
}

const handleUpdatePenaltiesTimeGoals = (team, matchId, value) => {
  const parsedValue = parseInt(value || 0)
  const guess = guesses.data.find((guess) => guess.matchId === matchId)

  if (guess) {
    guesses.data = [
      ...guesses.data.filter((guess) => guess.matchId !== matchId),
      {
        ...guess,
        [`${team}PenaltiesTimeGoals`]: parsedValue
      }
    ]
  } else {
    guesses.data = [
      ...guesses.data,
      {
        matchId,
        [`${team}PenaltiesTimeGoals`]: parsedValue
      }
    ]
  }

  emits('update:modelValue', matchesGuesses.value)
}

const parseMatchGoals = (goals) => (isNil(goals) ? '-' : goals)

const openLeagueMatchGuessesDialog = (match) => {
  matchId.value = match.id
  isLeagueGuessesDialogVisible.value = true
}

const handleLeagueMatchGuessesDialogHide = () => {
  isLeagueGuessesDialogVisible.value = false
  matchId.value = null
}

const getMatchClass = (guess) => [
  !guess.id &&
    !props.memoryRegisteredGuesses.includes(guess.matchId) &&
    'rounds-matches-list-unregistered-guess'
]

// const currentMatch = ref()
// const menu = ref()

// const toggleMenu = async (event, match) => {
//   currentMatch.value = match
//   menu.value.toggle(event)
// }

// const menuItems = computed(() => [
//   {
//     label: i18n.t('app.guesses.viewOtherGuesses'),
//     command: () => openLeagueMatchGuessesDialog(currentMatch.value)
//   }
// ])

const isPenaltiesRoundType = (match) =>
  [
    CHAMPIONSHIPS_ROUND_TYPE.EXTRA_TIME,
    CHAMPIONSHIPS_ROUND_TYPE.PENALTIES
  ].includes(match.round.type)

const allowPenaltiesGuess = (match) =>
  isMatchScheduled(match) &&
  isPenaltiesRoundType(match) &&
  !isNil(matchesGuesses.value[match.id].homeTeamRegularTimeGoals) &&
  !isNil(matchesGuesses.value[match.id].awayTeamRegularTimeGoals) &&
  matchesGuesses.value[match.id].homeTeamRegularTimeGoals ===
    matchesGuesses.value[match.id].awayTeamRegularTimeGoals

const showPenaltiesResult = (match) =>
  isPenaltiesRoundType(match) &&
  !isNil(match.homeTeamPenaltiesTimeGoals) &&
  !isNil(match.awayTeamPenaltiesTimeGoals)
</script>

<style lang="scss">
.rounds-matches-list {
  .p-inputnumber {
    max-width: 80px;

    &-input {
      width: 100%;
      text-align: center;
    }
  }

  .grid {
    margin-top: 0;
  }

  &__team-avatar {
    @media screen and (max-width: 960px) {
      flex: 0 0 80px;
    }

    @media screen and (min-width: 991px) {
      flex: 0 0 250px;
    }
  }

  &__guess-points-badge {
    &--top {
      @media screen and (max-width: 960px) {
        display: none;
      }
    }

    &--bottom {
      display: none;

      @media screen and (max-width: 960px) {
        display: flex;
        justify-content: center;
      }
    }
  }

  &-unregistered-guess {
    background: #fff9e5;
  }

  &__mobile-menu-button {
    right: 30px;

    &:hover {
      background: transparent !important;
    }
  }
}
</style>
