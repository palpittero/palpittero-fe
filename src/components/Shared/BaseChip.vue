<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <span class="badge badge-primary">{{ label }}</span>
</template>
