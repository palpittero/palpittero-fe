<template>
  <div class="users-guesses-data-table">
    <BaseDataTable :items="{ data: guesses }">
      <Column field="user.name" :header="$t('common.player')">
        <template #body="{ data }">
          {{ data.user.name }}
        </template>
      </Column>
      <Column field="guess" :header="$t('common.guess')" headerClass="flex">
        <template #body="{ data }">
          <div v-if="data.match">
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
          </div>
          <div v-else>
            <div class="field">
              <label class="text-bold">
                {{ positionLabels[data.position] }}
              </label>
              <div class="flex align-items-center gap-3">
                <BadgeAvatar :image="data.team.badge" />

                {{ data.team.name }}
              </div>
            </div>
          </div>
        </template>
      </Column>
    </BaseDataTable>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

import BadgeAvatar from '@/components/Shared/BadgeAvatar/BadgeAvatar.vue'
import BaseDataTable from '@/components/Shared/BaseDataTable/BaseDataTable.vue'
import MatchCard from '@/components/Shared/Matches/MatchCard/MatchCard.vue'
import MatchScore from '@/components/Shared/Matches/MatchScore/MatchScore.vue'

const i18n = useI18n()

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

const positionLabels = {
  1: i18n.t('admin.championships.champion'),
  2: i18n.t('admin.championships.runnerUp')
}
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
