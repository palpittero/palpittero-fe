<template>
  <BaseDataTable
    v-model="selectedChampionships"
    :items="championships"
    :title="$t('common.championships')"
    searchable
    paginator
  >
    <Column selectionMode="multiple" headerStyle="width: 3rem" />
    <Column
      field="name"
      :header="$t('admin.championships.name')"
      sortable
      headerStyle="width:14%; min-width:10rem;"
    >
      <template #body="{ data }">
        {{ data.name }}
      </template>
    </Column>
    <Column
      field="year"
      :header="$t('admin.championships.year')"
      sortable
      headerStyle="width:14%; min-width:10rem;" />
    <Column
      field="teams"
      :header="$t('admin.championships.teams')"
      sortable
      headerStyle="min-width:5rem;"
    >
      <template #body="{ data }">
        {{ data.teams.length }}
      </template>
    </Column>

    <Column
      field="groups"
      :header="$t('admin.championships.groups')"
      sortable
      headerStyle="min-width:5rem;"
    >
      <template #body="{ data }">
        {{ data.hasGroups ? data.groups.length : '-' }}
      </template>
    </Column>

    <Column
      field="rounds"
      :header="$t('admin.championships.rounds')"
      sortable
      headerStyle="min-width:5rem;"
    >
      <template #body="{ data }">
        {{ data.rounds.length }}
      </template>
    </Column>
    <Column
      field="status"
      :header="$t('common.status')"
      sortable
      headerStyle="width:14%; min-width:10rem;"
    >
      <template #body="{ data }">
        <BaseStatus :status="data.status" />
      </template>
    </Column>
    <Column headerStyle="min-width:14rem;">
      <template #body="{ data }">
        <div class="flex flex-column md:flex-row gap-2 w-full">
          <Button
            icon="pi pi-pencil"
            class="flex-1 p-button p-button-info p-button-sm"
            :label="$t('common.edit')"
            @click="handleEditChampionship(data)"
          />
          <Button
            icon="pi pi-star-fill"
            class="flex-1 p-button p-button-primary p-button-sm"
            :label="$t('admin.championships.setRanking')"
            @click="handleSetRanking(data)"
          />
          <Button
            icon="pi pi-trash"
            class="flex-1 p-button p-button-danger p-button-sm"
            :label="$t('common.remove')"
            @click="handleDeleteChampionship(data)"
          />
        </div>
      </template> </Column
  ></BaseDataTable>
</template>

<script setup>
import { computed } from 'vue'
import BaseDataTable from '@/components/Shared/BaseDataTable/BaseDataTable.vue'
import BaseStatus from '@/components/Shared/BaseStatus/BaseStatus.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  championships: {
    type: Object,
    default: () => ({})
  }
})

const emits = defineEmits(['edit', 'delete', 'ranking', 'update:modelValue'])

const selectedChampionships = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const handleEditChampionship = (championship) => emits('edit', championship)
const handleDeleteChampionship = (championship) => emits('delete', championship)
const handleSetRanking = (championship) => emits('ranking', championship)
</script>
