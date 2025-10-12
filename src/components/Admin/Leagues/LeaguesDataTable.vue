<script setup lang="ts">
import DataStatus from '@/components/Shared/DataStatus.vue'
import DataTable, { type iColumn } from '@/components/Shared/DataTable.vue'

import type { iState, iLeague } from '@/types'
import BaseImage from '@/components/Shared/BaseImage.vue'

defineProps<{
  state: iState<iLeague[]>
}>()

const emit = defineEmits<{
  edit: [row: iLeague]
}>()

const columns: iColumn<iLeague>[] = [
  {
    key: 'name',
    label: 'Nome',
    sortable: true,
    searchable: true,
  },
  {
    key: 'users',
    label: 'Participantes',
    sortable: true,
  },
  {
    key: 'owner',
    label: 'Proprietário',
    sortable: true,
    sortKey: 'owner.name',
    searchable: true,
    searchKey: 'owner.name',
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
  },
]

const handleEdit = (row: iLeague) => {
  emit('edit', row)
}

const visibility: Record<number, string> = {
  0: 'Pública',
  1: 'Privada',
}
</script>

<template>
  <DataTable :columns="columns" :rows="state.data" :loading="state.loading" @edit="handleEdit">
    <template #name="{ row }">
      <div class="flex items-center gap-3">
        <BaseImage :src="row.badge" class="size-10" />
        <div>
          <div class="font-bold">
            {{ row.name }}
          </div>
          <div class="text-sm opacity-50">
            {{ visibility[row.private] }}
          </div>
        </div>
      </div>
    </template>
    <template #users="{ value }">
      {{ value?.length }}
    </template>
    <template #owner="{ value }">
      {{ value?.name }}
    </template>
    <template #status="{ value, row }">
      <DataStatus :status="value" resource="leagues" :entity-id="row.id" />
    </template>
  </DataTable>
</template>
