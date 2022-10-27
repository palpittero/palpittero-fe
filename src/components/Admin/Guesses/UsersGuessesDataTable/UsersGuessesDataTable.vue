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
    <!-- <Column field="homeTeam" :header="$t('common.points', 2)">
      <template #body="{ data }">
        <GuessPointsBadge :points="data.points" />
      </template>
    </Column> -->
  </BaseDataTable>
</template>

<script setup>
import BaseDataTable from '@/components/Shared/BaseDataTable/BaseDataTable.vue'
import MatchScore from '@/components/Shared/Matches/MatchScore/MatchScore.vue'
// import GuessPointsBadge from '@/components/App/Championships/ChampionshipsRoundsMatchesList/RoundsMatchesList/GuessPointsBadge/GuessPointsBadge.vue'

defineProps({
  // match: {
  //   type: Object,
  //   required: true
  // },
  guesses: {
    type: Array,
    default: () => []
  }
})

const parseMatchGuess = (guess) => {
  // console.log(props.match)
  return {
    ...guess.match,
    regularTimeHomeTeamGoals: guess.homeTeamRegularTimeGoals,
    regularTimeAwayTeamGoals: guess.awayTeamRegularTimeGoals
  }
}
</script>
