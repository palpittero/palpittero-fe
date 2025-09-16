<script setup lang="ts">
import type { iChampionship, iMatch, iMatchDetail, iMatchRound } from '@/types'

import ChampionshipSelect from '@/components/Shared/Teams/ChampionshipSelect.vue'
import ChampionshipRoundSelect from '../Championships/ChampionshipRoundSelect.vue'

import { createMatchDetail } from '@/helpers/matches'
import MatchDetailModalForm from './MatchDetailModalForm.vue'
import { ref } from 'vue'
import MatchesModalFormDetails from './MatchesModalFormDetails.vue'

const match = defineModel<iMatch>({ required: true })

const handleAddMatch = () => {
  selectedMatchDetail.value = createMatchDetail()
  // @ts-ignore
  match_detail_modal_form.showModal()
}

const handleRemoveMatch = (detail: iMatchDetail) => {
  match.value.details = match.value.details?.filter(({ id }) => id !== detail.id)
}

const selectedMatchDetail = ref<iMatchDetail>({} as iMatchDetail)

const handleSubmitMatchDetail = () => {
  match.value.details = [...match.value.details!, selectedMatchDetail.value!]
  // @ts-ignore
  match_detail_modal_form.close()
}

const handleRoundChange = (round: iMatchRound) => {
  match.value.round = round
}

const handleChampionshipChange = (championship: iChampionship) => {
  match.value.championship = championship
}
</script>

<template>
  <fieldset class="fieldset">
    <ChampionshipSelect
      v-model="match.championshipId"
      label="Campeonato"
      required
      @change="handleChampionshipChange"
    />

    <ChampionshipRoundSelect
      v-if="match.championshipId"
      v-model="match.roundId"
      label="Rodada"
      required
      :championship-id="match.championshipId"
      @change="handleRoundChange"
    />

    <fieldset v-if="match.roundId" class="fieldset">
      <legend class="fieldset-legend">Partidas</legend>

      <div class="flex flex-col gap-1">
        <div class="alert alert-warning alert-soft" v-if="match.details?.length === 0">
          <span> <i class="fa-solid fa-warning" /> Nenhuma partida adicionada </span>
        </div>

        <input
          type="number"
          class="input validator hidden"
          :value="match.details?.length"
          required
          :min="1"
        />
        <div class="validator-hint" v-if="match.details?.length === 0">
          Adicione pelo menos uma partida
        </div>

        <MatchesModalFormDetails v-else :details="match.details!" @remove="handleRemoveMatch" />

        <MatchDetailModalForm
          v-model="selectedMatchDetail"
          :championship-id="match.championshipId!"
          @submit="handleSubmitMatchDetail"
        />

        <button class="btn btn-primary btn-outline" @click="handleAddMatch" type="button">
          <i class="fa-solid fa-plus" />
          Adicionar Partida
        </button>
      </div>
    </fieldset>
  </fieldset>
</template>
