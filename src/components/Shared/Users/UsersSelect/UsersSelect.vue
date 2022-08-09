<template>
  <MultiSelect
    v-model="selectedUsers"
    :options="filteredUsers"
    optionLabel="name"
    :optionValue="getOptionValue"
    filter
    display="chip"
    :placeholder="$t('admin.users.selectUsers')"
    :class="{ 'p-invalid': invalid }"
  />
</template>

<script setup>
import services from '@/services'
import { computed, reactive, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  filterIds: {
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

const selectedUsers = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
      .filter(({ id }) => !props.filterIds.includes(id))
      .map(({ id, name }) => ({ id, name }))
  }
})

onMounted(async () => {
  users.loading = true
  users.data = await services.users.fetchUsers()
  users.loading = false
})

const filteredUsers = computed(() =>
  users.data
    .filter(({ id }) => !props.filterIds.includes(id))
    .map(({ id, name }) => ({ id, name }))
)

const getOptionValue = ({ id, name }) => ({ id, name })
</script>
