<script setup lang="ts">
import type { iGuess } from '@/types'
import BaseImage from '@/components/Shared/BaseImage.vue'
import GuessPointsBadge from '../GuessPointsBadge.vue'
import { computed } from 'vue'

const props = defineProps<{
  user: any
}>()

const positionLabels: Record<string, { label: string; icon: string }> = {
  1: {
    label: 'Campeão',
    icon: '🥇',
  },
  2: {
    label: 'Vice-campeão',
    icon: '🥈',
  },
}

const points = computed<number>(
  () =>
    props.user.guesses.reduce((acc: number, guess: iGuess) => acc + Number(guess.points ?? 0), 0) ||
    0,
)
</script>

<template>
  <li class="list-row flex flex-col gap-3 rounded-box shadow-md w-1/2">
    <div class="text-xs tracking-wide font-bold flex items-center gap-2">
      <BaseImage :src="user.avatar ?? ''" class="size-5" />
      {{ user.name }}
    </div>
    <div class="flex gap-1 flex-col">
      <div class="flex items-center gap-2" v-for="guess in user.guesses" :key="guess.id">
        <div class="flex items-center gap-2 min-w-32 text-xs uppercase font-semibold opacity-70">
          {{ positionLabels[guess.position].icon }} {{ positionLabels[guess.position].label }}
        </div>

        <div class="flex items-center gap-2">
          <img v-if="guess.team.badge" :src="guess.team.badge" class="w-6 h-6 rounded-box" />
          {{ guess.team.name }}
        </div>
      </div>
      <div class="flex justify-end">
        <GuessPointsBadge
          :guess="{
            id: user.id,
            points,
          }"
        />
      </div>
    </div>
  </li>
</template>
