<template>
  <BaseDialog
    :visible="visible"
    :style="{ width: '55vw' }"
    :header="$t('common.users')"
    modal
    @submit="handleSubmit"
    @hide="handleHide"
  >
    <LeagueUsersDialogContent v-model="users" :league="league" />
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
