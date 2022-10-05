<template>
  <div>
    <PendingLeaguesInvitations
      :key="pendingLeaguesInvitationsKey"
      @refresh="loadLeagues"
    />
    <div class="flex justify-content-between align-items-center mb-3">
      <h1 class="mb-0">
        {{ $t('common.leagues') }}
      </h1>
      <Button @click="handleCreateLeague">
        {{ $t('app.leagues.create') }}
      </Button>
    </div>
    <LeaguesDescriptionList
      :leagues="joinedLeagues"
      :loading="allMyLeagues.loading"
      :title="$t('app.leagues.myLeagues.title')"
      :description="$t('app.leagues.myLeagues.description')"
      :empty-state="$t('app.leagues.noJoinedLeagues')"
      @manage="handleManageLeague"
      @ranking="handleRankingLeague"
      @leave="handleLeaveLeague"
      @guesses="handleGuessesLeague"
      @remove="handleRemoveLeague"
      @edit="handleEditLeague"
    />
    <LeaguesDescriptionList
      :leagues="publicLeagues"
      :loading="allPublicLeagues.loading"
      :title="$t('app.leagues.publicLeagues.title')"
      :description="$t('app.leagues.publicLeagues.description')"
      :empty-state="$t('app.leagues.noPublicLeaguesFound')"
      @manage="handleManageLeague"
      @ranking="handleRankingLeague"
      @join="handleJoinLeague"
    />

    <LeagueRankingDialog
      v-if="isLeagueRankingDialogVisible"
      :league="selectedLeague"
      :visible="isLeagueRankingDialogVisible"
      @submit="handleLeagueRankingDialogSubmit"
    />

    <LeagueDetailsDialog
      v-if="isLeagueDetailsDialogVisible"
      v-model="selectedLeague"
      :visible="isLeagueDetailsDialogVisible"
      :owner-id="auth.loggedUser.id"
      @hide="handleDetailsDialogHide"
      @submit="handleDetailsDialogSubmit"
    />

    <LeagueUsersDialog
      v-if="isLeagueUsersDialogVisible"
      :league="selectedLeague"
      :visible="isLeagueUsersDialogVisible"
      @hide="handleUsersDialogHide"
      @submit="handleUsersDialogSubmit"
    />

    <BaseConfirmDialog
      v-if="isLeagueJoinDialogVisible"
      :header="leagueJoinDialog.header"
      :message="leagueJoinDialog.message"
      :visible="isLeagueJoinDialogVisible"
      @hide="handleJoinDialogHide"
      @submit="handleJoinDialogSubmit"
    />

    <BaseConfirmDialog
      v-if="isLeagueLeaveDialogVisible"
      :header="leagueLeaveDialog.header"
      :message="leagueLeaveDialog.message"
      :visible="isLeagueLeaveDialogVisible"
      @hide="handleLeaveDialogHide"
      @submit="handleLeaveDialogSubmit"
    />

    <LeagueEditDialog
      :visible="isLeagueEditDialogVisible"
      :league="selectedLeague"
      @hide="handleEditDialogHide"
      @submit="handleEditDialogSubmit"
    />

    <LeagueDeleteDialog
      :visible="isLeagueDeleteDialogVisible"
      :leagues="[selectedLeague]"
      @hide="handleDeleteDialogHide"
      @submit="handleDeleteDialogSubmit"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import services from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { parseLeagueInput, parseLeague } from '@/helpers/leagues'
import { clone } from 'lodash'
import { pipe, filter, uniqBy, differenceBy } from 'lodash/fp'

import { LEAGUE_MODEL, USERS_LEAGUES_STATUSES } from '@/constants/leagues'

import LeaguesDescriptionList from '@/components/App/Leagues/LeaguesDescriptionList/LeaguesDescriptionList.vue'
import LeagueUsersDialog from '@/components/Shared/Leagues/LeagueUsersDialog/LeagueUsersDialog.vue'
import BaseConfirmDialog from '@/components/Shared/BaseConfirmDialog/BaseConfirmDialog.vue'
import LeagueRankingDialog from '@/components/App/Leagues/LeagueRankingDialog/LeagueRankingDialog.vue'
import LeagueDetailsDialog from '@/components/Shared/Leagues/LeagueDetailsDialog/LeagueDetailsDialog.vue'
import LeagueDeleteDialog from '@/components/Shared/Leagues/LeagueDeleteDialog/LeagueDeleteDialog.vue'
import PendingLeaguesInvitations from './PendingLeaguesInvitations/PendingLeaguesInvitations.vue'

const auth = useAuthStore()
const i18n = useI18n()
const router = useRouter()
const toast = useToast()

// const canManage = ref(false)
const selectedLeague = ref({})
const isLeagueUsersDialogVisible = ref(false)
const isLeagueJoinDialogVisible = ref(false)
const isLeagueLeaveDialogVisible = ref(false)
const isLeagueRankingDialogVisible = ref(false)
const isLeagueDetailsDialogVisible = ref(false)
const isLeagueEditDialogVisible = ref(false)
const isLeagueDeleteDialogVisible = ref(false)

const leagueJoinDialog = computed(() => {
  const message = selectedLeague.value?.private
    ? 'app.leagues.sendRequest'
    : 'app.leagues.joinConfirmation'

  return {
    header: i18n.t('common.confirm'),
    message: i18n.t(message)
  }
})

const pendingLeaguesInvitationsKey = ref(0)

const leagueLeaveDialog = computed(() => ({
  header: i18n.t('common.confirm'),
  message: i18n.t('app.leagues.leaveConfirmation')
}))

const allMyLeagues = ref({
  loading: false,
  data: []
})

const allPublicLeagues = ref({
  loading: false,
  data: []
})

const joinedLeagues = computed(() =>
  pipe(
    filter((league) =>
      league.users.some(
        (user) =>
          user.id === auth.loggedUser?.id &&
          user.status === USERS_LEAGUES_STATUSES.APPROVED
      )
    ),
    uniqBy('id')
  )([...allMyLeagues.value.data, ...allPublicLeagues.value.data])
)

const publicLeagues = computed(() =>
  differenceBy('id', allPublicLeagues.value.data, joinedLeagues.value)
)

const loadLeagues = () => {
  loadMyLeagues()
  loadPublicLeagues()
}

onMounted(() => loadLeagues())

const loadMyLeagues = async () => {
  allMyLeagues.value.loading = true
  allMyLeagues.value.data = await services.leagues.fetchMyLeagues({
    status: USERS_LEAGUES_STATUSES.APPROVED
  })
  allMyLeagues.value.loading = false
}

const loadPublicLeagues = async () => {
  allPublicLeagues.value.loading = true
  allPublicLeagues.value.data = await services.leagues.fetchPublicLeagues()
  allPublicLeagues.value.loading = false
}

const handleUsersDialogHide = () => {
  console.log('oi')
  isLeagueUsersDialogVisible.value = false
}

const handleManageLeague = (league) => {
  selectedLeague.value = league
  // canManage.value = isOwner
  isLeagueUsersDialogVisible.value = true
}

const handleRankingLeague = (league) => {
  selectedLeague.value = league
  // canManage.value = false
  isLeagueRankingDialogVisible.value = true
}

const handleJoinLeague = (league) => {
  selectedLeague.value = league
  isLeagueJoinDialogVisible.value = true
}

const handleJoinDialogHide = () => (isLeagueJoinDialogVisible.value = false)

const handleJoinDialogSubmit = async () => {
  const leagueId = selectedLeague.value.id
  await services.usersLeagues.joinLeague(leagueId)

  loadLeagues()
  pendingLeaguesInvitationsKey.value++

  isLeagueJoinDialogVisible.value = false
}

const handleLeaveLeague = (league) => {
  selectedLeague.value = league
  isLeagueLeaveDialogVisible.value = true
}

const handleLeaveDialogHide = () => (isLeagueLeaveDialogVisible.value = false)

const handleLeaveDialogSubmit = async () => {
  const leagueId = selectedLeague.value.id
  const userId = auth.loggedUser.id

  await services.usersLeagues.deleteUser({ leagueId, userId })

  loadLeagues()

  isLeagueLeaveDialogVisible.value = false
}

const handleGuessesLeague = (league) =>
  router.push({
    name: 'Guesses',
    params: { leagueId: league.id }
  })

const handleCreateLeague = () => {
  selectedLeague.value = clone({
    ...LEAGUE_MODEL,
    ownerId: auth.loggedUser.id
  })
  isLeagueDetailsDialogVisible.value = true
}

const handleEditLeague = async ({ id }) => {
  const league = await services.leagues.fetchLeagueById(id)
  selectedLeague.value = parseLeague(league)
  isLeagueDetailsDialogVisible.value = true
}

const handleLeagueRankingDialogSubmit = () =>
  (isLeagueRankingDialogVisible.value = false)

const handleDetailsDialogHide = () => {
  selectedLeague.value = {}
  isLeagueDetailsDialogVisible.value = false
}

const handleDetailsDialogSubmit = async (league) => {
  const parsedLeague = parseLeagueInput(league)

  parsedLeague.id
    ? await services.leagues.updateLeague(parsedLeague)
    : await services.leagues.createLeague(parsedLeague)

  toast.add({
    severity: 'success',
    summary: i18n.t('common.success'),
    detail: i18n.t('admin.leagues.saveSuccess'),
    life: 4000
  })

  handleDetailsDialogHide()
  loadLeagues()
}

const handleRemoveLeague = (league) => {
  selectedLeague.value = league
  isLeagueDeleteDialogVisible.value = true
}

const handleDeleteDialogHide = () => (isLeagueDeleteDialogVisible.value = false)

const handleDeleteDialogSubmit = async ([league]) => {
  try {
    await services.leagues.deleteLeague(league)

    toast.add({
      severity: 'success',
      summary: i18n.t('common.success'),
      detail: i18n.t('admin.leagues.deleteSuccess'),
      life: 4000
    })

    handleDeleteDialogHide()
    loadLeagues()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: i18n.t('common.error'),
      detail: i18n.t('admin.leagues.error.delete'),
      life: 3000,
      group: 'app'
    })
  }
}
</script>
