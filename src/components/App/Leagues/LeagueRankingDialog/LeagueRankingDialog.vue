<template>
  <Modal
    target="league-ranking-dialog"
    cancel-button-class="d-none"
    :ok-button-text="$t('common.ok')"
    :visible="visible"
    :header="header"
    @hide="handleClose"
    @submit="handleClose"
  >
    <LeagueRankingDialogContent :league="league" />
  </Modal>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import Modal from '@/components/Common/Modal/Modal.vue'
import LeagueRankingDialogContent from './LeagueRankingDialogContent/LeagueRankingDialogContent.vue'

const i18n = useI18n()

const props = defineProps({
  league: {
    type: Object,
    required: true
  },
  visible: Boolean
})

const emits = defineEmits(['hide'])

const header = computed(() =>
  i18n.t('app.leagues.rankingLeague', { league: props.league.name })
)

const handleClose = () => emits('hide')
</script>
