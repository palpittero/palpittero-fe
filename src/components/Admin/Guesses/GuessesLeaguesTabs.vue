<script setup lang="ts">
import type { iChampionship } from '@/types'
import { computed } from 'vue'
import { parseChampionshipsGuesses, parseMatchesGuesses } from '@/helpers/guesses'
import GuessesLeaguesMatchesTab from './GuessesLeaguesMatchesTab.vue'
import GuessesLeaguesRankingTab from './GuessesLeaguesRankingTab.vue'

const props = defineProps<{
  guesses: any
}>()

const emit = defineEmits<{
  'process-guesses': [championship: any]
}>()

const championships = computed<iChampionship[]>(() =>
  parseMatchesGuesses(props.guesses.matchesGuesses || []),
)

const guessesChampionships = computed(() =>
  parseChampionshipsGuesses(props.guesses.championshipsGuesses || []),
)

const handleProcessGuesses = (championship: any) => {
  emit('process-guesses', championship)
}
</script>

<template>
  <div class="tabs tabs-lift">
    <GuessesLeaguesMatchesTab
      :championships="championships"
      @process-guesses="handleProcessGuesses"
    />

    <GuessesLeaguesRankingTab
      :championships="guessesChampionships"
      @process-guesses="handleProcessGuesses"
    />
  </div>
</template>
