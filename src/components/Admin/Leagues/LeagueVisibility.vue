<script setup lang="ts">
defineProps<{
  private: number
}>()

const visibility: Record<number, string> = {
  0: 'Pública',
  1: 'Privada',
}
</script>

<template>
  <span>{{ visibility[private] }}</span>
</template>
