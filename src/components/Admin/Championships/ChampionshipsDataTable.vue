<script setup lang="ts">
import BaseImage from '@/components/Shared/BaseImage.vue'
import DataStatus from '@/components/Shared/DataStatus.vue'
import DataTable, { type iColumn } from '@/components/Shared/DataTable.vue'
import type { iState, iChampionship } from '@/types'

defineProps<{
  state: iState<iChampionship[]>
}>()

const emit = defineEmits<{
  edit: [row: iChampionship]
  ranking: [row: iChampionship]
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
    key: 'positions',
    label: 'Ranking',
  },
  {
    key: 'status',
    label: 'Status',
  },
]

const handleEdit = (row: iChampionship) => {
  emit('edit', row)
}

const handleSetRanking = (row: iChampionship) => {
  emit('ranking', row)
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
    <template #positions="{ row }">
      <div class="flex flex-col items-start gap-1">
        <!-- <MatchStatus :status="value" /> -->
        <template v-if="row.positions.length">
          <div
            v-for="position in row.positions"
            :key="position.position"
            class="flex items-center gap-2 text-xs"
          >
            <BaseImage :src="position.team.badge" class="size-4 rounded-md" />
            {{ position.team.name }}
          </div>
        </template>
        <a v-else class="link link-hover link-primary" @click.stop="handleSetRanking(row)">
          Atualizar Ranking
        </a>
      </div>
    </template>
    <template #status="{ value, row }">
      <DataStatus :status="value" resource="championships" :entity-id="row.id" />
    </template>
  </DataTable>
</template>
