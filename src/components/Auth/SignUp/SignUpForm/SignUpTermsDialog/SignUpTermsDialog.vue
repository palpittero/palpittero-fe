<template>
  <BaseDialog
    :visible="visible"
    type="prompt"
    :header="$t('common.menu.rules')"
    modal
    @hide="emits('hide')"
  >
    <div class="flex align-items-center">
      <Rules />
    </div>
    <template #footer>
      <Button
        :label="$t('common.ok')"
        icon="pi pi-check"
        class="p-button-text"
        @click="emits('hide')"
      />
    </template>
  </BaseDialog>
</template>

<script setup>
import BaseDialog from '@/components/Shared/BaseDialog/BaseDialog.vue'
import Rules from '@/components/App/Rules/Rules.vue'

defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['hide'])
</script>
