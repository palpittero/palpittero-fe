<template>
  <BaseDataRenderer :state="unprocessedGuesses">
    <template #loading>
      <slot name="loading" />
    </template>
    <slot :fetch="loadUnprocessedGuesses" v-bind="unprocessedGuesses" />
  </BaseDataRenderer>
</template>

<script setup>
import services from '@/services'
import { onMounted, ref } from 'vue'

import BaseDataRenderer from '@/components/Shared/BaseDataRenderer/BaseDataRenderer.vue'

const unprocessedGuesses = ref({
  loading: false,
  error: null,
  data: []
})

const loadUnprocessedGuesses = async () => {
  unprocessedGuesses.value.loading = true
  unprocessedGuesses.value.data =
    await services.dashboard.fetchUnprocessedGuesses()
  unprocessedGuesses.value.loading = false
}

onMounted(loadUnprocessedGuesses)
</script>
