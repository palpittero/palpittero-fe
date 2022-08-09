<template>
  <slot :loading="users.loading" :data="data" :error="users.loading" />
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import services from '@/services'

const props = defineProps({
  parseOptions: {
    type: Function,
    default: (user) => user
  }
})

const users = reactive({
  loading: false,
  error: null,
  data: []
})

onMounted(async () => {
  users.loading = true
  users.data = await services.users.fetchUsers()
  users.loading = false
})

const data = computed(() => props.parseOptions(users.data))
</script>
