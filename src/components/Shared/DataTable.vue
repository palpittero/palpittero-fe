<script setup lang="ts">
import { get, orderBy } from 'lodash/fp'
import { computed, reactive, ref } from 'vue'

export type iColumn<T> = {
  key: keyof T | 'actions'
  label: string
  sortable?: boolean
  sortKey?: string
  searchable?: boolean
  searchKey?: string
  removable?: boolean
  type?: 'text' | 'number' | 'date' | 'boolean' | 'select'
  permissions?: {
    canEdit?: (item: T) => boolean
    canRemove?: (item: T) => boolean
  }
}

type iProps<T> = {
  columns: iColumn<T>[]
  rows: T[]
  loading?: boolean
  pagination?: {
    currentPage?: number
    pageSize?: number
  }
  permissions?: {
    canEdit?: (item: T) => boolean
    canRemove?: (item: T) => boolean
  }
}

const props = withDefaults(defineProps<iProps<any>>(), {
  loading: false,
  pagination: () => ({
    currentPage: 1,
    pageSize: 10,
  }),
  permissions: () => ({
    canEdit: (item: any) => Boolean(item.id),
    canRemove: (item: any) => Boolean(item.id),
  }),
})

type iSlots<T> = Record<
  keyof T,
  {
    cell(props: { column: iColumn<T>; row: T; value: any }): any
  }
>

defineSlots<iSlots<any>>()

type iEmits<T> = {
  edit: [row: T]
}

const emit = defineEmits<iEmits<any>>()

const search = ref<string>('')

const showSearch = computed<boolean>(() => props.rows.length > 0)

const searchableColumns = computed<any[]>(() =>
  props.columns
    .filter((column) => column.searchable)
    .map((column) => column.searchKey || column.key),
)

const filteredRows = computed<any[]>(() => {
  if (!search.value || searchableColumns.value.length === 0) return props.rows

  return props.rows.filter((row) =>
    searchableColumns.value.some((column) =>
      (get(column, row) || '').toLowerCase().includes(search.value.toLowerCase()),
    ),
  )
})

const totalRows = computed<string>(() => {
  return search.value
    ? `Total: ${filteredRows.value.length} de ${props.rows.length} registros`
    : `Total: ${props.rows.length} registros`
})

const handleEdit = (row: any) => {
  emit('edit', row)
}

const pageSize = ref<number>(props.pagination?.pageSize || 10)

const currentPage = ref<number>(props.pagination?.currentPage || 10)

const totalPages = computed<number>(() => Math.ceil(filteredRows.value.length / pageSize.value))

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value

  return sortedRows.value.slice(start, end)
})

const handleFirstPage = () => {
  currentPage.value = 1
}

const handleLastPage = () => {
  currentPage.value = totalPages.value
}

const handlePreviousPage = () => {
  currentPage.value--
}

const handleNextPage = () => {
  currentPage.value++
}

const isFirstPage = computed<boolean>(() => currentPage.value === 1)

const isLastPage = computed<boolean>(() => currentPage.value === totalPages.value)

const sort = reactive<any>({
  key: 'id',
  order: 'desc',
})

const sortedRows = computed<any[]>(() => orderBy([sort.key], [sort.order], filteredRows.value))

const handleSort = (key: string) => {
  if (sort.key === key) {
    if (sort.order === 'asc') {
      sort.order = 'desc'
    } else if (sort.order === 'desc') {
      sort.key = 'id'
      sort.order = 'asc'
    }
  } else {
    sort.key = key
    sort.order = 'asc'
  }
}

const getSortIcon = (key: string): string => {
  if (sort.key === key) {
    return sort.order === 'asc' ? 'fa-sort-up' : 'fa-sort-down'
  }

  return 'fa-sort'
}

const showPagination = computed<boolean>(() => filteredRows.value.length > pageSize.value)

const hasRows = computed<boolean>(() => filteredRows.value.length > 0)
</script>

<template>
  <fieldset v-if="showSearch" class="fieldset">
    <!-- <legend class="fieldset-legend">Nome</legend> -->
    <input
      id="name"
      type="text"
      class="input"
      required
      placeholder="Pesquisar..."
      v-model="search"
    />
  </fieldset>
  <div v-if="loading" class="flex items-center gap-2">
    <div class="loading loading-ring loading-xl" />
    Carregando...
  </div>

  <div v-else-if="hasRows" class="flex flex-col gap-4">
    <div
      class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-[92vw] md:w-full"
    >
      <table class="table">
        <thead>
          <tr>
            <!-- <th>
            <label>
              <input type="checkbox" class="checkbox" />
            </label>
          </th> -->
            <th v-for="column in columns" :key="column.key">
              <div class="flex items-center gap-2">
                {{ column.label }}
                <a
                  v-if="column.sortable"
                  class="link"
                  @click="handleSort(column.sortKey || (column.key as string))"
                >
                  <i
                    class="fa-solid"
                    :class="getSortIcon(column.sortKey || (column.key as string))"
                  />
                </a>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in paginatedRows"
            :key="JSON.stringify(row)"
            class="hover:bg-base-300 cursor-pointer"
            @click="handleEdit(row)"
          >
            <!-- <th>
            <label v-if="permissions?.canRemove?.(row)">
              <input type="checkbox" class="checkbox" />
            </label>
          </th> -->
            <td v-for="column in columns" :key="column.key">
              <slot :name="column.key" :column="column" :row="row" :value="row[column.key]" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-start">
      <div class="flex flex-col gap-2 items-center flex-1" v-if="showPagination">
        <fieldset class="join">
          <button class="join-item btn" @click="handleFirstPage" :disabled="isFirstPage">
            <i class="fa-solid fa-angles-left" />
          </button>
          <button class="join-item btn" @click="handlePreviousPage" :disabled="isFirstPage">
            <i class="fa-solid fa-angle-left" />
          </button>
          <button class="join-item btn pointer-events-none">
            {{ currentPage }} de {{ totalPages }}
          </button>
          <button class="join-item btn" @click="handleNextPage" :disabled="isLastPage">
            <i class="fa-solid fa-angle-right" />
          </button>
          <button class="join-item btn" @click="handleLastPage" :disabled="isLastPage">
            <i class="fa-solid fa-angles-right" />
          </button>
        </fieldset>
      </div>
      <small>{{ totalRows }}</small>
    </div>
  </div>

  <div v-else class="alert alert-soft">
    <span> <i class="fa-solid fa-check" /> Nenhum registro encontrado </span>
  </div>
</template>
