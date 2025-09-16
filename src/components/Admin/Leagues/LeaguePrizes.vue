<script setup lang="ts">
import { type iLeaguePrize } from '@/types'
import { computed } from 'vue'

const prizes = defineModel<iLeaguePrize[]>({ required: true })

const prizesPositions: Record<number, string> = {
  1: 'Primeiro Colocado',
  2: 'Segundo Colocado',
  3: 'Terceiro Colocado',
}

const valuesMismatch = computed<boolean>(() => {
  const prizesTotal = prizes.value.reduce((acc, prize) => acc + (prize.amount ?? 0), 0)

  return prizesTotal > 100 || prizesTotal <= 0
})
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">Distribuição</legend>

    <template v-for="prize in prizes" :key="prize.position">
      <label class="label">{{ prizesPositions[prize.position] }} (%)</label>
      <input v-model="prize.amount" type="number" class="input" max="100" />
    </template>

    <div v-if="valuesMismatch" class="text-error">
      O total percentual deve ser maior que 0% e menor que 100%
    </div>
  </fieldset>
</template>
