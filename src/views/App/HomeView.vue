<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, useToastStore } from '@/stores'
import services from '@/services'
import LeagueModalForm from '@/components/Shared/LeagueModalForm.vue'
import type { iLeague, iState } from '@/types'
import LeaguesJoined from '@/components/App/Leagues/LeaguesJoined.vue'
import LeaguesPublic from '@/components/App/Leagues/LeaguesPublic.vue'
import LeagueRankingModal from '@/components/App/Leagues/LeagueRankingModal.vue'
import LeagueManagementModal from '@/components/App/Leagues/LeagueManagementModal.vue'
import { storeToRefs } from 'pinia'
import LeaguesPendingInvitationsBanner from '@/components/App/Leagues/LeaguesPendingInvitationsBanner.vue'
import LeagueRemoveConfirmationModal from '@/components/App/Leagues/LeagueRemoveConfirmationModal.vue'
import LeagueLeaveConfirmationModal from '@/components/App/Leagues/LeagueLeaveConfirmationModal.vue'
import LeagueJoinConfirmationModal from '@/components/App/Leagues/LeagueJoinConfirmationModal.vue'

const router = useRouter()
const auth = useAuthStore()
const toastStore = useToastStore()

const { loggedUser } = storeToRefs(auth)

// Leagues
const allMyLeagues = reactive<iState<iLeague[]>>({
  loading: false,
  data: [],
  error: null,
})

const loadMyLeagues = async () => {
  try {
    allMyLeagues.loading = true

    allMyLeagues.data = await services.leagues.fetchMyLeagues({
      status: 'approved',
    })
  } catch (error) {
    console.error('Error loading my leagues:', error)
    toastStore.error('Erro ao carregar suas ligas')
  } finally {
    allMyLeagues.loading = false
  }
}

const allPublicLeagues = reactive<iState<iLeague[]>>({
  loading: false,
  data: [],
  error: null,
})

const loadPublicLeagues = async () => {
  try {
    allPublicLeagues.loading = true
    allPublicLeagues.data = await services.leagues.fetchPublicLeagues()
  } catch (error) {
    console.error('Error loading public leagues:', error)
    toastStore.error('Erro ao carregar ligas públicas')
  } finally {
    allPublicLeagues.loading = false
  }
}

const joinedLeagues = computed<iLeague[]>(() =>
  allMyLeagues.data.filter((league: iLeague) =>
    league.users?.some(
      (user: any) => user.id === loggedUser.value?.id && user.status === 'approved',
    ),
  ),
)

const publicLeagues = computed<iLeague[]>(() =>
  allPublicLeagues.data.filter(
    (league: iLeague) => !joinedLeagues.value.some((joined: iLeague) => joined.id === league.id),
  ),
)

const selectedLeague = ref<iLeague | null>(null)

// Pending Invitations
const pendingInvitations = reactive<iState<iLeague[]>>({
  loading: false,
  data: [],
  error: null,
})

const hasPendingLeaguesInvitations = computed<boolean>(() => pendingInvitations.data.length > 0)

const loadPendingInvitations = async () => {
  try {
    pendingInvitations.loading = true
    pendingInvitations.data = await services.leagues.fetchMyLeagues({
      status: 'invited',
    })
  } catch (error) {
    console.error('Error loading pending invitations:', error)
    pendingInvitations.error = 'Erro ao carregar convites pendentes'
    pendingInvitations.data = []
  } finally {
    pendingInvitations.loading = false
  }
}

const isUpdatingInvitations = ref<boolean>(false)

const handlePendingInvitationsSubmit = async (invitations: any[]) => {
  try {
    isUpdatingInvitations.value = true

    await services.usersLeagues.updateInvitations(invitations)
    toastStore.success('Convites atualizados!')
    // @ts-ignore
    pending_invitations_modal.close()
    await loadData()
  } catch (error) {
    console.error('Error updating invitations:', error)
    toastStore.error('Erro ao atualizar convites')
  } finally {
    isUpdatingInvitations.value = false
  }
}

// Create/Edit League
const handleCreateLeague = () => {
  selectedLeague.value = null
  // @ts-ignore
  league_modal_form.showModal()
}

const handleEditLeague = (league: iLeague) => {
  selectedLeague.value = league
  // @ts-ignore
  league_modal_form.showModal()
}

const handleLeagueSaved = async () => {
  // @ts-ignore
  league_modal_form.close()
  await loadData()
}

const handleLeagueModalCancel = () => {
  // @ts-ignore
  league_modal_form.close()
  selectedLeague.value = null
}

// Remove League
const removingLeague = ref<boolean>(false)

const handleRemoveLeagueConfirmation = (league: iLeague) => {
  selectedLeague.value = league
  // @ts-ignore
  remove_league_confirmation_modal.showModal()
}

const handleRemoveLeague = async () => {
  if (!selectedLeague.value) return

  try {
    removingLeague.value = true
    await services.leagues.deleteLeague(selectedLeague.value.id!)

    toastStore.success('Liga excluída com sucesso!')
    handleCloseRemoveLeagueConfirmation()

    await loadData()
  } catch (error) {
    console.error('Error deleting league:', error)
    toastStore.error('Erro ao excluir liga')
  } finally {
    removingLeague.value = false
  }
}

const handleCloseRemoveLeagueConfirmation = () => {
  // @ts-ignore
  remove_league_confirmation_modal.close()
  selectedLeague.value = null
}

// League Ranking
const handleRankingLeague = (league: iLeague) => {
  selectedLeague.value = league
  // @ts-ignore
  league_ranking_modal.showModal()
}

// League Management
const handleManagementLeague = (league: iLeague) => {
  selectedLeague.value = league
  // @ts-ignore
  league_management_modal.showModal()
}

const handleCloseManagementLeague = () => {
  // @ts-ignore
  league_management_modal.close()
  selectedLeague.value = null
}

// League Leave
const leavingLeague = ref<boolean>(false)

const handleLeaveLeagueConfirmation = async (league: iLeague) => {
  selectedLeague.value = league
  // @ts-ignore
  leave_league_confirmation_modal.showModal()
}

const handleLeaveLeague = async (league: iLeague) => {
  if (!selectedLeague.value) return

  try {
    leavingLeague.value = true

    await services.usersLeagues.deleteUser({
      leagueId: league.id!,
      userId: loggedUser.value?.id || 0,
    })

    toastStore.success(`Você saiu da liga ${league.name}`)
    handleCloseLeaveLeagueConfirmation()
    await loadData()
  } catch (error) {
    console.error('Error leaving league:', error)
    toastStore.error('Erro ao sair da liga')
  } finally {
    leavingLeague.value = false
  }
}

const handleCloseLeaveLeagueConfirmation = () => {
  // @ts-ignore
  leave_league_confirmation_modal.close()
  selectedLeague.value = null
}

// League Join
const joiningLeague = ref<boolean>(false)

const handleJoinLeagueConfirmation = (league: iLeague) => {
  selectedLeague.value = league
  // @ts-ignore
  join_league_confirmation_modal.showModal()
}

const handleJoinLeague = async (league: iLeague) => {
  if (!selectedLeague.value) return

  try {
    joiningLeague.value = true
    await services.usersLeagues.joinLeague(league.id!)

    toastStore.success(league.private ? 'Solicitação enviada!' : 'Você entrou na liga!')

    handleCloseJoinLeagueConfirmation()

    await loadData()
  } catch (error) {
    console.error('Error joining league:', error)
    toastStore.error('Erro ao entrar na liga')
  } finally {
    joiningLeague.value = false
  }
}

const handleCloseJoinLeagueConfirmation = () => {
  // @ts-ignore
  join_league_confirmation_modal.close()
  selectedLeague.value = null
}

// League Guesses
const handleGuessesLeague = (league: iLeague) => {
  router.push({
    name: 'app.guesses',
    params: { leagueId: league.id?.toString() },
  })
}

const loadData = () => Promise.all([loadMyLeagues(), loadPublicLeagues(), loadPendingInvitations()])

onMounted(loadData)
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-base-content flex items-center gap-3">
          <i class="fa-solid fa-flag" />
          Ligas
        </h1>
      </div>
      <button class="btn btn-primary" @click="handleCreateLeague">
        <i class="fa-solid fa-plus" />
        Criar Liga
      </button>
    </div>

    <LeaguesPendingInvitationsBanner
      v-if="hasPendingLeaguesInvitations"
      :state="pendingInvitations"
      @submit="handlePendingInvitationsSubmit"
    />

    <!-- My Leagues Section -->
    <LeaguesJoined
      :leagues="joinedLeagues"
      :loading="allMyLeagues.loading"
      :logged-user-id="loggedUser?.id"
      @guesses="handleGuessesLeague"
      @ranking="handleRankingLeague"
      @manage="handleManagementLeague"
      @remove="handleRemoveLeagueConfirmation"
      @leave="handleLeaveLeagueConfirmation"
      @edit="handleEditLeague"
    />

    <!-- Public Leagues Section -->
    <LeaguesPublic
      :leagues="publicLeagues"
      :loading="allPublicLeagues.loading"
      @join="handleJoinLeagueConfirmation"
    />
  </div>

  <!-- League Modal (Create/Edit) -->
  <LeagueModalForm
    :league-id="selectedLeague?.id"
    @success="handleLeagueSaved"
    @cancel="handleLeagueModalCancel"
  />

  <!-- Ranking Modal -->
  <LeagueRankingModal :league="selectedLeague" />

  <!-- League Participants Modal -->
  <LeagueManagementModal
    :league="selectedLeague"
    :logged-user-id="loggedUser?.id"
    @close="handleCloseManagementLeague"
  />

  <!-- Remove League Confirmation Modal -->
  <LeagueRemoveConfirmationModal :league="selectedLeague" @submit="handleRemoveLeague" />

  <!-- Leave League Confirmation Modal -->
  <LeagueLeaveConfirmationModal :league="selectedLeague" @submit="handleLeaveLeague" />

  <!-- Join League Confirmation Modal -->
  <LeagueJoinConfirmationModal :league="selectedLeague" @submit="handleJoinLeague" />
</template>
