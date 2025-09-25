<script setup lang="ts">
import BaseModal from '@/components/Shared/BaseModal.vue'
import { CHAMPIONSHIP_MODEL } from '@/constants'
import type { iChampionship, iState } from '@/types'
import { reactive, ref } from 'vue'
import services from '@/services'
import { useToastStore } from '@/stores'
import TeamSelect from '../Teams/TeamSelect.vue'
import { initializeChampionshipPositions } from '@/helpers/championships'

const props = defineProps<{
  championshipId?: number | null
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

const handleOpen = async () => {
  championship.loading = true

  const data = await services.championships.fetchChampionshipById(props.championshipId!)

  championship.data = {
    ...data,
    positions: initializeChampionshipPositions(data),
  }

  championship.loading = false
}

const handleClose = () => {
  emit('cancel')
}

const submitting = ref<boolean>(false)

const handleSubmit = async () => {
  try {
    submitting.value = true

    await services.championships.updateChampionship(championship.data)

    toastStore.success('Classificações atualizadas com sucesso')

    emit('success')
  } finally {
    submitting.value = false
  }
}

const positionsTitles: Record<number, string> = {
  1: 'Campeão',
  2: 'Vice-campeão',
}

const filterTeamsByPosition = ({ position, teams }: { position: any; teams: any }) => {
  const teamsIds = Object.values(championship.data.positions!)
    .filter((it) => it.position !== position.position && it.teamId)
    .map(({ teamId }) => teamId)

  return teams.filter(({ id }: { id: number }) => !teamsIds.includes(id))
}
</script>

<template>
  <BaseModal
    id="championship_set_ranking_modal_form"
    title="Definir Ranking"
    size="sm"
    @open="handleOpen"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <span v-if="championship.loading" class="loading loading-ring loading-xl" />

    <div v-else>
      <!-- @vue-ignore -->
      <TeamSelect
        v-for="(position, index) in championship.data.positions"
        :key="index"
        :label="positionsTitles[position.position]"
        :championship-id="championship.data.id"
        v-model="position.teamId"
        :filter="(teams) => filterTeamsByPosition({ teams, position })"
      />
    </div>
  </BaseModal>
</template>
