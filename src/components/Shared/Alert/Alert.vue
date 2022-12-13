<template>
  <div :class="`alert alert-${variant} hstack gap-2`">
    <font-awesome-icon v-if="icon" :icon="icon" />{{ text }}
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'fas fa-info-circle'
  },
  variant: {
    type: String,
    default: 'warning'
  }
})
</script>
