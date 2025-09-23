<script setup lang="ts">
import BaseModal from '@/components/Shared/BaseModal.vue'
import { MATCH_MODEL } from '@/constants'
import type { iMatch, iState } from '@/types'
import { reactive, ref } from 'vue'
import MatchesModalForm from './MatchesModalForm.vue'
import MatchUpdateModalForm from './MatchUpdateModalForm.vue'
import services from '@/services'
import { useToastStore } from '@/stores'
import { parseMatch } from '@/helpers/matches'

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

const handleOpen = async () => {
  if (props.matchId) {
    match.loading = true
    match.data = parseMatch(await services.matches.fetchMatchById(props.matchId))

    match.loading = false
  } else {
    match.data = { ...MATCH_MODEL }
  }
}

const submitting = ref<boolean>(false)

const handleSubmit = async () => {
  try {
    submitting.value = true

    if (match.data.id) {
      await services.matches.updateMatch(match.data)
      toastStore.success('Partidas atualizada com sucesso')
    } else {
      await services.matches.createMatches(match.data)
      toastStore.success('Partidas criadas com sucesso')
    }

    emit('success')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <BaseModal id="match_modal_form" title="Partida" @open="handleOpen" @submit="handleSubmit">
    <span v-if="match.loading" class="loading loading-ring loading-xl" />
    <template v-else>
      <MatchUpdateModalForm v-if="matchId" v-model="match.data" :match-id="match.data.id" />
      <MatchesModalForm v-else v-model="match.data" />
    </template>
  </BaseModal>
</template>
