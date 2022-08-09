<template>
  <UsersFetcher>
    <template #default="{ loading, data }">
      <Dropdown
        v-model="selectedUser"
        filter
        :options="data"
        option-label="name"
        option-value="id"
        :placeholder="$t('admin.users.selectUser')"
        :loading="loading"
        :disabled="disabled"
        :class="{ 'p-invalid': invalid }"
      />
    </template>
  </UsersFetcher>
</template>

<script setup>
import services from '@/services'
import { computed, reactive, onMounted } from 'vue'

import UsersFetcher from '@/components/Shared/Users/UsersFetcher/UsersFetcher.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  invalid: Boolean,
  disabled: Boolean
})

const emits = defineEmits(['update:modelValue'])

const users = reactive({
  loading: false,
  error: null,
  data: []
})

const selectedUser = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

onMounted(async () => {
  users.loading = true
  users.data = await services.users.fetchUsers()
  users.loading = false
})

// const getOptionValue = ({ id, name }) => ({ id, name })
</script>
