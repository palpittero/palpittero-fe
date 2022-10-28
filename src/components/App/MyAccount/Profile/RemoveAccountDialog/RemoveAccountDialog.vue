<template>
  <BaseDialog
    :visible="visible"
    :header="$t('common.confirm')"
    modal
    @hide="handleHide"
  >
    <div class="flex align-items-center">
      <span v-html="$t('app.myAccount.profile.removeAccount.message')" />
    </div>
    <template #footer>
      <Button
        :label="$t('common.no')"
        icon="pi pi-times"
        class="p-button-text"
        @click="handleHide"
      />
      <Button
        :label="$t('app.myAccount.profile.removeAccount.title')"
        icon="pi pi-check"
        class="p-button-text p-button-danger"
        @click="handleSubmit"
      />
    </template>
  </BaseDialog>
</template>

<script setup>
import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'

defineProps({
  visible: Boolean
})

const emits = defineEmits(['hide', 'submit'])

const handleHide = () => emits('hide')
const handleSubmit = () => emits('submit')
</script>
