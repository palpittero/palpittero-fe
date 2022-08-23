<template>
  <BaseDataTable
    v-model="selectedTeams"
    :items="teams"
    :title="$t('common.teams')"
    searchable
  >
    <Column selectionMode="multiple" headerStyle="width: 3rem" />
    <Column
      field="name"
      :header="$t('admin.teams.name')"
      sortable
      headerStyle="width:14%; min-width:10rem;"
    >
      <template #body="{ data }">
        <!-- <span class="p-column-title">{{ $t('admin.teams.name') }}</span> -->
        {{ data.name }}
      </template>
    </Column>
    <Column
      field="badge"
      :header="$t('admin.teams.badge')"
      sortable
      headerStyle="width:14%; min-width:10rem;"
    >
      <template #body="{ data }">
        <!-- <span class="p-column-title">{{ $t('admin.teams.badge') }}</span> -->
        <Avatar :image="data.badge" size="large" shape="circle" />
      </template>
    </Column>
    <Column
      field="status"
      :header="$t('common.status')"
      sortable
      headerStyle="width:14%; min-width:10rem;"
    >
      <template #body="{ data }">
        <!-- <span class="p-column-title">{{ $t('common.status') }}</span> -->
        <BaseStatus :status="data.status" />
      </template>
    </Column>
    <Column headerStyle="min-width:10rem;">
      <template #body="{ data }">
        <Button
          icon="pi pi-pencil"
          class="p-button-rounded p-button-success mr-2"
          @click="handleEditTeam(data)"
        />
        <Button
          icon="pi pi-trash"
          class="p-button-rounded p-button-warning mt-2"
          @click="handleDeleteTeam(data)"
        />
      </template>
    </Column>
  </BaseDataTable>
</template>

<script setup>
import { computed } from 'vue'
import BaseStatus from '@/components/Shared/BaseStatus/BaseStatus.vue'
import BaseDataTable from '@/components/Shared/BaseDataTable/BaseDataTable.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  teams: {
    type: Object,
    default: () => ({})
  }
})

const emits = defineEmits(['edit', 'delete', 'update:modelValue'])

const selectedTeams = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const handleEditTeam = (team) => emits('edit', team)
const handleDeleteTeam = (team) => emits('delete', team)
</script>
