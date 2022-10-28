<template>
  <BaseDialog
    :visible="visible"
    :disabled="disabled"
    :header="$t('common.confirm')"
    modal
    @hide="handleHide"
    @submit="handleSubmit"
  >
    <p v-html="$t('admin.leagues.inviteUsersConfirmation', { leagueName })" />
    <p>
      <b v-html="usersNames" />
    </p>
  </BaseDialog>
</template>

<script setup>
import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'
import { computed } from 'vue'

const props = defineProps({
  users: {
    type: Array,
    default: () => []
  },
  league: {
    type: Object,
    required: true
  },
  visible: Boolean,
  disabled: Boolean
})

const emits = defineEmits(['hide', 'submit'])

const usersNames = computed(() =>
  props.users.map(({ name }) => name).join('<br />')
)
const leagueName = computed(() => props.league.name)

const handleHide = () => emits('hide')
const handleSubmit = () => emits('submit', props.users)
</script>
