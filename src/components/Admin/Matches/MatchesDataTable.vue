<script setup lang="ts">
import MatchStatus from './MatchStatus.vue'
import DataTable, { type iColumn } from '@/components/Shared/DataTable.vue'

import type { iState, iMatch } from '@/types'
import MatchScore from './MatchScore.vue'
import FormattedDate from '@/components/Shared/FormattedDate.vue'

defineProps<{
  state: iState<iMatch[]>
}>()

const emit = defineEmits<{
  edit: [row: iMatch]
  'update-result': [row: iMatch]
}>()

const columns: iColumn<iMatch>[] = [
  {
    key: 'result',
    label: 'Placar',
    sortable: true,
    searchable: true,
  },
  {
    key: 'round',
    label: 'Rodada',
    sortable: true,
  },
  {
    key: 'date',
    label: 'Data/Horário',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
  },
]

const handleEdit = (row: iMatch) => {
  emit('edit', row)
}

const handleUpdateResult = (row: iMatch) => {
  emit('update-result', row)
}
</script>

<template>
  <DataTable :columns="columns" :rows="state.data" :loading="state.loading" @edit="handleEdit">
    <template #result="{ row }">
      <MatchScore :match="row" />
    </template>
    <template #round="{ value }">
      <div class="flex flex-col">
        {{ value.championship.name }}
        <div class="text-sm opacity-50">
          {{ value.name }}
        </div>
      </div>
    </template>
    <template #date="{ value }">
      <FormattedDate :date="value" />
    </template>
    <template #status="{ value, row }">
      <div class="flex flex-col items-start gap-1">
        <MatchStatus :status="value" />
        <a
          class="link link-hover link-primary"
          v-if="value === 'finished'"
          @click.stop="handleUpdateResult(row)"
        >
          Atualizar Resultado
        </a>
      </div>
    </template>
  </DataTable>
</template>
