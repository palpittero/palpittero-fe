<script setup lang="ts">
import type { iChampionshipRound } from '@/types'
import { computed } from 'vue'

const props = defineProps<{
  selectedRound: iChampionshipRound
  selectedRoundIndex: number
  totalRounds: number
  totalMatches: number
}>()

const emits = defineEmits<{
  'previous-round': []
  'next-round': []
}>()

const handlePreviousRound = () => {
  if (!isCurrentFirstRound.value) {
    emits('previous-round')
  }
}

const handleNextRound = () => {
  if (!isCurrentLastRound.value) {
    emits('next-round')
  }
}

const isCurrentFirstRound = computed<boolean>(() => props.selectedRoundIndex === 0)
const isCurrentLastRound = computed<boolean>(
  () => props.selectedRoundIndex === props.totalRounds - 1,
)
</script>

<template>
  <div class="flex items-center justify-between py-3 bg-base-200/50 px-4 rounded-box">
    <button
      class="btn btn-ghost btn-sm"
      :disabled="isCurrentFirstRound"
      @click="handlePreviousRound"
    >
      <i class="fa-solid fa-angle-left" />
    </button>

    <div class="text-center">
      <div class="font-bold text-sm lg:text-lg">{{ selectedRound?.name }}</div>
      <div class="text-xs lg:text-sm text-base-content/60">
        <template v-if="totalMatches > 0">
          {{ totalMatches }} {{ totalMatches === 1 ? 'jogo' : 'jogos' }}
        </template>
        <template v-else> Nenhum jogo </template>
      </div>
    </div>

    <button class="btn btn-ghost btn-sm" :disabled="isCurrentLastRound" @click="handleNextRound">
      <i class="fa-solid fa-angle-right" />
    </button>
  </div>
</template>
