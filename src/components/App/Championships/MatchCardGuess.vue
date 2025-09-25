<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import type { iMatch, iMatchGuess } from '@/types'
import MatchStatus from '@/components/Admin/Matches/MatchStatus.vue'
import BaseImage from '@/components/Shared/BaseImage.vue'
import FormattedDate from '@/components/Shared/FormattedDate.vue'

const props = defineProps<{
  match: iMatch
  guess: iMatchGuess
  disabled?: boolean
  memoryRegisteredGuesses?: number[]
}>()

const emit = defineEmits<{
  'update:guess': [guess: iMatchGuess]
  'view-guesses': [match: iMatch]
}>()

const isPenaltiesRound = computed<boolean>(() =>
  ['extraTime', 'penalties'].includes(props.match.round?.type ?? ''),
)

const showPenaltiesGuess = ref<boolean>(false)

const allowPenaltiesGuess = computed<boolean>(() => {
  if (!isPenaltiesRound.value) return false

  const isRegularTimeDraw =
    parseInt(String(props.guess.homeTeamRegularTimeGoals)) ===
    parseInt(String(props.guess.awayTeamRegularTimeGoals))

  return isRegularTimeDraw
})

const hasPenaltiesGuess = computed<boolean>(
  () =>
    props.guess.homeTeamPenaltiesTimeGoals !== null ||
    props.guess.awayTeamPenaltiesTimeGoals !== null,
)

const togglePenaltiesGuess = () => {
  showPenaltiesGuess.value = !showPenaltiesGuess.value

  emit('update:guess', {
    ...props.guess,
    homeTeamPenaltiesTimeGoals: showPenaltiesGuess.value ? 0 : null,
    awayTeamPenaltiesTimeGoals: showPenaltiesGuess.value ? 0 : null,
  })
}

onMounted(() => {
  showPenaltiesGuess.value = isPenaltiesRound.value && hasPenaltiesGuess.value
})

const regularTimeHomeTeamGoals = computed<number>(() =>
  parseInt(String(props.guess.homeTeamRegularTimeGoals)),
)
const regularTimeAwayTeamGoals = computed<number>(() =>
  parseInt(String(props.guess.awayTeamRegularTimeGoals)),
)

const penaltiesHomeTeamGoals = computed<number>(() =>
  parseInt(String(props.guess.homeTeamPenaltiesTimeGoals)),
)

const penaltiesAwayTeamGoals = computed<number>(() =>
  parseInt(String(props.guess.awayTeamPenaltiesTimeGoals)),
)

const isHomeTeamWinningRegularTime = computed<boolean>(
  () => regularTimeHomeTeamGoals.value > regularTimeAwayTeamGoals.value,
)

const isAwayTeamWinningRegularTime = computed<boolean>(
  () => regularTimeAwayTeamGoals.value > regularTimeHomeTeamGoals.value,
)

const isHomeTeamWinningPenalties = computed<boolean>(
  () => penaltiesHomeTeamGoals.value > penaltiesAwayTeamGoals.value,
)

const isAwayTeamWinningPenalties = computed<boolean>(
  () => penaltiesAwayTeamGoals.value > penaltiesHomeTeamGoals.value,
)

const handleUpdateGuess = async (
  key:
    | 'homeTeamRegularTimeGoals'
    | 'awayTeamRegularTimeGoals'
    | 'homeTeamPenaltiesTimeGoals'
    | 'awayTeamPenaltiesTimeGoals',
  event: Event,
) => {
  emit('update:guess', {
    ...props.guess,
    [key]: (event.target as HTMLInputElement).value,
  })

  await nextTick()

  showPenaltiesGuess.value =
    props.guess.homeTeamRegularTimeGoals === props.guess.awayTeamRegularTimeGoals
}
</script>

<template>
  <div class="card bg-base-200/50 shadow-sm">
    <div class="card-body py-2 px-4">
      <div
        class="flex flex-col gap-2 items-center"
        :class="{ 'justify-between': match?.group, 'justify-center': !match?.group }"
      >
        <div class="text-center">
          <div class="badge badge-xs badge-outline border-base-300" v-if="match?.group">
            {{ match?.group?.name }}
          </div>
        </div>
        <div class="flex flex-col items-center justify-end gap-2">
          <MatchStatus :status="match.status!" />
          <FormattedDate :date="match.date!" class="text-xs text-base-content/60" />
        </div>
      </div>

      <!-- Teams and scores -->
      <div class="flex flex-col gap-2">
        <div class="text-center text-xs font-medium">Tempo Regular</div>
        <div class="flex lg:grid lg:grid-cols-12 justify-center gap-2 items-center">
          <!-- Home team -->
          <div class="col-span-5 flex flex-col-reverse lg:flex-row items-center justify-end gap-2">
            <span
              class="text-sm md:text-base text-right"
              :class="{ 'font-bold': isHomeTeamWinningRegularTime || isHomeTeamWinningPenalties }"
            >
              {{ match.homeTeam?.name }}
              <span class="font-bold" v-if="isHomeTeamWinningPenalties"> * </span>
            </span>
            <BaseImage
              :src="match.homeTeam?.badge"
              :alt="match.homeTeam?.name"
              class="size-6 lg:size-10 rounded-lg border border-base-300"
            />
          </div>
          <!-- Score -->
          <div class="col-span-2 flex items-center justify-around gap-2">
            <input
              :value="guess.homeTeamRegularTimeGoals"
              type="text"
              min="0"
              max="20"
              class="input !w-12 !lg:w-14 text-center"
              :class="{ 'font-bold': isHomeTeamWinningRegularTime }"
              :disabled="disabled"
              @input="handleUpdateGuess('homeTeamRegularTimeGoals', $event)"
            />
            <i class="fa-solid fa-xmark text-base-content/60" />
            <input
              :value="guess.awayTeamRegularTimeGoals"
              type="text"
              min="0"
              max="20"
              class="input !w-12 !lg:w-14 text-center"
              :class="{ 'font-bold': isAwayTeamWinningRegularTime }"
              :disabled="disabled"
              @input="handleUpdateGuess('awayTeamRegularTimeGoals', $event)"
            />
          </div>

          <!-- Away team -->
          <div class="col-span-5 flex flex-col lg:flex-row items-center justify-start gap-2">
            <BaseImage
              :src="match.awayTeam?.badge"
              :alt="match.awayTeam?.name"
              class="size-6 lg:size-10 rounded-lg border border-base-300"
            />
            <span
              class="text-sm md:text-base text-left"
              :class="{ 'font-bold': isAwayTeamWinningRegularTime || isAwayTeamWinningPenalties }"
            >
              {{ match.awayTeam?.name }}
              <span class="font-bold" v-if="isAwayTeamWinningPenalties"> * </span>
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="showPenaltiesGuess"
        class="bg-base-200/50 pt-2 px-3 pb-4 rounded-box self-center w-2/3 lg:w-1/4"
      >
        <div class="text-center text-xs font-medium mb-2">Pênaltis</div>
        <div class="flex items-center gap-2 justify-center">
          <input
            :value="guess.homeTeamPenaltiesTimeGoals"
            type="text"
            min="0"
            max="20"
            class="input !w-12 !lg:w-14 text-center"
            :disabled="disabled"
            :class="{ 'font-bold': isHomeTeamWinningPenalties }"
            @input="handleUpdateGuess('homeTeamPenaltiesTimeGoals', $event)"
          />
          <i class="fa-solid fa-xmark text-base-content/60" />
          <input
            :value="guess.awayTeamPenaltiesTimeGoals"
            type="text"
            min="0"
            max="20"
            class="input !w-12 !lg:w-14 text-center"
            :disabled="disabled"
            :class="{ 'font-bold': isAwayTeamWinningPenalties }"
            @input="handleUpdateGuess('awayTeamPenaltiesTimeGoals', $event)"
          />
        </div>
      </div>

      <!-- Penalties section (if applicable) -->
      <button
        v-if="allowPenaltiesGuess"
        class="btn btn-xs self-center"
        @click="togglePenaltiesGuess"
      >
        {{ showPenaltiesGuess ? 'Cancelar Pênaltis' : 'Palpitar pênaltis' }}
      </button>

      <!-- View other guesses button -->
      <div class="flex justify-center lg:justify-end">
        <button class="link link-hover link-xs" @click="$emit('view-guesses', match)">
          <i class="fa-solid fa-search" />
          Ver palpites
        </button>
      </div>
    </div>
  </div>
</template>
