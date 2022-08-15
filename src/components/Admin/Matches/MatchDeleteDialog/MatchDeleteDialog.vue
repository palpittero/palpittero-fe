<template>
  <BaseDialog
    :visible="visible"
    :style="{ width: '550px' }"
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
import { useI18n } from 'vue-i18n'
import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'
import { computed } from 'vue'

const i18n = useI18n()

const props = defineProps({
  matches: {
    type: Array,
    required: true
  },
  visible: Boolean
})

const emits = defineEmits(['hide', 'submit'])

const message = computed(() => {
  const name = props.matches.value.map(({ name }) => name).join('<br />')

  return i18n.t(
    'admin.matches.deleteConfirmation',
    { name },
    props.matches.value.length
  )
})

const handleHide = () => emits('hide')
const handleSubmit = () => emits('submit', props.matches.value)
</script>
