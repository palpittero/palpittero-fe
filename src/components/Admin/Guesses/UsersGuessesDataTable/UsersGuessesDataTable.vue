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
          <MatchCard
            class="hidden md:block"
            :match="parseMatchGuess(data)"
            variant=""
          />

          <div class="flex md:hidden flex-column align-items-end gap-2">
            <small v-if="data.match.group" class="text-bold">
              {{ data.match.group.name }}
            </small>
            <small>
              {{ data.match.round.name }}
            </small>
            <MatchScore :match="parseMatchGuess(data)" />
          </div>
        </template>
      </Column>
    </BaseDataTable>
  </div>
</template>

<script setup>
import BaseDataTable from '@/components/Shared/BaseDataTable/BaseDataTable.vue'
import MatchCard from '@/components/Shared/Matches/MatchCard/MatchCard.vue'
import MatchScore from '@/components/Shared/Matches/MatchScore/MatchScore.vue'
// import MatchCenterScore from '@/components/Shared/Matches/MatchCenterScore/MatchCenterScore.vue'
// import MatchStatusBadge from '@/components/App/Championships/ChampionshipsRoundsMatchesList/RoundsMatchesList/MatchStatusBadge/MatchStatusBadge.vue'

defineProps({
  guesses: {
    type: Array,
    default: () => []
  }
})

const parseMatchGuess = (guess) => ({
  ...guess.match,
  regularTimeHomeTeamGoals: guess.homeTeamRegularTimeGoals,
  regularTimeAwayTeamGoals: guess.awayTeamRegularTimeGoals,
  penaltiesTimeHomeTeamGoals: guess.homeTeamPenaltiesTimeGoals,
  penaltiesTimeAwayTeamGoals: guess.awayTeamPenaltiesTimeGoals
})
</script>

<style lang="scss">
.users-guesses-data-table {
  .match-card {
    &.p-card {
      box-shadow: none;

      .p-card-body {
        padding: 0 !important;
      }
    }
  }
}
</style>
