<template>
  <BaseDataTable :items="{ data: guesses }">
    <Column field="user.name" :header="$t('common.player')">
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
        <MatchScore :match="parseMatchGuess(data)" />
      </template>
    </Column>
  </BaseDataTable>
</template>

<script setup>
import BaseDataTable from '@/components/Shared/BaseDataTable/BaseDataTable.vue'
import MatchScore from '@/components/Shared/Matches/MatchScore/MatchScore.vue'

defineProps({
  guesses: {
    type: Array,
    default: () => []
  }
})

const parseMatchGuess = (guess) => ({
  ...guess.match,
  regularTimeHomeTeamGoals: guess.homeTeamRegularTimeGoals,
  regularTimeAwayTeamGoals: guess.awayTeamRegularTimeGoals
})
</script>
