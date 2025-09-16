<script setup lang="ts">
import { onMounted, reactive } from 'vue'

const props = defineProps<{
  fetch: (params?: any) => Promise<any>
  params?: any
  immediate?: boolean
}>()

const state = reactive({
  loading: false,
  error: null,
  data: [],
})

onMounted(async () => {
  if (!props.immediate) return

  state.loading = true
  state.data = await props.fetch(props.params)
  state.loading = false
})
</script>

<template>
  <span v-if="state.loading" class="loading loading-ring loading-xl" />
  <slot v-else v-bind="state" />
</template>
