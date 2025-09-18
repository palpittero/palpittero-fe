<script setup lang="ts">
import BaseImage from '@/components/Shared/BaseImage.vue'
import type { iGuess, iMatch } from '@/types'

defineProps<{
  guess: iGuess
  match: iMatch | null
  leagueId: number
}>()
</script>

<template>
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body p-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <BaseImage :src="guess.user.avatar" :alt="guess.user.name" class="size-8 rounded-lg" />
          <div>
            <div class="font-medium">{{ guess.user?.name }}</div>
            <div v-if="guess.points !== null" class="text-xs text-base-content/60">
              {{ guess.points }} pontos
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-start gap-2">
            <BaseImage
              :src="match?.homeTeam?.badge"
              :alt="match?.homeTeam?.name"
              class="size-4 rounded-sm mt-0.5"
            />
            <div class="text-center">
              <div class="text-sm text-base-content/60 flex items-center gap-2">
                {{ match?.homeTeam?.name }}
              </div>
              <div class="font-bold text-lg">
                {{ guess.homeTeamRegularTimeGoals ?? '-' }}
              </div>
            </div>
            <span class="text-sm">×</span>
            <div class="text-center">
              <div class="text-sm text-base-content/60">
                {{ match?.awayTeam?.name }}
              </div>
              <div class="font-bold text-lg">
                {{ guess.awayTeamRegularTimeGoals ?? '-' }}
              </div>
            </div>
            <BaseImage
              :src="match?.awayTeam?.badge"
              :alt="match?.awayTeam?.name"
              class="size-4 rounded-sm mt-0.5"
            />
          </div>

          <div
            v-if="
              guess.homeTeamPenaltiesTimeGoals !== null || guess.awayTeamPenaltiesTimeGoals !== null
            "
            class="flex items-center gap-2 text-sm border-l border-base-300 pl-4"
          >
            <div class="text-center">
              <div class="text-xs text-base-content/60">PEN</div>
              <div class="font-medium">
                {{ guess.homeTeamPenaltiesTimeGoals ?? '-' }}
              </div>
            </div>
            <span class="text-xs">×</span>
            <div class="text-center">
              <div class="text-xs text-base-content/60">PEN</div>
              <div class="font-medium">
                {{ guess.awayTeamPenaltiesTimeGoals ?? '-' }}
              </div>
            </div>
          </div>

          <!-- Points badge -->
          <div v-if="guess.points !== null && guess.points > 0" class="badge badge-success gap-1">
            <i class="fa-solid fa-star text-xs" />
            {{ guess.points }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
