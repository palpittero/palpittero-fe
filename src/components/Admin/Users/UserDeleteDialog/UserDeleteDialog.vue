<template>
  <BaseDialog
    :visible="visible"
    :header="$t('common.confirm')"
    modal
    @hide="handleHide"
  >
    <div class="flex align-items-center">
      <span v-html="message" />
    </div>
    <template #footer>
      <Button
        :label="$t('common.no')"
        icon="pi pi-times"
        class="p-button-text"
        @click="handleHide"
        :disabled="disabled"
      />
      <Button
        :label="$t('common.yes')"
        icon="pi pi-check"
        class="p-button-text"
        @click="handleSubmit"
        :disabled="disabled"
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
  users: {
    type: Array,
    required: true
  },
  visible: Boolean,
  disabled: Boolean
})

const emits = defineEmits(['hide', 'submit'])

const message = computed(() => {
  const name = props.users.value.map(({ name }) => name).join('<br />')

  return i18n.t(
    'admin.users.deleteConfirmation',
    { name },
    props.users.value.length
  )
})

const handleHide = () => emits('hide')
const handleSubmit = () => emits('submit', props.users.value)
</script>
