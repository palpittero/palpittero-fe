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
      <span class="text-bold">{{ selectedRound.name }}</span>
      <Button
        class="p-button-text p-button-plain"
        :disabled="isCurrentLastRound"
        @click="handleNextRound"
      >
        <span class="pi pi-angle-right" />
      </Button>
    </div>
    <ul class="list-none p-0 m-0">
      <template v-if="hasMatches">
        <li
          v-for="match in orderedMatches"
          :key="match.id"
          class="flex flex-column gap-3 border-top-1 surface-border p-3"
          :class="getMatchClass(matchesGuesses[match.id])"
        >
          <div
            class="flex flex-column md:flex-row align-items-start justify-content-between"
          >
            <!-- Group name -->
            <div class="w-full text-bold text-center md:text-left">
              {{ match.group?.name }}
              <!-- <Button
                type="button"
                class="absolute md:hidden p-button-text p-0 rounds-matches-list__mobile-menu-button"
                icon="pi pi-ellipsis-v"
                @click="(event) => toggleMenu(event, match)"
                aria-haspopup="true"
                aria-controls="overlay_menu"
              /> -->
            </div>
            <!-- Match status -->
            <div
              class="flex flex-column md:flex-row justify-content-center align-items-center w-full gap-2"
            >
              <div class="flex flex-column align-items-center gap-2">
                <em>{{ $d(new Date(match.date), 'long', 'pt-BR') }}</em>
                <MatchStatusBadge :status="match.status" />
              </div>
            </div>
            <!-- Guess status / view other badges -->
            <div
              class="w-full gap-2 hidden md:flex flex-column align-items-end md:justify-content-end"
            >
              <GuessPointsBadge
                v-if="isMatchFinished(match)"
                :guess="matchesGuesses[match.id]"
              />
              <Button
                @click="openLeagueMatchGuessesDialog(match)"
                :label="$t('app.guesses.viewOtherGuesses')"
                class="p-button-link p-button-clear p-button-sm p-0"
                icon="pi pi-search"
              />
            </div>
          </div>
          <div>
            <div class="grid align-items-center">
              <div class="col">
                <div class="grid align-items-center justify-content-end">
                  <!-- Home team name and badge -->
                  <div
                    class="col-6 flex gap-2 justify-content-end align-items-center flex-column-reverse md:flex-row"
                  >
                    <span
                      :class="[
                        ...getGuessHomeTeamRegularTimeScoreClass(
                          matchesGuesses[match.id]
                        ),
                        ...getGuessHomeTeamPenaltiesTimeScoreClass(
                          matchesGuesses[match.id]
                        )
                      ]"
                      class="text-center"
                    >
                      {{ match.homeTeam.name }}
                    </span>
                    <BadgeAvatar :image="match.homeTeam.badge" />
                  </div>
                  <!-- Home team regular time input -->
                  <template v-if="isMatchScheduled(match)">
                    <span
                      class="col-6 p-component p-inputnumber p-inputwrapper"
                    >
                      <input
                        type="number"
                        :value="
                          matchesGuesses[match.id].homeTeamRegularTimeGoals
                        "
                        :min="0"
                        class="p-inputtext p-component p-inputnumber-input"
                        @input="
                          (event) =>
                            handleUpdateRegularTimeGoals(
                              'homeTeam',
                              match.id,
                              event.target.value
                            )
                        "
                      />
                    </span>
                  </template>
                  <!-- Home team goals -->
                  <span v-else>
                    <span class="flex gap-3 px-2 font-large">
                      <!-- Home team regular time goals -->
                      <span
                        :class="
                          getGuessHomeTeamRegularTimeScoreClass(
                            matchesGuesses[match.id]
                          )
                        "
                      >
                        {{
                          parseMatchGoals(
                            matchesGuesses[match.id].homeTeamRegularTimeGoals
                          )
                        }}
                      </span>
                      <!-- Home team penalties time goals -->
                      <span
                        v-if="
                          isPenaltiesRoundType(match) &&
                          matchesGuesses[match.id]
                            .homeTeamPenaltiesTimeGoals !== null
                        "
                        :class="
                          getGuessHomeTeamPenaltiesTimeScoreClass(
                            matchesGuesses[match.id]
                          )
                        "
                      >
                        ({{
                          parseMatchGoals(
                            matchesGuesses[match.id].homeTeamPenaltiesTimeGoals
                          )
                        }})
                      </span>
                    </span>
                  </span>
                </div>
              </div>
              <span class="col-1 text-center width-auto">x</span>
              <div class="col">
                <div class="grid align-items-center">
                  <!-- Away team regular time input -->
                  <template v-if="isMatchScheduled(match)">
                    <span
                      class="col-6 p-component p-inputnumber p-inputwrapper"
                    >
                      <input
                        type="number"
                        :value="
                          matchesGuesses[match.id].awayTeamRegularTimeGoals
                        "
                        :step="1"
                        :min="0"
                        class="p-inputtext p-component p-inputnumber-input text-center"
                        @input="
                          (event) =>
                            handleUpdateRegularTimeGoals(
                              'awayTeam',
                              match.id,
                              event.target.value
                            )
                        "
                      />
                    </span>
                  </template>
                  <!-- Away team goals -->
                  <span v-else class="gap-3 px-2 flex font-large">
                    <!-- Away team penalties time goals -->
                    <span
                      v-if="
                        isPenaltiesRoundType(match) &&
                        matchesGuesses[match.id].awayTeamPenaltiesTimeGoals !==
                          null
                      "
                      :class="
                        getGuessAwayTeamPenaltiesTimeScoreClass(
                          matchesGuesses[match.id]
                        )
                      "
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
                    <span
                      :class="
                        getGuessAwayTeamRegularTimeScoreClass(
                          matchesGuesses[match.id]
                        )
                      "
                    >
                      <span>
                        {{
                          parseMatchGoals(
                            matchesGuesses[match.id].awayTeamRegularTimeGoals
                          )
                        }}
                      </span>
                    </span>
                  </span>
                  <div
                    class="col-6 flex align-items-center justify-content-start gap-2 flex-column md:flex-row"
                  >
                    <BadgeAvatar :image="match.awayTeam.badge" />
                    <span
                      class="text-center"
                      :class="
                        getGuessAwayTeamRegularTimeScoreClass(
                          matchesGuesses[match.id]
                        )
                      "
                    >
                      {{ match.awayTeam.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-right" v-if="allowPenaltiesGuess(match)">
              <Button
                class="p-button-text p-button-sm"
                @click="handleShowPenaltiesToggle(match)"
              >
                {{ getPenaltiesGuessToggleLabel(match) }}
              </Button>
            </div>
            <template
              v-if="showPenaltiesGuess[match.id] && allowPenaltiesGuess(match)"
            >
              <div class="text-center">
                <small> {{ $t('app.guesses.penalties') }} </small>
              </div>
              <div class="grid align-items-center">
                <div class="col">
                  <div class="grid align-items-center justify-content-end">
                    <template v-if="isMatchScheduled(match)">
                      <span
                        class="col-6 p-component p-inputnumber p-inputwrapper"
                      >
                        <input
                          type="number"
                          :value="
                            matchesGuesses[match.id].homeTeamPenaltiesTimeGoals
                          "
                          :step="1"
                          :min="0"
                          class="p-inputtext p-component p-inputnumber-input"
                          @input="
                            (event) =>
                              handleUpdatePenaltiesTimeGoals(
                                'homeTeam',
                                match.id,
                                event.target.value
                              )
                          "
                        />
                      </span>
                    </template>
                    <!-- <span
                      v-else
                      class="px-3 gap-2 flex font-large"
                      :class="
                        getHomeTeamRegularTimeScoreClass(
                          matchesGuesses[match.id]
                        )
                      "
                    >
                      <span>
                        {{
                          parseMatchGoals(
                            matchesGuesses[match.id].homeTeamPenaltiesTimeGoals
                          )
                        }}
                      </span>
                    </span> -->
                  </div>
                </div>
                <div class="col-1 text-center width-auto">x</div>
                <div class="col">
                  <div class="grid align-items-center">
                    <template v-if="isMatchScheduled(match)">
                      <span
                        class="col-6 p-component p-inputnumber p-inputwrapper"
                      >
                        <input
                          type="number"
                          :value="
                            matchesGuesses[match.id].awayTeamPenaltiesTimeGoals
                          "
                          :step="1"
                          :min="0"
                          class="p-inputtext p-component p-inputnumber-input"
                          @input="
                            (event) =>
                              handleUpdatePenaltiesTimeGoals(
                                'awayTeam',
                                match.id,
                                event.target.value
                              )
                          "
                        />
                      </span>

                      <!-- <InputNumber
                        :step="1"
                        class="col-6 text-center"
                        :model-value="
                          matchesGuesses[match.id].awayTeamPenaltiesTimeGoals
                        "
                        :class="{ 'p-invalid': submitted && errors.year }"
                        @input="
                          ({ value }) =>
                            handleUpdatePenaltiesTimeGoals(
                              'awayTeam',
                              match.id,
                              value
                            )
                        "
                      /> -->
                    </template>
                    <span
                      v-else
                      class="px-3 gap-2 flex font-large"
                      :class="
                        getAwayTeamRegularTimeScoreClass(
                          matchesGuesses[match.id]
                        )
                      "
                    >
                      <span>
                        {{
                          parseMatchGoals(
                            matchesGuesses[match.id].awayTeamPenaltiesTimeGoals
                          )
                        }}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <div class="flex flex-column align-items-center gap-3">
            <template v-if="isMatchFinished(match)">
              <MatchNoResult v-if="matchHasNoResult(match)" align="center" />
              <RoundMatchFinalResult
                v-else
                :guess="matchesGuesses[match.id]"
                :home-team-regular-time-class-name="
                  getMatchHomeTeamRegularTimeScoreClass(match)
                "
                :away-team-regular-time-class-name="
                  getMatchAwayTeamRegularTimeScoreClass(match)
                "
                :home-team-penalties-time-class-name="
                  getMatchHomeTeamPenaltiesTimeScoreClass(match)
                "
                :away-team-penalties-time-class-name="
                  getMatchAwayTeamPenaltiesTimeScoreClass(match)
                "
              />
              <GuessPointsBadge
                class="md:hidden"
                :guess="matchesGuesses[match.id]"
              />
            </template>
            <div
              class="w-full gap-2 flex md:hidden align-items-end justify-content-center"
            >
              <Button
                @click="openLeagueMatchGuessesDialog(match)"
                :label="$t('app.guesses.viewOtherGuesses')"
                class="p-button-link p-button-clear p-button-sm p-0"
                icon="pi pi-search"
              />
            </div>
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
import BadgeAvatar from '@/components/Shared/BadgeAvatar/BadgeAvatar.vue'
import LeagueMatchGuessesDialog from './LeagueMatchGuessesDialog/LeagueMatchGuessesDialog.vue'

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

const getPenaltiesGuessToggleLabel = (match) =>
  showPenaltiesGuess.value[match.id]
    ? i18n.t('common.cancel')
    : i18n.t('app.guesses.guessPenalties')

const currentRound = computed(() =>
  props.rounds.find((round) => {
    return route.query[round.championshipId]
      ? round.id === parseInt(route.query[round.championshipId])
      : round.current
  })
)

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

// Match
const getMatchHomeTeamRegularTimeScoreClass = (match) => [
  match.regularTimeHomeTeamGoals > match.regularTimeAwayTeamGoals && 'text-bold'
]

const getMatchAwayTeamRegularTimeScoreClass = (match) => [
  match.regularTimeAwayTeamGoals > match.regularTimeHomeTeamGoals && 'text-bold'
]
const getMatchHomeTeamPenaltiesTimeScoreClass = (match) => [
  match.penaltiesTimeHomeTeamGoals > match.penaltiesTimeAwayTeamGoals &&
    'text-bold'
]
const getMatchAwayTeamPenaltiesTimeScoreClass = (match) => [
  match.penaltiesTimeAwayTeamGoals > match.penaltiesTimeHomeTeamGoals &&
    'text-bold'
]

// Guess
const getGuessHomeTeamRegularTimeScoreClass = (guess) => [
  guess.homeTeamRegularTimeGoals > guess.awayTeamRegularTimeGoals && 'text-bold'
]

const getGuessAwayTeamRegularTimeScoreClass = (guess) => [
  guess.awayTeamRegularTimeGoals > guess.homeTeamRegularTimeGoals && 'text-bold'
]
const getGuessHomeTeamPenaltiesTimeScoreClass = (guess) => [
  guess.homeTeamPenaltiesTimeGoals > guess.awayTeamPenaltiesTimeGoals &&
    'text-bold'
]
const getGuessAwayTeamPenaltiesTimeScoreClass = (guess) => [
  guess.awayTeamPenaltiesTimeGoals > guess.homeTeamPenaltiesTimeGoals &&
    'text-bold'
]

const getAwayTeamRegularTimeScoreClass = (match) => {
  return [
    match.regularTimeAwayTeamGoals > match.regularTimeHomeTeamGoals &&
      'text-bold'
  ]
}

// const getHomeTeamPenaltiesTimeScoreClass = (match) => {
//   return [
//     match.penaltiesTimeHomeTeamGoals > match.penaltiesTimeAwayTeamGoals &&
//       'text-bold'
//   ]
// }

// const getAwayTeamPenaltiesTimeScoreClass = (match) => [
//   match.penaltiesTimeAwayTeamGoals > match.penaltiesTimeHomeTeamGoals &&
//     'text-bold'
// ]

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
    matchesGuesses.value[matchId].homeTeamRegularTimeGoals ===
      matchesGuesses.value[matchId].awayTeamRegularTimeGoals
  ) {
    matchesGuesses.value[matchId].homeTeamPenaltiesTimeGoals = null
    matchesGuesses.value[matchId].awayTeamPenaltiesTimeGoals = null
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
