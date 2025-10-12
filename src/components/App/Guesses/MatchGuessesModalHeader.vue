<script setup lang="ts">
import type { iMatch } from '@/types'
import BaseImage from '@/components/Shared/BaseImage.vue'
import FormattedDate from '@/components/Shared/FormattedDate.vue'
import MatchStatus from '@/components/Admin/Matches/MatchStatus.vue'

defineProps<{
  match: iMatch | null
}>()
</script>

<template>
  <div class="card bg-base-200/50 shadow-sm">
    <div class="card-body flex flex-col gap-2">
      <div class="text-center" v-if="match?.group">
        <div class="badge badge-sm badge-outline">
          {{ match?.group?.name }}
        </div>
      </div>
      <div class="flex items-center justify-center gap-2">
        <div class="flex items-center gap-2">
          <BaseImage
            :src="match?.homeTeam?.badge"
            :alt="match?.homeTeam?.name"
            class="size-10 rounded-lg"
          />
          <span class="font-medium text-lg">{{ match?.homeTeam?.name }}</span>
        </div>
        <div>
          <i class="fa-solid fa-xmark font-bold" />
        </div>
        <div class="flex items-center gap-2">
          <span class="font-medium text-lg">{{ match?.awayTeam?.name }}</span>
          <BaseImage
            :src="match?.awayTeam?.badge"
            :alt="match?.awayTeam?.name"
            class="size-10 rounded-lg"
          />
        </div>
      </div>
      <div>
        <div class="flex flex-col items-center gap-2">
          <div class="text-sm text-center text-base-content/60">
            {{ match?.round?.championship.name }} {{ match?.round?.championship.year }}
          </div>
          <div class="flex flex-col gap-1 items-center">
            <FormattedDate :date="match?.date!" class="text-xs text-center text-base-content/60" />
            <MatchStatus :status="match?.status!" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
