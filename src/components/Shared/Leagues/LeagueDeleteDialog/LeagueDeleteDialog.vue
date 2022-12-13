<template>
  <BaseConfirmDialog
    target="league-delete-dialog"
    :visible="visible"
    :message="message"
    :disabled="submitting"
    @hide="handleHide"
    @submit="handleSubmit"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import BaseConfirmDialog from '@/components/Shared/BaseConfirmDialog/BaseConfirmDialog.vue'

const i18n = useI18n()

const props = defineProps({
  leagues: {
    type: Array,
    required: true
  },
  visible: Boolean,
  submitting: Boolean
})

const emits = defineEmits(['hide', 'submit'])

const message = computed(() => {
  const name = props.leagues.map(({ name }) => name).join('<br />')

  console.log(
    i18n.t('admin.leagues.deleteConfirmation', { name }, props.leagues.length)
  )

  return i18n.t(
    'admin.leagues.deleteConfirmation',
    { name },
    props.leagues.length
  )
})

const handleHide = () => emits('hide')
const handleSubmit = () => emits('submit', props.leagues)
</script>
