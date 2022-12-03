<template>
  <BaseDialog
    :visible="visible"
    :header="$t('app.guesses.copyToLeague', { leagueName: league.name })"
    type="dynamic"
    @submit="handleSubmit"
    @hide="handleHide"
  >
    <CopyGuessesDialogContent
      v-model="copyGuesses"
      :league-id="league.id"
      :championships="championships"
    />
    <template #footer>
      <Button
        :label="$t('common.cancel')"
        icon="pi pi-times"
        class="p-button-text"
        @click="handleHide"
      />
      <Button
        :label="$t('app.guesses.copy')"
        icon="pi pi-copy"
        class="p-button-text"
        :disabled="isSubmitDisabled"
        @click="handleSubmit"
      />
    </template>
  </BaseDialog>
</template>

<script setup>
import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'
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
const handleHide = () => emits('hide')

const isSubmitDisabled = computed(
  () => copyGuesses.value.championshipsIds.length === 0
)
</script>
