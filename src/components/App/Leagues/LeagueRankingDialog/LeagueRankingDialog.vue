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
        <Column
          field="points"
          :header="$t('admin.users.points')"
          headerStyle="width:15%; min-width:12rem;"
        >
          <template #body="{ data }">
            <div class="text-bold">
              {{ $t('common.total') }}: {{ data.points }}
            </div>
            <div>
              <small>
                {{ $t('common.matches') }}: {{ data.guessesPoints }}
              </small>
            </div>
            <div>
              <small
                >{{ $t('common.positions') }}:
                {{ data.championshipsGuessesPoints }}</small
              >
            </div>
          </template>
        </Column>
        <Column field="prize" :header="$t('admin.leagues.prizes')">
          <template #body="{ data }"> {{ getLeaguePrize(data) }} </template>
        </Column>
      </DataTable>
    </BaseDataRenderer>
  </BaseDialog>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
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

const leagueUsers = ref({
  loading: false,
  error: null,
  data: []
})

onMounted(() => loadUsersLeagues())

const loadUsersLeagues = async () => {
  leagueUsers.value.loading = true
  leagueUsers.value.data = await services.leagues.fetchUsers({
    league: props.league,
    status: USERS_LEAGUES_STATUSES.APPROVED
  })
  leagueUsers.value.loading = false
}

const emits = defineEmits(['submit'])

const header = computed(() =>
  i18n.t('app.leagues.rankingLeague', { league: props.league.name })
)

const handleSubmit = () => emits('submit')

const medals = ['🥇', '🥈', '🥉']

const getRankingPosition = (user) =>
  leagueUsers.value.data.findIndex(({ id }) => id === user.id) + 1

const getRankingPositionLabel = (user) => {
  const showMedal = leagueUsers.value.data.some(({ points }) => points > 0)
  const position = getRankingPosition(user)

  return showMedal ? medals[position - 1] || position : '-'
}

const getRankingPositionClass = (user) => {
  const positionLabel = getRankingPositionLabel(user)

  return [
    !medals.includes(positionLabel) && 'league-ranking-dialog__position--number'
  ]
}

const getLeaguePrize = (user) => {
  if (!props.league.enablePrizes || !user.points) {
    return '-'
  }

  const ticketValue = parseFloat(props.league.ticketValue)

  if (ticketValue <= 0) {
    return '-'
  }

  const rankingPosition = getRankingPosition(user)
  const leaguePrize = props.league.prizes.find(
    ({ position }) => position == rankingPosition
  )

  if (!leaguePrize) {
    return '-'
  }

  const prizeValue =
    (ticketValue *
      leagueUsers.value.data.length *
      parseFloat(leaguePrize.amount)) /
    100

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(prizeValue)
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
