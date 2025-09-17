<script setup lang="ts">
import BaseModal from '@/components/Shared/BaseModal.vue'
import UsersMultiSelect from '@/components/Shared/Users/UsersMultiSelect.vue'
import services from '@/services'
import { useToastStore } from '@/stores'
import type { iState, iLeague, iUser } from '@/types'
import { reactive, ref } from 'vue'
import LeagueApproveUserConfirmationModal from './LeagueApproveUserConfirmationModal.vue'
import LeagueInviteUsersConfirmationModal from './LeagueInviteUsersConfirmationModal.vue'

const props = defineProps<{
  league: iLeague | null
  loggedUserId?: number
}>()

const emit = defineEmits<{
  close: []
}>()

const toastStore = useToastStore()

const leagueUsers = reactive<iState<any>>({
  loading: false,
  data: [],
  error: null,
})

const loadLeagueUsers = async () => {
  try {
    leagueUsers.loading = true
    leagueUsers.data = await services.leagues.fetchUsers({
      league: props.league!,
    })
  } catch (error) {
    console.error('Error loading league users:', error)
    leagueUsers.error = 'Erro ao carregar usuários'
    leagueUsers.data = []
  } finally {
    leagueUsers.loading = false
  }
}

const filterUsers = (user: any) =>
  !leagueUsers.data.some(({ id }: { id: number }) => id === user.id)

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    approved: 'Aprovado',
    pending: 'Pendente',
    invited: 'Convite Enviado',
  }

  return labels[status] || status
}

// Invite Users
const selectedUsers = ref<iUser[]>([])
const isSendingInvitations = ref<boolean>(false)

const handleInviteUsersConfirmation = () => {
  // @ts-ignore
  invite_users_league_confirmation_modal.showModal()
}

const handleInviteUsers = async (users: iUser[]) => {
  if (!props.league) return

  try {
    isSendingInvitations.value = true
    await services.usersLeagues.inviteUsers({
      leagueId: props.league.id!,
      users,
    })

    toastStore.success('Convites enviados!')
    // @ts-ignore
    invite_users_league_confirmation_modal.close()
    loadLeagueUsers()
  } catch (error) {
    console.error('Error inviting user:', error)
    toastStore.error('Erro ao enviar convite')
  } finally {
    isSendingInvitations.value = false
  }
}

// Approve User
const selectedUser = ref<iUser>()
const isApprovingUser = ref<boolean>(false)

const handleApproveUserConfirmation = (user: iUser) => {
  selectedUser.value = user
  // @ts-ignore
  approve_user_league_confirmation_modal.showModal()
}

const handleApproveUser = async (user: iUser) => {
  if (!props.league) return

  try {
    isApprovingUser.value = true
    await services.usersLeagues.approveUsers({
      leagueId: props.league.id!,
      users: [
        {
          id: user.id,
          status: 'approved',
        },
      ],
    })
    toastStore.success('Usuário aprovado!')
    // @ts-ignore
    approve_user_league_confirmation_modal.close()
    loadLeagueUsers()
  } catch (error) {
    console.error('Error approving user:', error)
    toastStore.error('Erro ao aprovar usuário')
  } finally {
    isApprovingUser.value = false
  }
}

const handleClose = () => {
  // @ts-ignore
  emit('close')
}
</script>

<template>
  <BaseModal
    id="league_management_modal"
    :title="`Participantes da Liga: ${league?.name}`"
    cancel-button-text="Fechar"
    @open="loadLeagueUsers"
    @close="handleClose"
    hide-confirm-button
  >
    <UsersMultiSelect v-model="selectedUsers" label="Convidar usuários" :filter="filterUsers" />
    <div class="flex justify-end">
      <button
        class="btn btn-primary"
        :disabled="selectedUsers.length === 0"
        @click="handleInviteUsersConfirmation"
      >
        Enviar Convites
      </button>
    </div>
    <div class="divider" />
    <div v-if="leagueUsers.loading" class="flex justify-center py-4">
      <span class="loading loading-spinner loading-lg" />
    </div>
    <div v-else class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in leagueUsers.data" :key="user.id" class="hover:bg-base-200">
            <td>
              <div class="flex flex-col">
                {{ user.name }}
                <span class="text-xs text-gray-500">({{ user.email }})</span>
              </div>
            </td>
            <td>
              <div class="flex flex-col gap-2">
                <div
                  class="badge"
                  :class="{
                    'badge-success': user.status === 'approved',
                    'badge-warning': user.status === 'invited',
                    'badge-info': user.status === 'pending',
                  }"
                >
                  {{ getStatusLabel(user.status) }}
                </div>
                <a
                  v-if="user.status === 'invited'"
                  class="link link-primary link-hover"
                  @click="handleApproveUserConfirmation(user)"
                  >Aprovar</a
                >
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </BaseModal>

  <LeagueApproveUserConfirmationModal
    :user="selectedUser"
    :league="league"
    @submit="handleApproveUser"
  />

  <LeagueInviteUsersConfirmationModal
    :users="selectedUsers"
    :league="league"
    @submit="handleInviteUsers"
  />
</template>
