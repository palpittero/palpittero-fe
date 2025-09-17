<script setup lang="ts">
import type { iState } from '@/types'
import LeaguesPendingInvitationsModal from './LeaguesPendingInvitationsModal.vue'

defineProps<{
  state: iState<any[]>
}>()

const emit = defineEmits<{
  submit: [invitations: any[]]
}>()

// onMounted(loadPendingInvitations)

const handleManagePendingInvitations = () => {
  // @ts-ignore
  pending_invitations_modal.showModal()
}

const handlePendingInvitationsSubmit = async (invitations: any[]) => {
  emit('submit', invitations)
}
</script>

<template>
  <div class="alert alert-info shadow-lg flex justify-between">
    <div class="flex items-center gap-2">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>Você tem {{ state.data.length }} convite(s) pendente(s)</span>
    </div>
    <div class="flex-none">
      <button class="btn btn-sm btn-ghost" @click="handleManagePendingInvitations">
        Ver Convites
      </button>
    </div>
  </div>

  <!-- Pending Invitations Modal -->
  <LeaguesPendingInvitationsModal
    :invitations="state.data"
    @submit="handlePendingInvitationsSubmit"
  />
</template>
