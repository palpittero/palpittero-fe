<template>
  <BaseDialog
    :visible="visible"
    :header="$t('common.confirm')"
    modal
    @submit="handleSubmit"
    @hide="handleHide"
  >
    <div class="flex align-items-center">
      <i class="pi pi-sign-in mr-3" style="font-size: 2rem" />
      <span v-html="message" />
    </div>
    <template #footer>
      <Button
        :label="$t('common.no')"
        icon="pi pi-times"
        class="p-button-text"
        @click="handleHide"
      />
      <Button
        :label="$t('common.yes')"
        icon="pi pi-check"
        class="p-button-text"
        @click="handleSubmit"
      />
    </template>
  </BaseDialog>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'

const i18n = useI18n()

const props = defineProps({
  league: {
    type: Object,
    required: true
  },
  visible: Boolean
})

const emits = defineEmits(['submit', 'hide'])

const message = computed(() => {
  const leagueName = props.league.name
  const message = props.league.private
    ? 'app.leagues.sendRequest'
    : 'app.leagues.joinConfirmation'

  return i18n.t(message, { leagueName })
})

const handleSubmit = () => emits('submit', props.league)
const handleHide = () => emits('hide')
</script>
