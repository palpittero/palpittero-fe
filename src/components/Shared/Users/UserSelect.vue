<script setup lang="ts">
import services from '@/services'
import { type iState, type iUser } from '@/types'
import { onMounted, reactive } from 'vue'
import BaseSelect from '../BaseSelect.vue'

defineProps<{
  label: string
  required?: boolean
  disabled?: boolean
  help?: string
}>()

const userId = defineModel<number | null>({ required: true })

const state = reactive<iState<iUser[]>>({
  loading: false,
  data: [],
  error: null,
})

const loadUsers = async () => {
  try {
    state.loading = true

    state.data = await services.users.fetchUsers()
  } catch (error: any) {
    state.error = error.message
  } finally {
    state.loading = false
  }
}

onMounted(loadUsers)
</script>

<template>
  <BaseSelect
    v-model="userId"
    :options="state.data"
    :label="label"
    :required="required"
    :help="help"
    :disabled="disabled || state.loading"
  />
</template>
