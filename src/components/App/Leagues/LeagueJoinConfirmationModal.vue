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
    id="join_league_confirmation_modal"
    title="Confirmar Exclusão"
    @submit="handleSubmit"
  >
    <p class="py-4">Tem certeza que deseja participar da liga "{{ league?.name }}"?</p>
  </ConfirmationModal>
</template>
