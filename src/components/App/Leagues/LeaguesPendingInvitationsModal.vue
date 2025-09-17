<script setup lang="ts">
import BaseModal from '@/components/Shared/BaseModal.vue'
import { computed, ref } from 'vue'

const props = defineProps<{
  invitations: any[]
}>()

const emit = defineEmits<{
  submit: [invitations: any[]]
}>()

const invitationsState = ref<any>({})

const handleOpen = () => {
  // @ts-ignore

  invitationsState.value = props.invitations.reduce(
    (result, league) => ({
      ...result,
      [league.id.toString()]: {
        leagueId: league.id,
        status: null,
      },
    }),
    {},
  )
}

const handleClose = () => {
  // @ts-ignore
  pending_invitations_modal.close()
}

const handleSubmit = () => {
  emit('submit', invitationsState.value)
}

const isConfirmDisabled = computed<boolean>(() =>
  Object.values(invitationsState.value).every((invitation: any) => !invitation.status),
)
</script>

<template>
  <BaseModal
    id="pending_invitations_modal"
    title="Convites Pendentes"
    cancel-button-text="Fechar"
    confirm-button-text="Confirmar"
    size="md"
    :disable-confirm="isConfirmDisabled"
    @open="handleOpen"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <div class="mt-4 space-y-4">
      <ul class="list">
        <li
          class="list-row justify-between flex items-center"
          v-for="league in invitations"
          :key="league.id"
        >
          <div>{{ league.name }}</div>
          <fieldset class="fieldset">
            <label class="label">
              <input
                v-model="invitationsState[league.id].status"
                type="checkbox"
                class="toggle toggle-primary"
              />
              Aceitar Convite
            </label>
          </fieldset>
        </li>
      </ul>
    </div></BaseModal
  >
</template>
