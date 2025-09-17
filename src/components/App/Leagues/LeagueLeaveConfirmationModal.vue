<script setup lang="ts">
import ConfirmationModal from '@/components/Shared/ConfirmationModal.vue'
import type { iLeague } from '@/types'

const props = defineProps<{
  league: iLeague | null
}>()

const emit = defineEmits<{
  submit: [league: iLeague]
}>()

const handleSubmit = () => {
  emit('submit', props.league!)
}
</script>

<template>
  <ConfirmationModal
    id="leave_league_confirmation_modal"
    title="Confirmar Saída"
    @submit="handleSubmit"
  >
    <p class="py-4">
      Ao sair desta liga, caso opte por voltar, a sua pontuação será zerada. Deseja mesmo sair?
    </p>
  </ConfirmationModal>
</template>
