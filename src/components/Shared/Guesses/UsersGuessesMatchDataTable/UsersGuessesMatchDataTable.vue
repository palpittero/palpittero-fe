<template>
  <BaseDataTable
    v-if="hasFilteredGuesses"
    :items="{ data: filteredGuesses }"
    :searchable="false"
    :paginator="false"
    :title="$t('common.guesses')"
  >
    <Column field="user" :header="$t('common.player')">
      <template #body="{ data }">
        {{ data.user.name }}
      </template>
    </Column>
    <Column
      field="guess"
      :header="$t('common.guess')"
      headerClass="flex justify-content-center"
    >
      <template #body="{ data }">
        <MatchCenterScore :match="parseMatchGuess(data)" />
      </template>
    </Column>
    <Column field="homeTeam" :header="$t('common.points', 2)">
      <template #body="{ data }">
        <GuessPointsBadge :guess="data" />
      </template>
    </Column>
  </BaseDataTable>
  <div
    v-else
    class="text-center p-5 mt-2 font-medium text-2xl text-gray-500 mb-3 text-center"
  >
    {{ $t('app.guesses.noGuesses') }}
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

import BaseDataTable from '@/components/Shared/BaseDataTable/BaseDataTable.vue'
import MatchCenterScore from '@/components/Shared/Matches/MatchCenterScore/MatchCenterScore.vue'
import GuessPointsBadge from '@/components/App/Championships/ChampionshipsRoundsMatchesList/RoundsMatchesList/GuessPointsBadge/GuessPointsBadge.vue'

const authStore = useAuthStore()

const props = defineProps({
  match: {
    type: Object,
    required: true
  },
  guesses: {
    type: Array,
    default: () => []
  }
})

const parseMatchGuess = (guess) => {
  return {
    ...props.match,
    regularTimeHomeTeamGoals: guess.homeTeamRegularTimeGoals,
    regularTimeAwayTeamGoals: guess.awayTeamRegularTimeGoals,
    penaltiesTimeHomeTeamGoals: guess.homeTeamPenaltiesTimeGoals,
    penaltiesTimeAwayTeamGoals: guess.awayTeamPenaltiesTimeGoals
  }
}

const filteredGuesses = computed(() =>
  props.guesses.filter(({ userId }) => userId !== authStore.loggedUser?.id)
)
const hasFilteredGuesses = computed(() => props.guesses.length > 0)
</script>
