<template>
  <div>
    <div class="flex justify-content-between align-items-center mb-3">
      <h1 class="mb-0">
        {{ $t('common.leagues') }}
      </h1>
      <Button @click="handleCreateLeague">
        {{ $t('app.leagues.create') }}
      </Button>
    </div>
    <LeaguesDescriptionList
      :leagues="myLeagues.data"
      :loading="myLeagues.loading"
      :title="$t('app.leagues.myLeagues.title')"
      :description="$t('app.leagues.myLeagues.description')"
      :empty-state="$t('app.leagues.noJoinedLeagues')"
      @manage="handleManageLeague"
      @ranking="handleRankingLeague"
      @leave="handleLeaveLeague"
      @guesses="handleGuessesLeague"
    />
    <LeaguesDescriptionList
      :leagues="publicLeagues"
      :loading="publicLeagues.loading"
      :title="$t('app.leagues.publicLeagues.title')"
      :description="$t('app.leagues.publicLeagues.description')"
      :empty-state="$t('app.leagues.noPublicLeaguesFound')"
      @manage="handleManageLeague"
      @ranking="handleRankingLeague"
      @join="handleJoinLeague"
    />

    <LeagueUsersDialog
      v-if="isLeagueUsersDialogVisible"
      :league="selectedLeague"
      :visible="isLeagueUsersDialogVisible"
      :can-manage="canManage"
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
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import differenceBy from 'lodash/fp/differenceBy'
import services from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import LeaguesDescriptionList from '@/components/App/Leagues/LeaguesDescriptionList/LeaguesDescriptionList.vue'
import LeagueUsersDialog from '@/components/Shared/Leagues/LeagueUsersDialog/LeagueUsersDialog.vue'
import BaseConfirmDialog from '@/components/Shared/BaseConfirmDialog/BaseConfirmDialog.vue'

const authStore = useAuthStore()
const i18n = useI18n()
const router = useRouter()

const canManage = ref(false)
const selectedLeague = ref({})
const isLeagueUsersDialogVisible = ref(false)
const isLeagueJoinDialogVisible = ref(false)
const isLeagueLeaveDialogVisible = ref(false)

const leagueJoinDialog = computed(() => {
  const message = selectedLeague.value?.private
    ? 'app.leagues.sendRequest'
    : 'app.leagues.joinConfirmation'

  return {
    header: i18n.t('common.confirm'),
    message: i18n.t(message)
  }
})

const leagueLeaveDialog = computed(() => ({
  header: i18n.t('common.confirm'),
  message: i18n.t('app.leagues.leaveConfirmation')
}))

const myLeagues = reactive({
  loading: false,
  data: []
})

const allPublicLeagues = reactive({
  loading: false,
  data: []
})

const publicLeagues = computed(() =>
  differenceBy('id', allPublicLeagues.data, myLeagues.data)
)

const isOwner = computed(() =>
  selectedLeague.value.users?.find(
    ({ id, owner }) => id === authStore.loggedUser.id && owner
  )
)

onMounted(() => {
  loadMyLeagues()
  loadPublicLeagues()
})

const loadMyLeagues = async () => {
  myLeagues.loading = true
  myLeagues.data = await services.leagues.fetchMyLeagues()
  myLeagues.loading = false
}

const loadPublicLeagues = async () => {
  allPublicLeagues.loading = true
  allPublicLeagues.data = await services.leagues.fetchPublicLeagues()
  allPublicLeagues.loading = false
}

const handleUsersDialogHide = () => (isLeagueUsersDialogVisible.value = false)

const handleManageLeague = (league) => {
  selectedLeague.value = league
  canManage.value = isOwner
  isLeagueUsersDialogVisible.value = true
}

const handleRankingLeague = (league) => {
  selectedLeague.value = league
  canManage.value = false
  isLeagueUsersDialogVisible.value = true
}

const handleJoinLeague = (league) => {
  selectedLeague.value = league
  isLeagueJoinDialogVisible.value = true
}

const handleJoinDialogHide = () => (isLeagueJoinDialogVisible.value = false)

const handleJoinDialogSubmit = async () => {
  const leagueId = selectedLeague.value.id
  const users = [{ id: authStore.loggedUser.id }]

  await services.usersLeagues.inviteUsers({ leagueId, users })

  loadMyLeagues()
  loadPublicLeagues()

  isLeagueJoinDialogVisible.value = false
}

const handleLeaveLeague = (league) => {
  selectedLeague.value = league
  isLeagueLeaveDialogVisible.value = true
}

const handleLeaveDialogHide = () => (isLeagueLeaveDialogVisible.value = false)

const handleLeaveDialogSubmit = async () => {
  const leagueId = selectedLeague.value.id
  const userId = authStore.loggedUser.id

  await services.usersLeagues.deleteUser({ leagueId, userId })

  loadMyLeagues()
  loadPublicLeagues()

  isLeagueLeaveDialogVisible.value = false
}

const handleGuessesLeague = (league) =>
  router.push({
    name: 'Guesses',
    params: { leagueId: league.id }
  })

const handleCreateLeague = () => console.log('should create league')
</script>
