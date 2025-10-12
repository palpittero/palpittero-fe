<script setup lang="ts">
import type { iChampionshipGuess, iMatchGuess } from '@/types'
import { isNil } from 'lodash/fp'
import { computed } from 'vue'

const props = defineProps<{
  guess: iMatchGuess | iChampionshipGuess
}>()

const classMap = {
  10: 'badge-success text-white',
  5: 'badge-success text-white',
  4: 'badge-secondary text-white',
  3: 'badge-neutral',
  2: 'badge-warning',
  1: 'badge-accent',
  0: 'bg-base-300',
  notRegistered: 'badge-primary-content',
  processing: 'bg-blue-200',
}

const badgeClass = computed<string>(() => {
  const baseClasses = 'badge badge-sm gap-1 !px-1.5'
  const key = props.guess.id ? (props.guess.points ?? 'processing') : 'notRegistered'

  // @ts-ignore
  return `${baseClasses} ${classMap[key]}`
})

const label = computed<string>(() => {
  const { id, points } = props.guess

  if (id) {
    return isNil(points) ? '' : points <= 1 ? `${points} ponto` : `${points} pontos`
  }

  return 'Palpite não registrado'
})
</script>
<template>
  <div :class="badgeClass" v-if="label">
    <slot>
      <i v-if="guess.points! >= 5" class="fa-solid fa-star" />
      {{ label }}
    </slot>
  </div>
</template>
