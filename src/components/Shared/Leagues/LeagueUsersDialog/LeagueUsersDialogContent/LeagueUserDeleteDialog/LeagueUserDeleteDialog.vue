<template>
  <BaseDialog
    :visible="visible"
    :style="{ width: '550px' }"
    :header="$t('common.confirm')"
    modal
    @hide="handleHide"
    @submit="handleSubmit"
  >
    <BlockUI :blocked="isLoading">
      <div
        v-html="
          $t('admin.leagues.deleteUserConfirmation', { userName, leagueName })
        "
      />
    </BlockUI>
  </BaseDialog>
</template>

<script setup>
import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'
import { computed } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  },
  league: {
    type: Object,
    required: true
  },
  visible: Boolean,
  isLoading: Boolean
})

const emits = defineEmits(['hide', 'submit'])

const userName = computed(() => props.user.name)
const leagueName = computed(() => props.league.name)

const handleHide = () => emits('hide')
const handleSubmit = () => emits('submit', props.user)
</script>
