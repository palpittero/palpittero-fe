<script setup lang="ts">
import { createRound } from '@/helpers/championships'
import type { iChampionshipRound, iChampionshipRoundType } from '@/types'
import { computed } from 'vue'

const props = defineProps<{
  roundsType?: iChampionshipRoundType
  required?: boolean
}>()

const rounds = defineModel<any>({ required: true })

const isSimpleRounds = computed(() => props.roundsType === 'simple')

const hasNoRounds = computed(() => rounds.value?.length === 0)

const handleAdd = () => {
  const name = `Rodada #${rounds.value.length + 1}`
  rounds.value = [...rounds.value, createRound(name)]
}

const handleRemove = (round: iChampionshipRound) =>
  (rounds.value = (rounds.value as iChampionshipRound[]).filter(
    (championshipRound: iChampionshipRound) =>
      championshipRound.id !== round.id || championshipRound.uuid !== round.uuid,
  ))
</script>

<template>
  <fieldset class="fieldset" v-if="isSimpleRounds">
    <legend class="fieldset-legend">Número de Rodadas</legend>
    <input
      type="number"
      class="input validator !w-1/2"
      step="1"
      min="1"
      required
      placeholder="Informe o número de rodadas"
      v-model="rounds"
    />
    <div class="validator-hint">O número de rodadas é obrigatório</div>
  </fieldset>

  <div v-else class="flex flex-col gap-4">
    <div class="alert alert-warning alert-soft" v-if="hasNoRounds">
      <span> <i class="fa-solid fa-warning" /> Nenhuma rodada definida </span>
    </div>
    <template v-else>
      <div
        class="flex items-center gap-4"
        v-for="(round, index) of rounds"
        :key="round.uuid || round.id"
      >
        <input type="text" class="input" placeholder="Rodada #" v-model="round.name" />
        <select class="select" v-model="round.type">
          <option disabled selected>Selecione o tipo de rodada</option>
          <option value="regularTime">Tempo Regular</option>
          <option value="extraTime">Prorrogação</option>
          <option value="penalties">Pênaltis</option>
        </select>

        <label class="label">
          <input
            v-model="round.ignoreGroups"
            type="checkbox"
            class="toggle toggle-primary"
            :true-value="1"
            :false-value="0"
          />
          Ignorar Grupos
        </label>
        <button class="btn btn-ghost" @click="handleRemove(round)" :disabled="index === 0">
          <i class="fa-solid fa-trash" :class="{ 'text-error': index !== 0 }" />
        </button>
      </div>
    </template>

    <button class="btn btn-primary btn-outline" @click="handleAdd" type="button">
      <i class="fa-solid fa-plus" />
      Adicionar Rodada
    </button>
  </div>
</template>
