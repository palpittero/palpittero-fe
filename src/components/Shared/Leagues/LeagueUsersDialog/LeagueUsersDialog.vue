<template>
  <BaseDialog
    :visible="visible"
    :header="$t('app.leagues.leagueUsers', { leagueName: league.name })"
    modal
    @submit="handleSubmit"
    @hide="handleHide"
    type="dynamic"
  >
    <LeagueUsersDialogContent v-model="users" :league="league" />

    <template #footer>
      <slot name="footer">
        <Button
          label="Ok"
          icon="pi pi-check"
          class="p-button-text"
          @click="handleHide"
        />
      </slot>
    </template>
  </BaseDialog>
</template>

<script setup>
import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'
import LeagueUsersDialogContent from './LeagueUsersDialogContent/LeagueUsersDialogContent.vue'
import { reactive } from 'vue'

defineProps({
  league: {
    type: Object,
    required: true
  },
  visible: Boolean
})

const users = reactive([])

const emits = defineEmits(['hide', 'submit'])

const handleSubmit = () => emits('submit', users)
const handleHide = () => emits('hide', users)
</script>
