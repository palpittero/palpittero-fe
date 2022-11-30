<template>
  <BaseDialog
    :visible="visible"
    :header="header"
    type="dynamic"
    cancel-button-class="hidden"
    @hide="emits('hide')"
    @submit="emits('hide')"
  >
    <UserChampionshipGuesses
      :league-id="leagueId"
      :championship-id="championshipId"
      @ready="onUserChampionshipGuessesReady"
    />
  </BaseDialog>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'
import UserChampionshipGuesses from '@/components/Guesses/UserChampionshipGuesses/UserChampionshipGuesses.vue'

const i18n = useI18n()

defineProps({
  leagueId: {
    type: Number,
    required: true
  },
  championshipId: {
    type: Number,
    required: true
  },
  visible: Boolean
})

const emits = defineEmits(['hide'])

const header = ref('')

const onUserChampionshipGuessesReady = ({ league }) =>
  (header.value = `${league.name} - ${i18n.t('app.guesses.otherGuesses')}`)
</script>
