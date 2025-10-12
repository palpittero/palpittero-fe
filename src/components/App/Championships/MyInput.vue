<script setup lang="ts">
const model = defineModel<any>({ required: true })
</script>

<template>
  <input v-model="model" />
</template>
