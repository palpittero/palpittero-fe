<template>
  <div>
    <ProgressSpinner v-if="state.loading" class="flex align-items-center" />
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
