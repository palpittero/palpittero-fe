<script setup lang="ts">
import LeagueVisibility from '@/components/Admin/Leagues/LeagueVisibility.vue'
import BaseImage from '@/components/Shared/BaseImage.vue'
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
    <ul class="list bg-base-100 rounded-box shadow-md">
      <li class="list-row" v-for="league in invitations" :key="league.id">
        <div>
          <BaseImage :src="league.avatar" :alt="league.name" class="size-10 rounded-lg" />
        </div>
        <div>
          <div>
            {{ league.name }}
          </div>
          <div class="text-xs uppercase font-semibold opacity-60">
            Liga <LeagueVisibility :private="league.private" />
          </div>
        </div>
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
  </BaseModal>
</template>
