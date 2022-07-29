<template>
  <BaseDialog
    :visible="visible"
    :style="{ width: '55vw' }"
    :header="$t('common.users')"
    modal
    :ok-button-class="okButtonClass"
    @submit="handleSubmit"
    @hide="handleHide"
  >
    <LeagueUsersDialogContent
      v-model="users"
      :league="league"
      :can-manage="canManage"
    />
  </BaseDialog>
</template>

<script setup>
import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'
import LeagueUsersDialogContent from './LeagueUsersDialogContent/LeagueUsersDialogContent.vue'
import { computed, reactive } from 'vue'

const props = defineProps({
  league: {
    type: Object,
    required: true
  },
  visible: Boolean,
  canManage: Boolean
})

const users = reactive([])

const emits = defineEmits(['hide', 'submit'])

const okButtonClass = computed(() => !props.canManage && 'hidden')

const handleSubmit = () => emits('submit', users)
const handleHide = () => emits('hide', users)
</script>
