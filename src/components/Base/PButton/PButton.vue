<template>
  <button
    :class="`btn d-flex align-items-center justify-content-center gap-2 shadow-none btn-${variant} btn-${size}`"
    type="submit"
    :disabled="disabled || loading"
  >
    <template v-if="loading">
      <font-awesome-icon icon="fa-solid fa-circle-notch" spin />
      {{ $t('common.wait') }}
    </template>
    <template v-else>
      <font-awesome-icon v-if="icon" :icon="icon" />
      {{ label }}
    </template>
  </button>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'md'
  },
  disabled: Boolean,
  loading: Boolean
})
</script>
