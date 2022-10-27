<template>
  <BaseDataTable
    :items="guesses"
    :searchable="false"
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
        <MatchScore :match="parseMatchGuess(data)" />
      </template>
    </Column>
    <Column field="homeTeam" :header="$t('common.points', 2)">
      <template #body="{ data }">
        <GuessPointsBadge :points="data.points" />
      </template>
    </Column>
  </BaseDataTable>
</template>

<script setup>
import BaseDataTable from '@/components/Shared/BaseDataTable/BaseDataTable.vue'
import MatchScore from '@/components/Shared/Matches/MatchScore/MatchScore.vue'
import GuessPointsBadge from '@/components/App/Championships/ChampionshipsRoundsMatchesList/RoundsMatchesList/GuessPointsBadge/GuessPointsBadge.vue'

const props = defineProps({
  match: {
    type: Object,
    required: true
  },
  guesses: {
    type: Object,
    required: true
  }
})

const parseMatchGuess = (guess) => {
  console.log(props.match)
  return {
    ...props.match,
    regularTimeHomeTeamGoals: guess.homeTeamRegularTimeGoals,
    regularTimeAwayTeamGoals: guess.awayTeamRegularTimeGoals
  }
}
</script>
