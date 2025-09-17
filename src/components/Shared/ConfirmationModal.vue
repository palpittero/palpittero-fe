<script setup lang="ts">
import BaseModal from '@/components/Shared/BaseModal.vue'

defineProps<{
  id: string
  title: string
  message?: string
}>()
</script>

<template>
  <BaseModal :id="id" :title="title" :message="message" size="md" confirmButtonText="Sim">
    <slot>
      <p class="py-4" v-html="message" />
    </slot>
  </BaseModal>
</template>
