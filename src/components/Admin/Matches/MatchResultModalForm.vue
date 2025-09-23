<script setup lang="ts">
import BaseModal from '@/components/Shared/BaseModal.vue'
import { MATCH_MODEL } from '@/constants'
import type { iMatch, iState } from '@/types'
import { computed, reactive, ref, watch } from 'vue'
import services from '@/services'
import { useToastStore } from '@/stores'
import { parseMatch } from '@/helpers/matches'
import FormattedDate from '@/components/Shared/FormattedDate.vue'
import { isNil } from 'lodash/fp'
import BaseImage from '@/components/Shared/BaseImage.vue'

const props = defineProps<{
  matchId?: number | null
}>()

const emit = defineEmits<{
  success: []
  cancel: []
}>()

const toastStore = useToastStore()

const match = reactive<iState<iMatch>>({
  loading: false,
  error: null,
  data: { ...MATCH_MODEL },
})

const isPenaltiesRoundType = computed<boolean>(() =>
  ['extraTime', 'penalties'].includes(match.data.round?.type ?? ''),
)

const showPenaltiesResults = computed<boolean>(() => {
  if (!isPenaltiesRoundType.value) return false

  const { regularTimeHomeTeamGoals, regularTimeAwayTeamGoals } = match.data

  return (
    isPenaltiesRoundType.value &&
    !isNil(regularTimeHomeTeamGoals) &&
    !isNil(regularTimeAwayTeamGoals) &&
    match.data.regularTimeHomeTeamGoals === match.data.regularTimeAwayTeamGoals
  )
})

watch(showPenaltiesResults, (current) => {
  if (!current) {
    match.data.penaltiesTimeHomeTeamGoals = null
    match.data.penaltiesTimeAwayTeamGoals = null
  } else {
    match.data.penaltiesTimeHomeTeamGoals = 0
    match.data.penaltiesTimeAwayTeamGoals = 0
  }
})

const handleOpen = async () => {
  match.loading = true
  match.data = parseMatch(await services.matches.fetchMatchById(props.matchId!))

  match.loading = false
}

const handleClose = () => {
  emit('cancel')
}

const submitting = ref<boolean>(false)

const handleSubmit = async () => {
  try {
    submitting.value = true

    await services.matches.updateMatch({
      ...match.data,
      status: 'finished',
    })
    toastStore.success('Resultado atualizado com sucesso')

    emit('success')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <BaseModal
    id="match_result_modal_form"
    title="Atualizar Resultado"
    size="sm"
    @open="handleOpen"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <span v-if="match.loading" class="loading loading-ring loading-xl" />

    <div v-else class="flex flex-col gap-4">
      <div class="flex gap-1 flex-col items-center">
        <div class="text-sm">
          {{ match.data.round?.championship?.name }} {{ match.data.round?.championship?.year }}
        </div>
        <div class="text-xs uppercase font-semibold opacity-70">
          {{ match.data.round?.name }}
        </div>

        <span class="text-xs opacity-70">
          <FormattedDate :date="match.data.date!" />
        </span>
      </div>
      <fieldset class="fieldset items-center justify-center flex w-full">
        <div class="card rounded-box place-items-center flex gap-2">
          <BaseImage :src="match.data.homeTeam?.badge!" class="size-20" />
          <span>{{ match.data.homeTeam?.name }}</span>

          <div>
            <div class="text-xs text-gray-500 text-center">Tempo Regular</div>
            <input
              type="number"
              class="input text-center validator"
              min="0"
              v-model="match.data.regularTimeHomeTeamGoals"
              required
            />
            <div class="validator-hint text-center">Informe o número de gols</div>
          </div>
          <div v-if="showPenaltiesResults" class="card rounded-box place-items-center flex gap-2">
            <div>
              <div class="text-xs text-gray-500 text-center">Pênaltis</div>
              <input
                type="number"
                class="input text-center validator"
                min="0"
                v-model="match.data.penaltiesTimeHomeTeamGoals"
                required
              />
              <div class="validator-hint text-center">Informe o número de gols</div>
            </div>
          </div>
        </div>
        <div class="divider divider-horizontal">
          <i class="fa-solid fa-xmark" />
        </div>
        <div class="card rounded-box place-items-center flex gap-2">
          <BaseImage :src="match.data.awayTeam?.badge!" class="size-20" />
          <span>{{ match.data.awayTeam?.name }}</span>
          <div>
            <div class="text-xs text-gray-500 text-center">Tempo Regular</div>
            <input
              type="number"
              class="input text-center validator"
              min="0"
              v-model="match.data.regularTimeAwayTeamGoals"
              required
            />
            <div class="validator-hint text-center">Informe o número de gols</div>
          </div>
          <div v-if="showPenaltiesResults" class="card rounded-box place-items-center flex gap-2">
            <div>
              <div class="text-xs text-gray-500 text-center">Pênaltis</div>
              <input
                type="number"
                class="input text-center validator"
                min="0"
                v-model="match.data.penaltiesTimeAwayTeamGoals"
                required
              />
              <div class="validator-hint text-center">Informe o número de gols</div>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  </BaseModal>
</template>
