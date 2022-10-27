<template>
  <DataTable
    ref="dt"
    :value="items.data"
    v-model:selection="selectedItems"
    data-key="id"
    paginator
    :rows="10"
    v-model:filters="filters"
    :global-filter-fields="globalFilterFields"
    responsiveLayout="stack"
    :loading="items.loading"
    row-hover
    paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rows-per-page-options="[5, 10, 25]"
    current-page-report-template="Showing {first} to {last} of {totalRecords} items"
  >
    <template #header v-if="showHeader">
      <slot name="header">
        <div
          class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
        >
          <h5 class="m-0">{{ title }}</h5>
          <span class="block mt-2 md:mt-0 p-input-icon-left" v-if="searchable">
            <i class="pi pi-search" />
            <InputText
              v-model="filters.global.value"
              :placeholder="$t('common.search')"
            />
          </span>
        </div>
      </slot>
    </template>

    <slot />
  </DataTable>
</template>

<script setup>
import { FilterMatchMode } from 'primevue/api'
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  items: {
    type: Object,
    default: () => ({})
  },
  title: {
    type: String,
    default: ''
  },
  globalFilterFields: {
    type: Array,
    default: () => ['name']
  },
  searchable: Boolean
})

const emits = defineEmits(['edit', 'delete', 'update:modelValue'])

const selectedItems = computed({
  set: (value) => emits('update:modelValue', value),
  get: () => props.modelValue
})

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

const showHeader = computed(() => props.title || props.searchable)
</script>
