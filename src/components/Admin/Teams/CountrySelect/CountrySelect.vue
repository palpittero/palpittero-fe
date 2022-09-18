<template>
  <Dropdown
    v-model="selectedCountry"
    filter
    :options="countries.data"
    option-label="name"
    :optionValue="getOptionValue"
    :placeholder="$t('admin.teams.selectCountry')"
    :loading="loading"
    :disabled="disabled || countries.loading"
    :class="{ 'p-invalid': invalid }"
    class="p-dropdown-sm"
  >
    <template #value="{ value, placeholder }">
      <div v-if="value" class="flex align-items-center gap-3">
        <Avatar :image="value.flag" shape="circle" />
        <div>{{ value.name }}</div>
      </div>
      <span v-else>
        {{ placeholder }}
      </span>
    </template>
    <template #option="{ option }">
      <div class="flex align-items-center gap-3">
        <Avatar :image="option.flag" shape="circle" />
        <div>{{ option.name }}</div>
      </div>
    </template>
  </Dropdown>
</template>

<script setup>
import services from '@/services'
import { computed, reactive, onMounted } from 'vue'

// import countriesFetcher from '@/components/Shared/countries/countriesFetcher/countriesFetcher.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  invalid: Boolean,
  disabled: Boolean
})

const emits = defineEmits(['update:modelValue'])

const countries = reactive({
  loading: false,
  error: null,
  data: []
})

const selectedCountry = computed({
  set(value) {
    console.log(value)
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

onMounted(async () => {
  countries.loading = true
  countries.data = await services.teams.fetchCountries()
  countries.loading = false
})

const getOptionValue = ({ id, name, flag }) => ({ id, name, flag })
</script>
