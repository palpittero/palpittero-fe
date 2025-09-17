<script setup lang="ts">
import ConfirmationModal from '@/components/Shared/ConfirmationModal.vue'
import type { iLeague, iUser } from '@/types'

const props = defineProps<{
  user?: iUser | null
  league: iLeague | null
}>()

const emit = defineEmits<{
  submit: [user: iUser]
}>()

const handleSubmit = () => {
  emit('submit', props.user!)
}
</script>

<template>
  <ConfirmationModal
    id="approve_user_league_confirmation_modal"
    title="Aprovar Participação"
    @submit="handleSubmit"
  >
    <p class="py-4">
      Tem certeza que deseja aprovar a participação do usuário "{{ user?.name }}" na liga "{{
        league?.name
      }}"?
    </p>
  </ConfirmationModal>
</template>
