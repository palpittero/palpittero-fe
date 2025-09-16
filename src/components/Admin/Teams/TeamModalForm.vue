<script setup lang="ts">
import BaseModal from '@/components/Shared/BaseModal.vue'
import CountrySelect from '@/components/Shared/CountrySelect.vue'
import InputFileImage from '@/components/Shared/InputFileImage.vue'
import { TEAM_MODEL } from '@/constants'
import services from '@/services'
import { useToastStore } from '@/stores'
import type { iTeam, iState } from '@/types'
import { computed, reactive, ref } from 'vue'

const toastStore = useToastStore()

const props = defineProps<{
  teamId: number
}>()

const emit = defineEmits<{
  success: []
  cancel: []
}>()

const team = reactive<iState<iTeam>>({
  loading: false,
  error: null,
  data: { ...TEAM_MODEL },
})

const isClub = computed<boolean>(() => team.data.type === 'club')

const handleOpen = async () => {
  if (!props.teamId) {
    team.data = { ...TEAM_MODEL }

    return
  }

  try {
    team.data = await services.teams.fetchTeamById(props.teamId)
  } catch (error: any) {
    team.error = error.message
  }
}

const handleClose = () => {
  emit('cancel')
}

const submitting = ref<boolean>(false)

const handleSubmit = async () => {
  try {
    submitting.value = true

    if (team.data.id) {
      await services.teams.updateTeam(team.data)
    } else {
      await services.teams.createTeam(team.data)
    }

    toastStore.success('Time salvo com sucesso')
    emit('success')
  } catch (error: any) {
    if (error.response.status === 409) {
      toastStore.error('Já existe um time com esse nome')
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <BaseModal
    id="team_modal_form"
    title="Time"
    @open="handleOpen"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <fieldset class="fieldset">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Nome</legend>
        <input
          id="name"
          type="text"
          class="input validator"
          required
          placeholder="Informe o nome do time"
          v-model="team.data.name"
        />
        <div class="validator-hint">Nome é obrigatório</div>
      </fieldset>

      <!-- @vue-ignore -->
      <InputFileImage v-model="team.data.badge" label="Escudo/Bandeira" />

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Tipo</legend>
        <div class="flex items-center gap-4 mb-6">
          <input id="type-club" type="radio" class="radio" value="club" v-model="team.data.type" />
          Clube
          <input
            id="type-national-team"
            type="radio"
            class="radio"
            value="nationalTeam"
            v-model="team.data.type"
          />
          Seleção Nacional
        </div>
      </fieldset>

      <template v-if="isClub">
        <CountrySelect v-model="team.data.countryId" label="País" required />

        <fieldset class="fieldset">
          <legend class="fieldset-legend">Região</legend>

          <input
            type="text"
            class="input mb-6"
            v-model="team.data.region"
            placeholder="Informe a região"
          />
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">Divisão Nacional</legend>

          <input
            type="text"
            class="input mb-6"
            v-model="team.data.nationalDivision"
            placeholder="Informe a divisão nacional"
          />
        </fieldset>
      </template>
    </fieldset>
  </BaseModal>
</template>
