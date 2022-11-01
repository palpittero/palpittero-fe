<template>
  <div
    class="px-4 py-5 shadow-2 flex flex-column md:flex-row md:align-items-center justify-content-between mb-3 pending-leagues-invitations"
  >
    <div>
      <div class="text-white font-medium text-5xl">
        {{ $t('app.leagues.pendingInvitations.title', { total }, total) }}
      </div>
    </div>
    <div class="mt-4 mr-auto md:mt-0 md:mr-0">
      <a
        @click="handleViewPendingLeaguesInvitations"
        class="p-button font-bold px-5 py-3 p-button-warning p-button-rounded p-button-raised"
      >
        {{ $t('app.leagues.pendingInvitations.cta') }}
      </a>
    </div>
  </div>

  <PendingLeaguesInvitationsDialog
    :header="$t('app.leagues.pendingInvitations.header')"
    :visible="isPendingLeaguesInvitationsDialogOpen"
    :loading="isLoading"
    :leagues="leaguesInvitations"
    @hide="handlePendingLeaguesInvitationsDialogHide"
    @submit="handlePendingLeaguesInvitationsDialogSubmit"
  />
</template>

<script setup>
import { computed, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import services from '@/services'

import PendingLeaguesInvitationsDialog from './PendingLeaguesInvitationsDialog/PendingLeaguesInvitationsDialog.vue'
// import { USERS_LEAGUES_STATUSES } from '@/constants/leagues'

const toast = useToast()
const i18n = useI18n()

const props = defineProps({
  leaguesInvitations: {
    type: Array,
    default: () => []
  }
  // total: {
  //   type: Number,
  //   default: 0
  // }
})

const emits = defineEmits(['refresh'])

// const leagues = ref({
//   loading: false,
//   error: null,
//   data: []
// })

const isLoading = ref(false)
const isPendingLeaguesInvitationsDialogOpen = ref(false)

// const loadPendingInvitations = async () => {
//   leagues.value.loading = true
//   leagues.value.data = await services.leagues.fetchMyLeagues({
//     status: USERS_LEAGUES_STATUSES.INVITED
//   })
//   leagues.value.loading = false
// }

// onMounted(loadPendingInvitations)

const handleViewPendingLeaguesInvitations = () =>
  (isPendingLeaguesInvitationsDialogOpen.value = true)

const handlePendingLeaguesInvitationsDialogHide = () =>
  (isPendingLeaguesInvitationsDialogOpen.value = false)

const total = computed(() => props.leaguesInvitations.length)

const handlePendingLeaguesInvitationsDialogSubmit = async (invitations) => {
  isLoading.value = true

  await services.usersLeagues.updateInvitations(invitations)
  toast.add({
    group: 'app',
    severity: 'success',
    summary: i18n.t('common.success'),
    detail: i18n.t('app.leagues.pendingInvitations.updateSuccess'),
    life: 4000
  })

  emits('refresh')
  isLoading.value = false
  handlePendingLeaguesInvitationsDialogHide()
}
</script>

<style lang="scss" scoped>
.pending-leagues-invitations {
  & {
    border-radius: 1rem;
    background: linear-gradient(
        0deg,
        rgba(0, 123, 255, 0.5),
        rgba(0, 123, 255, 0.5)
      ),
      linear-gradient(92.54deg, #1c80cf 47.88%, #ffffff 100.01%);
  }
}
</style>
