<template>
  <BaseDataTable
    v-model="selectedMatches"
    :items="matches"
    :title="$t('common.matches')"
    class="matches-data-table"
    :global-filter-fields="globalFilterFields"
    searchable
  >
    <Column selectionMode="multiple" />
    <Column field="homeTeam" :header="$t('admin.matches.homeTeam')" sortable>
      <template #body="{ data }">
        <div class="flex align-items-center gap-2">
          <Avatar :image="data.homeTeam.badge" shape="circle" size="small" />
          {{ data.homeTeam.name }}
        </div>
      </template>
    </Column>
    <Column field="awayTeam" :header="$t('admin.matches.awayTeam')" sortable>
      <template #body="{ data }">
        <div class="flex align-items-center gap-2">
          <Avatar :image="data.awayTeam.badge" shape="circle" size="small" />
          {{ data.awayTeam.name }}
        </div>
      </template>
    </Column>

    <Column
      field="championship"
      :header="$t('admin.matches.championship')"
      sortable
    >
      <template #body="{ data }">
        <div>
          <span class="text-right">
            {{ data.round.championship.name }}
            {{ data.round.championship.year }}
          </span>
        </div>
        <small>
          {{ data.round.name }}
        </small>
      </template>
    </Column>

    <!-- <Column field="round" :header="$t('admin.matches.round')" sortable>
      <template #body="{ data }">
        <span class="text-right">
          {{ data.round.name }}
        </span>
      </template>
    </Column> -->

    <Column field="date" :header="$t('admin.matches.date')" sortable>
      <template #body="{ data }">
        <span class="text-right">
          {{ $d(data.date, 'long') }}
        </span>
      </template>
    </Column>
    <Column field="status" :header="$t('common.status')" sortable>
      <template #body="{ data }">
        <BaseStatus :status="data.status" :options="MATCH_STATUSES_LABELS" />
      </template>
    </Column>
    <Column :header="$t('admin.matches.score')" sortable>
      <template #body="{ data }">
        <MatchScore v-if="isFinished(data)" :match="data" />
        <span v-else>-</span>
      </template>
    </Column>
    <Column>
      <template #body="{ data }">
        <div class="justify-content-center">
          <Button
            icon="pi pi-pencil"
            v-if="!isFinished(data)"
            class="p-button-rounded p-button-success mr-2"
            @click="handleEditMatch(data)"
          />
          <Button
            v-if="isFinished(data)"
            icon="pi pi-check-square"
            class="p-button-rounded p-button-info mr-2"
            @click="handleSetMatchResult(data)"
          />
          <Button
            v-if="!isFinished(data)"
            icon="pi pi-trash"
            class="p-button-rounded p-button-warning"
            @click="handleDeleteMatch(data)"
          />
        </div>
      </template>
    </Column>
  </BaseDataTable>
</template>

<script setup>
import { computed } from 'vue'
import BaseStatus from '@/components/Shared/BaseStatus/BaseStatus.vue'
import BaseDataTable from '@/components/Shared/BaseDataTable/BaseDataTable.vue'
import MatchScore from '@/components/Admin/Matches/MatchScore/MatchScore.vue'

import { MATCH_STATUSES, MATCH_STATUSES_LABELS } from '@/constants/matches'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  matches: {
    type: Object,
    default: () => ({})
  }
})

const emits = defineEmits(['edit', 'delete', 'set-result', 'update:modelValue'])

const selectedMatches = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const isFinished = (match) => match.status === MATCH_STATUSES.FINISHED

const handleEditMatch = (match) => emits('edit', match)
const handleDeleteMatch = (match) => emits('delete', match)
const handleSetMatchResult = (match) => emits('set-result', match)

const globalFilterFields = [
  'homeTeam.name',
  'awayTeam.name',
  'round.name',
  'round.championship.name'
]
</script>

<style lang="scss">
.matches-data-table {
  .p-avatar {
    img {
      height: auto;
    }
  }
}
</style>
