<template>
  <div>
    <div class="mb-3 flex flex-column md:flex-row gap-2">
      <UsersChips
        v-model="selectedUsers"
        :not-allowed="excludedUsers"
        :selected="excludedUsers"
        class="flex-4"
      />
      <Button
        icon="pi pi-plus"
        :label="$t('admin.leagues.inviteUsers')"
        class="p-button-primary align-self-start"
        @click="handleAddUsers"
        :disabled="selectedUsers.length === 0"
      />
    </div>
    <BaseDataRenderer :state="leagueUsers">
      <DataTable :value="leagueUsers.data" :loading="leagueUsers.loading">
        <Column field="name" :header="$t('admin.users.name')">
          <template #body="{ data }">
            <div class="flex align-items-center gap-2">
              <BadgeAvatar :image="data.avatar" size="small" type="user" />
              <span class="mr-2">
                {{ data.name || $t('admin.users.userNotRegistered') }}
              </span>
              <span
                class="pi pi-id-card"
                v-show="isOwner(data)"
                v-tooltip.top="$t('admin.leagues.leagueOwner')"
              />
            </div>
          </template>
        </Column>
        <Column field="email" :header="$t('admin.users.email')" />
        <Column field="status" :header="$t('common.status')">
          <template #body="{ data }">
            <BaseStatus :status="data.status" :options="STATUSES" />
            <div v-if="hasSentInvitation(data.status)">
              <ConfirmPopup />
              <ConfirmPopup group="demo">
                <template #message="slotProps">
                  <div class="flex p-4">
                    <i
                      :class="slotProps.message.icon"
                      style="font-size: 1.5rem"
                    ></i>
                    <p class="pl-2">{{ slotProps.message.message }}</p>
                  </div>
                </template>
              </ConfirmPopup>
              <Button
                @click="handleApproveUser($event, data)"
                icon="pi pi-check"
                :label="$t('app.leagues.pendingInvitations.approve')"
                class="p-button-text p-button-clear p-button-success p-button-small px-0"
              />
            </div>
            <!-- <Button
              v-if="hasSentInvitation(data.status)"
              @click="handleApproveUser(data)"
              class="p-button-text p-button-clear p-button-success p-button-small px-0"
              icon="pi pi-check"
              :label="$t('app.leagues.pendingInvitations.approve')"
            >
            </Button> -->
          </template>
        </Column>
      </DataTable>
    </BaseDataRenderer>

    <LeagueUserAddDialog
      :users="selectedUsers"
      :league="league"
      :visible="isLeagueUserAddDialogVisible"
      :disabled="isSubmitting"
      @hide="handleLeagueUserAddHide"
      @submit="handleLeagueUserAddSubmit"
    />

    <LeagueUserDeleteDialog
      :user="user"
      :league="league"
      :visible="isLeagueUserDeleteDialogVisible"
      :disabled="isSubmitting"
      @hide="handleLeagueUserDeleteHide"
      @submit="handleLeagueUserDeleteSubmit"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useI18n } from 'vue-i18n'
import services from '@/services'

import BaseDataRenderer from '@/components/Shared/BaseDataRenderer/BaseDataRenderer.vue'
import BaseStatus from '@/components/Shared/BaseStatus/BaseStatus.vue'
import UsersChips from '@/components/Shared/Users/UsersChips/UsersChips.vue'
import LeagueUserDeleteDialog from './LeagueUserDeleteDialog/LeagueUserDeleteDialog.vue'
import LeagueUserAddDialog from './LeagueUserAddDialog/LeagueUserAddDialog.vue'

import {
  USERS_LEAGUES_STATUSES_LABELS,
  LEAGUES_INVITATIONS_STATUSES_LABELS,
  USERS_LEAGUES_STATUSES
} from '@/constants/leagues'
import BadgeAvatar from '@/components/Shared/BadgeAvatar/BadgeAvatar.vue'

const toast = useToast()
const confirm = useConfirm()
const i18n = useI18n()

const STATUSES = {
  ...USERS_LEAGUES_STATUSES_LABELS,
  ...LEAGUES_INVITATIONS_STATUSES_LABELS
}

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  league: {
    type: Object,
    required: true
  }
})

const leagueUsers = reactive({
  loading: false,
  error: null,
  data: []
})

const isSubmitting = ref(false)
const selectedUsers = ref([])
const user = ref({})
const isLeagueUserAddDialogVisible = ref(false)

onMounted(async () => loadUsersLeagues())

const loadUsersLeagues = async () => {
  leagueUsers.loading = true
  leagueUsers.data = await services.leagues.fetchUsers({ league: props.league })
  leagueUsers.loading = false
}

const ownerId = computed(
  () => props.league.users.find(({ owner }) => owner)?.id
)

const isOwner = (user) => user.owner

const handleAddUsers = () => (isLeagueUserAddDialogVisible.value = true)

const handleLeagueUserAddHide = () =>
  (isLeagueUserAddDialogVisible.value = false)

const handleLeagueUserAddSubmit = async (users) => {
  isSubmitting.value = true
  await services.usersLeagues.inviteUsers({
    leagueId: props.league.id,
    users: users
  })
  isLeagueUserAddDialogVisible.value = false
  isSubmitting.value = false

  toast.add({
    group: 'app',
    severity: 'success',
    summary: i18n.t('common.success'),
    detail: i18n.t('admin.leagues.inviteUsersSuccess'),
    life: 4000
  })
  selectedUsers.value = []
  loadUsersLeagues()
}

const hasSentInvitation = (status) => status === USERS_LEAGUES_STATUSES.INVITED

const handleApproveUser = (event, user) => {
  const { id: leagueId } = props.league

  confirm.require({
    target: event.currentTarget,
    message: i18n.t('app.leagues.approveUserConfirmation'),
    icon: 'pi pi-check',
    accept: async () => {
      const users = [
        {
          id: user.id,
          status: USERS_LEAGUES_STATUSES.APPROVED
        }
      ]

      await services.usersLeagues.approveUsers({ leagueId, users })

      toast.add({
        group: 'app',
        severity: 'success',
        summary: i18n.t('common.success'),
        detail: i18n.t('app.leagues.approveUsersSuccess'),
        life: 4000
      })

      loadUsersLeagues()
    },
    reject: () => {}
  })
}
const excludedUsers = computed(() => [
  ownerId.value,
  ...leagueUsers.data.map(({ id }) => id)
])
</script>
