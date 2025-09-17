<script setup lang="ts">
import ConfirmationModal from '@/components/Shared/ConfirmationModal.vue'
import type { iLeague, iUser } from '@/types'

const props = defineProps<{
  users?: iUser[]
  league: iLeague | null
}>()

const emit = defineEmits<{
  submit: [users: iUser[]]
}>()

const handleSubmit = () => {
  emit('submit', props.users!)
}
</script>

<template>
  <ConfirmationModal
    id="invite_users_league_confirmation_modal"
    title="Confirmar Convites"
    @submit="handleSubmit"
  >
    <p class="py-4">
      Tem certeza que deseja convidar os usuários abaixo para a liga "{{ league?.name }}"?
    </p>
    <div v-for="user in users" :key="user.id">
      {{ user.name }}
    </div>
  </ConfirmationModal>
</template>
