<template>
  <BaseDialog
    :visible="visible"
    :header="$t('common.confirm')"
    modal
    @hide="handleHide"
  >
    <div class="flex align-items-center">
      <span v-html="messageHTML" />
    </div>
    <template #footer>
      <Button
        :label="$t('common.no')"
        icon="pi pi-times"
        class="p-button-text"
        @click="handleHide"
        :disabled="submitting"
      />
      <Button
        :label="$t('common.yes')"
        icon="pi pi-check"
        class="p-button-text"
        @click="handleSubmit"
        :disabled="submitting"
      />
    </template>
  </BaseDialog>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'
import { computed } from 'vue'

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

const messageHTML = computed(() => {
  const name = props.leagues.map(({ name }) => name).join('<br />')

  return i18n.t(
    'admin.leagues.deleteConfirmation',
    { name },
    props.leagues.length
  )
})

const handleHide = () => emits('hide')
const handleSubmit = () => emits('submit', props.leagues)
</script>
