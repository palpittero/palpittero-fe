<template>
  <BaseDialog
    :visible="visible"
    :header="$t('common.confirm')"
    modal
    @hide="handleHide"
  >
    <div class="flex align-items-center">
      <!-- <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" /> -->
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
import { computed } from 'vue'
import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'

const i18n = useI18n()

const props = defineProps({
  championships: {
    type: Array,
    required: true
  },
  visible: Boolean,
  disabled: Boolean
})

const emits = defineEmits(['hide', 'submit'])

const message = computed(() => {
  const name = props.championships.map(({ name }) => name).join('<br />')

  return i18n.t(
    'admin.championships.deleteConfirmation',
    { name },
    props.championships.length
  )
})

const handleHide = () => emits('hide')
const handleSubmit = () => emits('submit', props.championships)
</script>
