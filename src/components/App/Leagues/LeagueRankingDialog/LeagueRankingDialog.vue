<template>
  <BaseDialog
    :visible="visible"
    :header="header"
    cancel-button-class="hidden"
    modal
    @hide="handleSubmit"
    type="dynamic"
    @submit="handleSubmit"
  >
    <BaseDataRenderer :state="leagueUsers">
      <DataTable
        class="league-ranking-dialog__data-table"
        :value="leagueUsers.data"
        :loading="leagueUsers.loading"
        responsiveLayout="scroll"
      >
        <!-- <Column
          :header="$t('app.leagues.position')"
          headerStyle="width:10%; min-width:5rem;"
        >
          <template #body="{ data }">
            <span v-if="showMedal">
              {{ getRankingMedal(data) }}
            </span></template
          >
        </Column> -->
        <Column
          field="name"
          :header="`${$t('app.leagues.position')} / ${$t('admin.users.name')}`"
        >
          <template #body="{ data }">
            <div class="flex align-items-center gap-2">
              <span :class="getRankingPositionClass(data)">
                {{ getRankingPosition(data) }}
              </span>
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

const medals = ['🥇', '🥈', '🥉']

const getRankingPosition = (user) => {
  const showMedal = leagueUsers.data.some(({ points }) => points > 0)
  const index = leagueUsers.data.findIndex(({ id }) => id === user.id)

  return showMedal ? medals[index] || index + 1 : '-'
}

const getRankingPositionClass = (user) => {
  const position = getRankingPosition(user)

  return [
    !medals.includes(position) && 'league-ranking-dialog__position--number'
  ]
}
</script>

<style lang="scss">
.league-ranking-dialog {
  &__position {
    &--number {
      width: 8px;
      height: 8px;
      background: transparent;
      text-align: center;
      border-radius: 50%;
      padding: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
