<script setup lang="ts">
import { useToastStore, type iToastLevel } from '@/stores'
import { storeToRefs } from 'pinia'

const toastStore = useToastStore()
const { message, type, visible } = storeToRefs(toastStore)

const levelClasses: Record<iToastLevel, string> = {
  info: 'alert-info',
  success: 'alert-success',
  error: 'alert-error text-white',
}
</script>

<template>
  <div class="toast" v-if="visible">
    <div class="alert" :class="levelClasses[type]">
      <span>{{ message }}</span>
    </div>
  </div>
</template>
