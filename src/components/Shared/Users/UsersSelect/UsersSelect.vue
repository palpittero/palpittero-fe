<template>
  <UsersFetcher :parse-options="parseUsers">
    <template #default="{ loading, data }">
      <MultiSelect
        v-model="selectedUsers"
        :options="data"
        optionLabel="name"
        :optionValue="getOptionValue"
        :loading="loading"
        filter
        display="chip"
        :placeholder="$t('admin.users.selectUsers')"
        :class="multiSelectClassName"
      />
    </template>
  </UsersFetcher>
</template>

<script setup>
import { computed } from 'vue'
import UsersFetcher from '@/components/Shared/Users/UsersFetcher/UsersFetcher.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  filterIds: {
    type: Array,
    default: () => []
  },
  className: {
    type: String,
    default: ''
  },
  invalid: Boolean
})

const emits = defineEmits(['update:modelValue'])

const selectedUsers = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
      .filter(({ id }) => !props.filterIds.includes(id))
      .map(({ id, name, email }) => ({ id, name, email }))
  }
})

const multiSelectClassName = computed(() => [
  props.className,
  props.invalid && 'p-invalid'
])

const parseUsers = (users) =>
  users
    .filter(({ id }) => !props.filterIds.includes(id))
    .map(({ id, name, email }) => ({ id, name, email }))

const getOptionValue = ({ id, name, email }) => ({ id, name, email })
</script>
