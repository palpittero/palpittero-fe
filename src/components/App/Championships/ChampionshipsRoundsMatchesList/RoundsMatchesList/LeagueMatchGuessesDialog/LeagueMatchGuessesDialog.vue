<template>
  <BaseDialog
    :visible="visible"
    :header="header"
    type="dynamic"
    cancel-button-class="hidden"
    @hide="emits('hide')"
    @submit="emits('hide')"
  >
    <UserMatchGuesses
      :league-id="leagueId"
      :match-id="matchId"
      @ready="onUserMatchGuessesReady"
    />
  </BaseDialog>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'
import UserMatchGuesses from '@/components/Guesses/UserMatchGuesses/UserMatchGuesses.vue'

const i18n = useI18n()

defineProps({
  leagueId: {
    type: Number,
    required: true
  },
  matchId: {
    type: Number,
    required: true
  },
  visible: Boolean
})

const emits = defineEmits(['hide'])

const header = ref('')

const onUserMatchGuessesReady = ({ league, match }) => {
  header.value = `${league.name} - ${match.homeTeam.name} x ${
    match.awayTeam.name
  } - ${i18n.t('app.guesses.otherGuesses')}`
}
</script>
