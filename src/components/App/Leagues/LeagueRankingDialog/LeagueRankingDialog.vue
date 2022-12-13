<template>
  <Modal
    :visible="visible"
    :header="header"
    cancel-button-class="hidden"
    target="league-ranking-dialog"
    @hide="handleSubmit"
    @submit="handleSubmit"
  >
    <LeagueRankingDialogContent :league="league" />
  </Modal>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
// import services from '@/services'

import Modal from '@/components/Common/Modal/Modal.vue'
// import BaseDataRenderer from '@/components/Shared/BaseDataRenderer/BaseDataRenderer.vue'
// import { USERS_LEAGUES_STATUSES } from '@/constants/leagues'
import LeagueRankingDialogContent from './LeagueRankingDialogContent/LeagueRankingDialogContent.vue'
// import BadgeAvatar from '@/components/Shared/BadgeAvatar/BadgeAvatar.vue'

const i18n = useI18n()

const props = defineProps({
  league: {
    type: Object,
    required: true
  },
  visible: Boolean
})

const emits = defineEmits(['submit'])

const header = computed(() =>
  i18n.t('app.leagues.rankingLeague', { league: props.league.name })
)

const handleSubmit = () => emits('submit')
</script>
