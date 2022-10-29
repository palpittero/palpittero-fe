<template>
  <div class="users-guesses-data-table">
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
          <MatchCenterScore :match="parseMatchGuess(data)" />
        </template>
      </Column>
    </BaseDataTable>
  </div>
</template>

<script setup>
import BaseDataTable from '@/components/Shared/BaseDataTable/BaseDataTable.vue'
import MatchScore from '@/components/Shared/Matches/MatchScore/MatchScore.vue'
import MatchCenterScore from '@/components/Shared/Matches/MatchCenterScore/MatchCenterScore.vue'

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

<style lang="scss">
.users-guesses-data-table {
  .match-score {
    display: none !important;

    @media screen and (max-width: 960px) {
      display: flex !important;
    }
  }

  .match-center-score {
    display: none !important;

    @media screen and (min-width: 960px) {
      display: flex !important;
    }
  }
}
</style>
