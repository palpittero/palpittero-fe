<script setup lang="ts">
import type { iGuessLeague, iState, iUnprocessedGuess } from '@/types'
import LeagueVisibility from '@/components/Admin/Leagues/LeagueVisibility.vue'
import { uniqBy } from 'lodash/fp'
import { computed } from 'vue'
import BaseImage from '../BaseImage.vue'

const props = defineProps<{
  unprocessedGuesses: iState<iUnprocessedGuess | null>
}>()

const emit = defineEmits<{
  'view-guesses': [leagueId: number]
  'process-guesses': [league: iGuessLeague]
}>()

const parseGuessesLeagues = (
  unprocessedGuesses: iUnprocessedGuess['matchesGuesses'] &
    iUnprocessedGuess['championshipsGuesses'][],
): iGuessLeague[] =>
  uniqBy(
    'id',
    unprocessedGuesses.map(({ league }) => league),
  )

const guessesLeagues = computed<iGuessLeague[]>(() => {
  // @ts-ignore
  const { matchesGuesses, championshipsGuesses } = props.unprocessedGuesses.data
  return parseGuessesLeagues([...matchesGuesses, ...championshipsGuesses])
})

const handleViewGuesses = (league: iGuessLeague) => {
  emit('view-guesses', league.id!)
}

const handleProcessGuesses = (league: iGuessLeague) => {
  emit('process-guesses', league)
}
</script>

<template>
  <div v-if="unprocessedGuesses.loading">
    <div class="loading loading-ring loading-xl" />
    Carregando...
  </div>
  <ul v-else-if="guessesLeagues.length" class="list bg-base-100 rounded-box shadow-md w-full">
    <li
      class="list-row cursor-pointer hover:bg-base-200"
      v-for="league in guessesLeagues"
      :key="league.id"
    >
      <div class="flex gap-4 items-center list-col-grow" @click="handleViewGuesses(league)">
        <div>
          <BaseImage :src="league.badge!" class="size-10" />
        </div>
        <div>
          <div>{{ league.name }}</div>
          <div class="text-xs uppercase font-semibold opacity-60">
            <LeagueVisibility :private="league.private!" />
          </div>
        </div>
      </div>
      <div class="flex gap-1">
        <button class="btn btn-ghost hidden lg:block" @click="handleProcessGuesses(league)">
          <i class="fa-solid fa-bolt" />
          Processar Palpites
        </button>
        <details class="dropdown dropdown-end">
          <summary class="btn btn-ghost"><i class="fa-solid fa-ellipsis-vertical" /></summary>
          <ul class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <a class="block lg:hidden" @click="handleProcessGuesses(league)">
                <i class="fa-solid fa-bolt" /> Processar Palpites
              </a>
            </li>
          </ul>
        </details>
      </div>
    </li>
  </ul>

  <div v-else class="alert alert-soft">
    <span> <i class="fa-solid fa-check" /> Todos os palpites já foram processados </span>
  </div>
</template>
