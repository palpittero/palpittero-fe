<template>
  <BaseDialog
    :visible="visible"
    :style="{ width: '55vw' }"
    :header="header"
    cancel-button-class="hidden"
    modal
    @hide="handleSubmit"
    @submit="handleSubmit"
  >
    <BaseDataRenderer :state="leagueUsers">
      <DataTable :value="leagueUsers.data" :loading="leagueUsers.loading">
        <Column field="name" :header="$t('admin.users.name')">
          <template #body="{ data }">
            <div class="flex align-items-center gap-2">
              <BadgeAvatar
                shape="circle"
                size="small"
                :image="data.avatar"
                type="user"
              />
              <span class="mr-2">
                {{ data.name }}
              </span>
              <span
                class="pi pi-id-card"
                v-show="data.owner"
                v-tooltip.top="$t('admin.leagues.leagueOwner')"
              />
            </div>
          </template>
        </Column>
        <Column field="points" :header="$t('admin.users.points')" />
      </DataTable>
    </BaseDataRenderer>
  </BaseDialog>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import services from '@/services'

import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'
import BaseDataRenderer from '@/components/Shared/BaseDataRenderer/BaseDataRenderer.vue'
import { USERS_LEAGUES_STATUSES } from '@/constants/leagues'
import BadgeAvatar from '@/components/Shared/BadgeAvatar/BadgeAvatar.vue'

const i18n = useI18n()

const props = defineProps({
  league: {
    type: Object,
    required: true
  },
  visible: Boolean
})

const leagueUsers = reactive({
  loading: false,
  error: null,
  data: []
})

onMounted(() => loadUsersLeagues())

const loadUsersLeagues = async () => {
  leagueUsers.loading = true
  leagueUsers.data = await services.leagues.fetchUsers({
    league: props.league,
    status: USERS_LEAGUES_STATUSES.APPROVED
  })
  leagueUsers.loading = false
}

const emits = defineEmits(['submit'])

const header = computed(() =>
  i18n.t('app.leagues.rankingLeague', { league: props.league.name })
)

const handleSubmit = () => emits('submit')
</script>
