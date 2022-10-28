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
          v-for="match in matches.data"
          :key="match.id"
          class="border-top-1 surface-border"
        >
          <div class="flex flex-column align-items-center">
            <div
              class="py-3 flex flex-column md:flex-row justify-content-center align-items-center gap-2"
            >
              <em>{{ $d(new Date(match.date), 'long', 'pt-BR') }}</em>
              <MatchStatusBadge :status="match.status" />
              <div
                class="rounds-matches-list__guess-points-badge rounds-matches-list__guess-points-badge--top"
                v-if="isMatchFinished(match)"
              >
                <GuessPointsBadge :guess="matchesGuesses[match.id]" />
                <Button
                  @click="goToUserMatchGuessRoute(match)"
                  v-tooltip.top="$t('app.guesses.viewOtherGuesses')"
                  class="p-button-link p-button-clear p-button-small"
                  icon="pi pi-search"
                />
              </div>
            </div>
          </div>
          <div class="py-3 px-2 grid align-items-center">
            <div class="col">
              <div class="grid align-items-center justify-content-end">
                <div
                  class="col-6 flex gap-2 justify-content-end align-items-center flex-column-reverse md:flex-row"
                >
                  <span
                    :class="getHomeTeamTeamScoreClass(matchesGuesses[match.id])"
                  >
                    {{ match.homeTeam.name }}
                  </span>
                  <BadgeAvatar :image="match.homeTeam.badge" />
                </div>
                <InputNumber
                  v-if="isMatchScheduled(match)"
                  :model-value="
                    matchesGuesses[match.id].homeTeamRegularTimeGoals
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
                  class="px-3 gap-2 flex font-large"
                  :class="getHomeTeamTeamScoreClass(matchesGuesses[match.id])"
                >
                  <span>
                    {{
                      parseMatchGoals(
                        matchesGuesses[match.id].homeTeamRegularTimeGoals
                      )
                    }}
                  </span>
                </span>
              </div>
            </div>
            <div class="col-1 text-center width-auto">
              <span class="pi pi-times font-small" />
            </div>
            <div class="col">
              <div class="grid align-items-center">
                <InputNumber
                  v-if="isMatchScheduled(match)"
                  :step="1"
                  class="col-6"
                  :model-value="
                    matchesGuesses[match.id].awayTeamRegularTimeGoals
                  "
                  :class="{ 'p-invalid': submitted && errors.year }"
                  @input="
                    ({ value }) =>
                      handleUpdateRegularTimeGoals('awayTeam', match.id, value)
                  "
                />
                <span
                  v-else
                  class="px-3 gap-2 flex font-large"
                  :class="getAwayTeamTeamScoreClass(matchesGuesses[match.id])"
                >
                  <span>
                    {{
                      parseMatchGoals(
                        matchesGuesses[match.id].awayTeamRegularTimeGoals
                      )
                    }}
                  </span>
                </span>
                <div
                  class="col-6 flex align-items-center justify-content-start gap-2 flex-column md:flex-row"
                >
                  <BadgeAvatar :image="match.awayTeam.badge" />
                  <span
                    :class="getAwayTeamTeamScoreClass(matchesGuesses[match.id])"
                  >
                    {{ match.awayTeam.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <RoundMatchFinalResult
            v-if="isMatchFinished(match)"
            :guess="matchesGuesses[match.id]"
            :home-team-class-name="
              getHomeTeamTeamScoreClass(matchesGuesses[match.id])
            "
            :away-team-class-name="
              getAwayTeamTeamScoreClass(matchesGuesses[match.id])
            "
          />

          <MatchNoResult v-if="matchHasNoResult(match)" align="center" />
          <div
            class="rounds-matches-list__guess-points-badge rounds-matches-list__guess-points-badge--bottom"
            v-if="isMatchFinished(match)"
          >
            <GuessPointsBadge :guess="matchesGuesses[match.id]" />
            <Button
              @click="goToUserMatchGuessRoute(match)"
              v-tooltip.top="$t('app.guesses.viewOtherGuesses')"
              class="p-button-link p-button-clear p-button-small"
              icon="pi pi-search"
            />
          </div>
        </li>
      </template>
      <div v-else class="text-center">
        {{ $t('app.guesses.noMatches') }}
      </div>
    </ul>
  </div>
</template>

<script setup>
import services from '@/services'
import { reduce, isNil, isEmpty } from 'lodash/fp'
import { computed, reactive, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MatchStatusBadge from './MatchStatusBadge/MatchStatusBadge.vue'
import GuessPointsBadge from './GuessPointsBadge/GuessPointsBadge.vue'
import RoundMatchFinalResult from './RoundMatchFinalResult/RoundMatchFinalResult.vue'
import MatchNoResult from '@/components/Shared/Matches/MatchNoResult.vue'
import BadgeAvatar from '@/components/Shared/BadgeAvatar/BadgeAvatar.vue'
import {
  isMatchScheduled,
  isMatchFinished,
  matchHasNoResult
} from '@/helpers/matches'

import { MATCH_RESULTS } from '@/constants/matches'

const router = useRouter()
const route = useRoute()

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
        awayTeamRegularTimeGoals: null
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

const parseMatchGoals = (goals) => (isNil(goals) ? '-' : goals)

const goToUserMatchGuessRoute = (match) => {
  console.log(matchesGuesses.value[match.id])
  router.push({
    name: 'UserMatchGuesses',
    params: {
      leagueId: props.leagueId,
      matchId: match.id
    }
  })
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

  &__guess-points-badge {
    display: flex;
    gap: 5px;
    align-items: center;
    right: 60px;

    &--top {
      position: absolute;

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

    // @media screen and (max-width: 960px) {
    //   display: none;
    // }
  }
}
</style>
