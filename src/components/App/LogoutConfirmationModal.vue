<script setup lang="ts">
import ConfirmationModal from '@/components/Shared/ConfirmationModal.vue'

const emit = defineEmits<{
  submit: []
}>()

const handleSubmit = () => {
  emit('submit')
}
</script>

<template>
  <ConfirmationModal id="logout_confirmation_modal" title="Sair" @submit="handleSubmit">
    <p class="py-4">Tem certeza que deseja sair?</p>
  </ConfirmationModal>
</template>
