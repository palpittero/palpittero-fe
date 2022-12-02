<template>
  <button
    class="w-100 btn btn-primary d-flex align-items-center justify-content-center gap-2"
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
      <!-- {{ $t('admin.auth.signIn') }} -->
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
  disabled: Boolean,
  loading: Boolean
})
</script>
