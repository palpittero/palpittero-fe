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
      headerStyle="width:20%; min-width:10rem;"
    >
      <template #body="{ data }">
        <div class="flex align-items-center gap-3">
          <BadgeAvatar :image="data.badge" />
          {{ data.name }}
        </div>
      </template>
    </Column>
    <Column
      field="type"
      :header="$t('admin.teams.type')"
      sortable
      headerStyle="width:14%; min-width:10rem;"
    >
      <template #body="{ data }">
        {{ $t(`admin.teams.${data.type}`) }}
      </template>
    </Column>
    <Column
      field="country"
      :header="$t('admin.teams.country')"
      sortable
      headerStyle="width:14%; min-width:10rem;"
    >
      <template #body="{ data }">
        <template v-if="data.country">
          {{ data.country ? data.country.name : '-' }}
          <div v-if="data.nationalDivision">
            <small
              >(<span v-if="data.region">{{ data.region }} / </span
              >{{ $t('admin.teams.nationalDivision') }}
              {{ data.nationalDivision }})</small
            >
          </div>
        </template>
        <template v-else> - </template>
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
        <div class="flex gap-2">
          <Button
            icon="pi pi-pencil"
            class="p-button p-button-info p-button-sm mr-2"
            :label="$t('common.edit')"
            @click="handleEditTeam(data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button p-button-danger p-button-sm"
            :label="$t('common.remove')"
            @click="handleDeleteTeam(data)"
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
import BadgeAvatar from '@/components/Shared/BadgeAvatar/BadgeAvatar.vue'

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
