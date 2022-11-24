<template>
  <BaseDataTable
    v-model="selectedMatches"
    :items="matches"
    :title="$t('common.matches')"
    :global-filter-fields="globalFilterFields"
    searchable
  >
    <Column selectionMode="multiple" />
    <Column field="homeTeam" :header="$t('common.score')" sortable>
      <template #body="{ data }">
        <MatchScore :match="data" />
      </template>
    </Column>
    <Column
      field="championship"
      :header="$t('admin.matches.championship')"
      sortable
    >
      <template #body="{ data }">
        <div>
          <div class="flex flex-column gap-3">
            <div>
              <span class="text-right">
                {{ data.round.championship.name }}
                {{ data.round.championship.year }}
              </span>
            </div>
            <small v-if="data.group">
              {{ data.group.name }}
            </small>
          </div>

          <small> {{ data.round.name }} </small>
        </div>
      </template>
    </Column>
    <Column field="date" :header="$t('admin.matches.date')" sortable>
      <template #body="{ data }">
        <span class="text-right">
          {{ $d(data.date, 'long') }}
        </span>
      </template>
    </Column>
    <Column field="status" :header="$t('common.status')" sortable>
      <template #body="{ data }">
        <div class="flex flex-column gap-2">
          <BaseStatus :status="data.status" :options="MATCH_STATUSES_LABELS" />
          <MatchNoResult v-if="matchHasNoResult(data)" />
        </div>
      </template>
    </Column>
    <Column>
      <template #body="{ data }">
        <div class="flex gap-2">
          <Button
            icon="pi pi-pencil"
            class="p-button p-button-info p-button-sm"
            :label="$t('common.edit')"
            @click="handleEditMatch(data)"
          />

          <Button
            v-if="canSetMatchResult(data)"
            icon="pi pi-check-square"
            class="p-button p-button-primary p-button-sm"
            :label="$t('admin.matches.updateResult')"
            @click="handleSetMatchResult(data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button p-button-danger p-button-sm"
            :label="$t('common.remove')"
            @click="handleDeleteMatch(data)"
          />
        </div>
      </template>
    </Column>
  </BaseDataTable>
</template>

<script setup>
import { computed } from 'vue'
import { matchHasNoResult } from '@/helpers/matches'

import BaseStatus from '@/components/Shared/BaseStatus/BaseStatus.vue'
import BaseDataTable from '@/components/Shared/BaseDataTable/BaseDataTable.vue'
import MatchScore from '@/components/Shared/Matches/MatchScore/MatchScore.vue'
import MatchNoResult from '@/components/Shared/Matches/MatchNoResult.vue'

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

const globalFilterFields = [
  'homeTeam.name',
  'awayTeam.name',
  'round.name',
  'round.championship.name'
]

const emits = defineEmits(['edit', 'delete', 'set-result', 'update:modelValue'])

const selectedMatches = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const isScheduled = (match) => match.status === MATCH_STATUSES.SCHEDULED
const isCanceled = (match) => match.status === MATCH_STATUSES.CANCELLED
const isPostponed = (match) => match.status === MATCH_STATUSES.POSTPONED

const canSetMatchResult = (match) =>
  !isScheduled(match) && !isCanceled(match) && !isPostponed(match)

const handleEditMatch = (match) => emits('edit', match)
const handleDeleteMatch = (match) => emits('delete', match)
const handleSetMatchResult = (match) => emits('set-result', match)
</script>
