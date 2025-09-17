<script setup lang="ts">
import DataStatus from '@/components/Shared/DataStatus.vue'
import DataTable, { type iColumn } from '@/components/Shared/DataTable.vue'

import type { iState, iTeam } from '@/types'
import BaseImage from '@/components/Shared/BaseImage.vue'

const props = defineProps<{
  state: iState<iTeam[]>
}>()

const emit = defineEmits<{
  edit: [row: iTeam]
}>()

const columns: iColumn<iTeam>[] = [
  {
    key: 'name',
    label: 'Nome',
    sortable: true,
    searchable: true,
  },
  {
    key: 'status',
    label: 'Status',
  },
]

console.log(props.state)

const handleEdit = (row: iTeam) => {
  emit('edit', row)
}
</script>

<template>
  <DataTable :columns="columns" :rows="state.data" :loading="state.loading" @edit="handleEdit">
    <template #name="{ row }">
      <div class="flex items-center gap-3">
        <BaseImage :src="row.badge" class="size-8" />
        <div>
          <div class="font-bold flex items-center gap-2">
            {{ row.name }}
            <img v-if="row.country?.flag" :src="row.country?.flag" alt="Flag" class="w-5" />
          </div>
          <div class="text-sm opacity-50" v-if="row.nationalDivision">
            Divisão Nacional: {{ row.nationalDivision }}
          </div>
        </div>
      </div>
    </template>
    <template #status="{ value, row }">
      <DataStatus :status="value" resource="teams" :entity-id="row.id" :row="row" />
    </template>
  </DataTable>
</template>
