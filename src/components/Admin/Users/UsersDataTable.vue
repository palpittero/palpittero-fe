<script setup lang="ts">
import DataStatus from '@/components/Shared/DataStatus.vue'
import DataTable, { type iColumn } from '@/components/Shared/DataTable.vue'

import type { iState, iUser } from '@/types'
import BaseImage from '../BaseImage.vue'

defineProps<{
  state: iState<iUser[]>
}>()

const emit = defineEmits<{
  edit: [row: iUser]
}>()

const columns: iColumn<iUser>[] = [
  {
    key: 'name',
    label: 'Nome',
    sortable: true,
    searchable: true,
  },
  {
    key: 'email',
    label: 'E-mail',
    sortable: true,
    searchable: true,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
  },
]

const handleEdit = (row: iUser) => {
  emit('edit', row)
}
</script>

<template>
  <DataTable :columns="columns" :rows="state.data" :loading="state.loading" @edit="handleEdit">
    <template #name="{ row }">
      <div class="flex items-center gap-3">
        <BaseImage :src="row.avatar" class="size-10" />
        <div>
          <div class="font-bold">
            {{ row.name }}
          </div>
          <div class="text-sm opacity-50">
            {{ row.role }}
          </div>
        </div>
      </div>
    </template>
    <template #email="{ value }">
      {{ value }}
    </template>
    <template #status="{ value, row }">
      <DataStatus :status="value" resource="users" :entity-id="row.id" />
    </template>
  </DataTable>
</template>
