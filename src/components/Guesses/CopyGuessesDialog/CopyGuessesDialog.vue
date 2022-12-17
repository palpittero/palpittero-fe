<template>
  <Modal
    target="copy-guesses-dialog"
    :ok-button-text="$t('app.guesses.copy')"
    :ok-button-class="{ disabled: isSubmitDisabled }"
    :cancel-button-text="$t('common.cancel')"
    :visible="visible"
    :header="$t('app.guesses.copyToLeague', { leagueName: league.name })"
    @hide="handleClose"
    @submit="handleSubmit"
  >
    <CopyGuessesDialogContent
      v-model="copyGuesses"
      :league-id="league.id"
      :championships="championships"
    />
  </Modal>
</template>

<script setup>
import Modal from '@/components/Common/Modal/Modal.vue'
import CopyGuessesDialogContent from './CopyGuessesDialogContent/CopyGuessesDialogContent.vue'
import { computed, ref } from 'vue'

const props = defineProps({
  league: {
    type: Object,
    required: true
  },
  championships: {
    type: Array,
    required: () => []
  },
  visible: Boolean
})

const emits = defineEmits(['submit', 'hide'])
const copyGuesses = ref({
  sourceLeagueId: props.league.id,
  targetLeagueId: null,
  championshipsIds: [],
  copyMatchesGuesses: false,
  copyChampionshipsGuesses: false
})

const handleSubmit = () => emits('submit', copyGuesses.value)
const handleClose = () => emits('hide')

const isSubmitDisabled = computed(
  () => copyGuesses.value.championshipsIds.length === 0
)
</script>
