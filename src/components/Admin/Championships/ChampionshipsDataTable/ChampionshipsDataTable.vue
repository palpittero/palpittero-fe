<template>
  <BaseDataTable
    v-model="selectedChampionships"
    :items="championships"
    :title="$t('common.championships')"
    searchable
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
      headerStyle="width:14%; min-width:10rem;"
    >
      <template #body="{ data }">
        {{ data.teams.length }}
      </template>
    </Column>

    <Column
      field="rounds"
      :header="$t('admin.championships.rounds')"
      sortable
      headerStyle="width:14%; min-width:10rem;"
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
    <Column headerStyle="min-width:10rem;">
      <template #body="{ data }">
        <div>
          <Button
            icon="pi pi-pencil"
            class="p-button p-button-info p-button-sm mr-2"
            :label="$t('common.edit')"
            @click="handleEditChampionship(data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button p-button-danger p-button-sm"
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

const emits = defineEmits(['edit', 'delete', 'update:modelValue'])

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
</script>
