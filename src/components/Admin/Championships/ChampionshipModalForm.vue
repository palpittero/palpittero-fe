<script setup lang="ts">
import BaseModal from '@/components/Shared/BaseModal.vue'
import services from '@/services'
import { useToastStore } from '@/stores'
import type { iChampionship, iChampionshipGroup, iChampionshipRound, iState } from '@/types'
import { computed, reactive, ref, watch } from 'vue'
import { createGroup, parseChampionshipInput } from '@/helpers/championships'

import { CHAMPIONSHIP_MODEL } from '@/constants'
import ChampionshipTeams from './ChampionshipTeams.vue'
import ChampionshipRounds from './ChampionshipRounds.vue'
import ChampionshipGroups from './ChampionshipGroups.vue'

const props = defineProps<{
  championshipId: number
}>()

const emit = defineEmits<{
  success: []
  cancel: []
}>()

const toastStore = useToastStore()

const championship = reactive<iState<iChampionship>>({
  loading: false,
  error: null,
  data: { ...CHAMPIONSHIP_MODEL },
})

const groups = ref<iChampionshipGroup[]>([createGroup('Grupo A')])

const isCreating = computed<boolean>(() => !championship.data.id)

const isSimpleRounds = computed<boolean>(() => championship.data.roundsType === 'simple')

watch(
  isSimpleRounds,
  (current) => {
    if (current) {
      const rounds = championship.data.rounds as iChampionshipRound[]
      championship.data.rounds = rounds.length || 1
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => isCreating.value && championship.data.hasGroups,
  (current) => {
    if (current) {
      championship.data.groups = groups.value
    }
  },
)

watch(
  () => championship.data.teams,
  (current) => {
    if (current) {
      if (current.length === 0) {
        championship.data.hasGroups = false
        championship.data.groups = [createGroup('Grupo A')]
      }
    }
  },
)

const handleOpen = async () => {
  if (!props.championshipId) {
    championship.data = { ...CHAMPIONSHIP_MODEL }

    return
  }

  try {
    championship.loading = true

    championship.data = await services.championships.fetchChampionshipById(props.championshipId)
  } catch (error: any) {
    championship.error = error.message
  } finally {
    championship.loading = false
  }
}

const handleClose = () => {
  emit('cancel')
}

const submitting = ref<boolean>(false)

const handleSubmit = async () => {
  try {
    submitting.value = true

    const parsedChampionship = parseChampionshipInput(championship.data)

    if (championship.data.id) {
      await services.championships.updateChampionship(parsedChampionship)
    } else {
      await services.championships.createChampionship(parsedChampionship)
    }

    toastStore.success('Campeonato salvo com sucesso')
    emit('success')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <BaseModal
    id="championship_modal_form"
    title="Campeonato"
    @open="handleOpen"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <span v-if="championship.loading" class="loading loading-ring loading-xl" />
    <fieldset v-else class="fieldset">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Nome</legend>
        <input
          id="name"
          type="text"
          class="input validator"
          required
          placeholder="Informe o nome"
          v-model="championship.data.name"
        />
        <div class="validator-hint">O nome é obrigatório</div>
      </fieldset>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Ano</legend>
        <input
          id="year"
          type="number"
          step="1"
          class="input validator"
          required
          placeholder="Informe o ano"
          v-model="championship.data.year"
        />
        <div class="validator-hint">O ano é obrigatório</div>
      </fieldset>

      <ChampionshipTeams v-model="championship.data.teams" required />

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Rodadas</legend>
        <div class="flex items-center gap-4" v-if="isCreating">
          <input
            id="rounds-type-simple"
            type="radio"
            class="radio"
            value="simple"
            v-model="championship.data.roundsType"
          />
          Simples
          <input
            id="rounds-type-detailed"
            type="radio"
            class="radio"
            value="detailed"
            v-model="championship.data.roundsType"
          />
          Detalhado
        </div>
      </fieldset>

      <ChampionshipRounds
        v-model="championship.data.rounds"
        required
        :rounds-type="championship.data.roundsType"
      />

      <ChampionshipGroups
        v-model:has-groups="championship.data.hasGroups"
        v-model:groups="championship.data.groups"
        :teams="championship.data.teams"
      />
    </fieldset>
  </BaseModal>
</template>
