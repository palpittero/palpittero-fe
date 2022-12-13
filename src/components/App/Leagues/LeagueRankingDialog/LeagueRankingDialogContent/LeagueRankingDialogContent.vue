<template>
  <BaseDataRenderer :state="leagueUsers">
    <template #loading>
      <div class="vstack gap-3 placeholder-glow">
        <span class="placeholder p-3" />
        <span class="placeholder p-3" />
        <span class="placeholder p-3" />
      </div>
    </template>
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr class="d-none d-lg-table-row">
            <th scope="col">
              {{ $t('app.leagues.player') }}
            </th>
            <th scope="col" class="d-none d-lg-table-cell text-center">
              {{ $t('app.leagues.points') }}
            </th>
            <th scope="col" class="d-none d-lg-table-cell">
              {{ $t('app.leagues.prize') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="leagueUser in leagueUsers.data" :key="leagueUser.id">
            <td scope="row">
              <div class="hstack gap-3">
                {{ getRankingPosition(leagueUser) }}
                <Avatar :img="leagueUser.avatar" size="xs" />
                <span class="hstack gap-2">
                  <span class="d-flex flex-column flex-lg-row">
                    {{ leagueUser.name }}
                    <span class="d-md-block d-lg-none text-bold">
                      {{
                        $t('app.guesses.points', leagueUser, leagueUser.points)
                      }}
                    </span>
                    <small class="d-md-block d-lg-none">
                      {{ $t('app.leagues.prize') }}:
                      {{ getLeaguePrize(leagueUser) }}
                    </small>
                  </span>
                  <font-awesome-icon
                    icon="fas fa-id-card"
                    v-if="leagueUser.owner"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-custom-class="custom-tooltip"
                    :data-bs-title="$t('admin.leagues.leagueOwner')"
                  />
                </span>
              </div>
            </td>
            <td class="d-none d-lg-table-cell text-center">
              {{ leagueUser.points }}
            </td>
            <td class="d-none d-lg-table-cell">
              {{ getLeaguePrize(leagueUser) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </BaseDataRenderer>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import services from '@/services'

// import Modal from '@/components/Common/Modal/Modal.vue'
// import DataTable from '@/components/Shared/DataTable/DataTable.vue'
// import BadgeAvatar from '@/components/Shared/BadgeAvatar/BadgeAvatar.vue'
import Avatar from '@/components/Shared/Avatar/Avatar.vue'
import BaseDataRenderer from '@/components/Shared/BaseDataRenderer/BaseDataRenderer.vue'
import * as bootstrap from 'bootstrap'

import { USERS_LEAGUES_STATUSES } from '@/constants/leagues'

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

onMounted(async () => {
  await loadUsersLeagues()

  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  )

  Array.from(tooltipTriggerList).map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  )
})

const loadUsersLeagues = async () => {
  leagueUsers.value.loading = true
  leagueUsers.value.data = await services.leagues.fetchUsers({
    league: props.league,
    status: USERS_LEAGUES_STATUSES.APPROVED
  })
  leagueUsers.value.loading = false
}

// const emits = defineEmits(['submit'])

// const header = computed(() =>
//   i18n.t('app.leagues.rankingLeague', { league: props.league.name })
// )

// const handleSubmit = () => emits('submit')

const medals = ['🥇', '🥈', '🥉']

const getRankingPosition = (user) =>
  leagueUsers.value.data.findIndex(({ id }) => id === user.id) + 1

const getRankingPositionLabel = (user) => {
  const showMedal = leagueUsers.value.data.some(({ points }) => points > 0)
  const position = getRankingPosition(user)
  console.log(position)

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
