<script setup lang="ts">
import { isNil } from 'lodash/fp'
import { computed } from 'vue'

const badgeClassMap: Record<string, string> = {
  10: 'badge-success',
  5: 'badge-primary',
  4: 'badge-green',
  3: 'badge-green',
  2: 'badge-info',
  1: 'badge-warning',
  0: 'badge-ghost',
  notRegistered: 'badge-neutral',
  processing: 'badge-success',
}

const props = defineProps({
  guess: {
    type: Object,
    required: true,
  },
})

const badgeClass = computed<string>(() => {
  const baseClasses = 'badge-sm badge badge-soft'

  const key = props.guess.id ? props.guess.points || 'processing' : 'notRegistered'
  const colorClass = badgeClassMap[key]

  return `${baseClasses} ${colorClass}`
})

const label = computed(() => {
  const { id, points } = props.guess

  if (id) {
    return isNil(points) ? 'Processando' : points ? `${points} pontos` : `${points} ponto`
  }

  return 'Palpite não registrado'
})
</script>
<template>
  <div :class="badgeClass">{{ label }}</div>
</template>
