<script setup lang="ts">
import BaseModal from '@/components/Shared/BaseModal.vue'
import InputFileImage from '@/components/Shared/InputFileImage.vue'
import UserSelect from '@/components/Shared/Users/UserSelect.vue'
import services from '@/services'
import { useAuthStore, useToastStore } from '@/stores'
import type { iLeague, iOption, iState } from '@/types'
import { reactive, ref } from 'vue'
import LeaguePrizes from '@/components/Admin/Leagues/LeaguePrizes.vue'
import UsersMultiSelect from '@/components/Shared/Users/UsersMultiSelect.vue'
import { parseLeague, parseLeagueInput } from '@/helpers/leagues'
import ChampionshipsMultiSelect from '@/components/Shared/Teams/ChampionshipsMultiSelect.vue'
import { storeToRefs } from 'pinia'
import { LEAGUE_MODEL } from '@/constants'

const toastStore = useToastStore()

const props = defineProps<{
  leagueId: number
}>()

const emit = defineEmits<{
  success: []
  cancel: []
}>()

const authStore = useAuthStore()
const { loggedUser } = storeToRefs(authStore)

const league = reactive<iState<iLeague>>({
  loading: false,
  error: null,
  data: { ...LEAGUE_MODEL, ownerId: loggedUser.value?.id ?? null },
})

const handleOpen = async () => {
  if (!props.leagueId) {
    league.data = { ...LEAGUE_MODEL, ownerId: loggedUser.value?.id ?? null }

    return
  }

  try {
    league.loading = true

    league.data = parseLeague(await services.leagues.fetchLeagueById(props.leagueId))
    league.data.championships = await services.leagues.fetchChampionships(props.leagueId)
  } catch (error: any) {
    league.error = error.message
  } finally {
    league.loading = false
  }
}

const handleClose = () => {
  emit('cancel')
}

const submitting = ref<boolean>(false)

const handleSubmit = async () => {
  try {
    submitting.value = true

    const parsedLeague = parseLeagueInput(league.data)

    if (league.data.id) {
      await services.leagues.updateLeague(parsedLeague)
    } else {
      await services.leagues.createLeague(parsedLeague)
    }

    toastStore.success('Liga salva com sucesso')
    emit('success')
  } catch (error: any) {
    if (error.response.status === 409) {
      toastStore.error('E-mail já está em uso')
    }
  } finally {
    submitting.value = false
  }
}

const filterUsers = (option: iOption) => option.id !== league.data.ownerId
</script>

<template>
  <BaseModal
    id="league_modal_form"
    title="Liga"
    @open="handleOpen"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <span v-if="league.loading" class="loading loading-ring loading-xl" />
    <fieldset v-else class="fieldset">
      <div>
        <label class="label" for="email">Nome</label>
        <input
          id="name"
          type="text"
          class="input validator"
          required
          placeholder="Informe o nome"
          v-model="league.data.name"
        />
        <div class="validator-hint">O nome é obrigatório</div>
      </div>

      <!-- @vue-ignore -->
      <InputFileImage v-model="league.data.badge" label="Escolha um escudo" />

      <ChampionshipsMultiSelect v-model="league.data.championships" label="Campeonatos" required />

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Visibilidade</legend>
        <label class="label">
          <input
            v-model="league.data.private"
            type="checkbox"
            class="toggle toggle-primary"
            :true-value="1"
            :false-value="0"
          />
          Tornar Privada
        </label>
      </fieldset>

      <UserSelect v-model="league.data.ownerId" label="Dono" :disabled="!!leagueId" />

      <UsersMultiSelect v-model="league.data.users" label="Participantes" :filter="filterUsers" />

      <template v-if="leagueId">
        <label class="label">
          <input
            v-model="league.data.resendInvitations"
            type="checkbox"
            class="toggle toggle-primary"
          />
          Reenviar Convites
        </label>
      </template>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Prêmios</legend>
        <label class="label">
          <input
            v-model="league.data.enablePrizes"
            type="checkbox"
            class="toggle toggle-primary"
            :true-value="1"
            :false-value="0"
          />
          Habilitar Prêmios
        </label>

        <template v-if="league.data.enablePrizes">
          <fieldset class="fieldset">
            <legend class="fieldset-legend">Valor do Ingresso</legend>
            <input
              v-model="league.data.ticketValue"
              type="number"
              min="0.50"
              :step="0.5"
              required
              class="input validator"
            />
            <div class="validator-hint">Informe um valor acima de R$ 0,50</div>
          </fieldset>

          <LeaguePrizes v-model="league.data.prizes" />
        </template>
      </fieldset>
    </fieldset>
  </BaseModal>
</template>
