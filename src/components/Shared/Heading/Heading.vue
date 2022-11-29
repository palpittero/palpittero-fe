<template>
  <h1 class="flex align-items-center gap-3">
    <span v-if="icon" :class="`${icon} text-4xl`" />
    {{ label }}
  </h1>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  }
})
</script>
