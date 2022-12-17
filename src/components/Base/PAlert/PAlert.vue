<template>
  <div :class="`alert alert-${variant} hstack m-0`">
    <font-awesome-icon v-if="icon" :icon="icon" />
    <slot>
      {{ text }}
    </slot>
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
