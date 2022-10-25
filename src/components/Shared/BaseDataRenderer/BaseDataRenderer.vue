<template>
  <div>
    <slot name="loading" v-if="state.loading" :state="loading">
      <ProgressSpinner class="flex align-items-center" />
    </slot>
    <Message v-else-if="state.error" severity="error">
      {{ state.error }}
    </Message>
    <slot v-else />
  </div>
</template>

<script setup>
defineProps({
  state: {
    type: Object,
    default: () => ({})
  }
})
</script>
