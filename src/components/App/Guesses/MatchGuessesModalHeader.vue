<script setup lang="ts">
import type { iMatch } from '@/types'
import BaseImage from '@/components/Shared/BaseImage.vue'
import FormattedDate from '@/components/Shared/FormattedDate.vue'

defineProps<{
  match: iMatch | null
}>()
</script>

<template>
  <div class="card bg-base-200/50 shadow-sm">
    <div class="card-body">
      <div class="text-center" v-if="match?.group">
        <div class="badge badge-sm badge-outline">{{ match?.group?.name }}</div>
      </div>
      <div class="flex items-center justify-center gap-4">
        <div class="flex items-center gap-3">
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
        <div class="flex items-center gap-3">
          <span class="font-medium text-lg">{{ match?.awayTeam?.name }}</span>
          <BaseImage
            :src="match?.awayTeam?.badge"
            :alt="match?.awayTeam?.name"
            class="size-10 rounded-lg"
          />
        </div>
      </div>
      <div class="text-xs text-center text-base-content/60">
        {{ match?.round?.championship.name }} {{ match?.round?.championship.year }}
      </div>

      <div class="text-xs text-center text-base-content/60">
        <FormattedDate :date="match?.date!" />
      </div>
    </div>
  </div>
</template>
