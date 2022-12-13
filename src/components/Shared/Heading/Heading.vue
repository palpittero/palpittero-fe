<template>
  <h1 class="flex align-items-center gap-2 md:gap-3">
    <!-- <span v-if="icon" :class="icon" /> -->
    <font-awesome-icon v-if="icon" :icon="icon" />
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
