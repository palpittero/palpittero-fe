<template>
  <div>
    <!-- <pre>{{ STATUSES }}</pre> -->
    <div class="mb-3 flex gap-2">
      <!-- <UsersSelect
        v-model="selectedUsers"
        :filter-ids="filteredUsersIds"
        class-name="flex-1"
      /> -->

      <UsersChips
        v-model="selectedUsers"
        :not-allowed="[ownerId]"
        @not-allowed="handleNotAllowed"
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
import { useI18n } from 'vue-i18n'
import services from '@/services'

import BaseDataRenderer from '@/components/Shared/BaseDataRenderer/BaseDataRenderer.vue'
import BaseStatus from '@/components/Shared/BaseStatus/BaseStatus.vue'
import UsersChips from '@/components/Shared/Users/UsersChips/UsersChips.vue'
import LeagueUserDeleteDialog from './LeagueUserDeleteDialog/LeagueUserDeleteDialog.vue'
import LeagueUserAddDialog from './LeagueUserAddDialog/LeagueUserAddDialog.vue'

import {
  USERS_LEAGUES_STATUSES_LABELS,
  LEAGUES_INVITATIONS_STATUSES_LABELS
} from '@/constants/leagues'
import BadgeAvatar from '@/components/Shared/BadgeAvatar/BadgeAvatar.vue'

const toast = useToast()
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

const handleLeagueUserAddSubmit = async (selectedUsers) => {
  isSubmitting.value = true
  await services.usersLeagues.inviteUsers({
    leagueId: props.league.id,
    users: selectedUsers
  })
  isLeagueUserAddDialogVisible.value = false
  isSubmitting.value = false

  toast.add({
    severity: 'success',
    summary: i18n.t('common.success'),
    detail: i18n.t('admin.leagues.inviteUsersSuccess'),
    life: 4000
  })
  selectedUsers = []
  loadUsersLeagues()
}
</script>
