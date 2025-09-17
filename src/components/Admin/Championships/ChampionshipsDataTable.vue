<script setup lang="ts">
import DataStatus from '@/components/Shared/DataStatus.vue'
import DataTable, { type iColumn } from '@/components/Shared/DataTable.vue'

import type { iState, iChampionship } from '@/types'
import BaseImage from '@/components/Shared/BaseImage.vue'

defineProps<{
  state: iState<iChampionship[]>
}>()

const emit = defineEmits<{
  edit: [row: iChampionship]
}>()

const columns: iColumn<iChampionship & { teams: any; groups: any; rounds: any }>[] = [
  {
    key: 'name',
    label: 'Nome',
    sortable: true,
    searchable: true,
  },
  {
    key: 'teams',
    label: 'Times',
    sortable: true,
  },
  {
    key: 'groups',
    label: 'Grupos',
    sortable: true,
  },
  {
    key: 'rounds',
    label: 'Rodadas',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
  },
]

const handleEdit = (row: iChampionship) => {
  emit('edit', row)
}
</script>

<template>
  <DataTable :columns="columns" :rows="state.data" :loading="state.loading" @edit="handleEdit">
    <template #name="{ row }">
      <div class="flex items-center gap-3">
        <div>
          <div class="font-bold">
            {{ row.name }}
          </div>
          <div class="text-sm opacity-50">
            {{ row.year }}
          </div>
        </div>
      </div>
    </template>
    <template #teams="{ value }">
      {{ value?.length }}
    </template>
    <template #groups="{ value }">
      {{ value?.length }}
    </template>
    <template #rounds="{ value }">
      {{ value?.length }}
    </template>
    <template #status="{ value, row }">
      <DataStatus :status="value" resource="championships" :entity-id="row.id" />
    </template>
  </DataTable>
</template>
