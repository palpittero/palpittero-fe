<template>
  <BaseDataTable
    v-model="selectedLeagues"
    :items="leagues"
    :title="$t('common.leagues')"
    class="leagues-data-table"
    searchable
  >
    <Column selectionMode="multiple" headerStyle="width: 3rem" />
    <Column
      field="name"
      :header="$t('admin.leagues.name')"
      sortable
      headerStyle="width:30%; min-width:10rem;"
    >
      <template #body="{ data }">
        <div class="flex align-items-center gap-3">
          <BadgeAvatar :image="data.badge" />

          {{ data.name }}
        </div>
      </template>
    </Column>
    <Column
      field="private"
      :header="$t('admin.leagues.private')"
      sortable
      headerStyle="width:14%; min-width:10rem;"
    >
      <template #body="{ data }">
        <BaseStatus :status="data.private" :options="BINARY_LABELS" />
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
    <Column>
      <template #body="{ data }">
        <div class="flex gap-2">
          <Button
            icon="pi pi-pencil"
            class="p-button p-button-info p-button-sm"
            :label="$t('common.edit')"
            @click="handleEditLeague(data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button p-button-danger p-button-sm"
            :label="$t('common.remove')"
            @click="handleDeleteLeague(data)"
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

import { BINARY_LABELS } from '@/constants'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  leagues: {
    type: Object,
    default: () => ({})
  }
})

const emits = defineEmits(['edit', 'delete', 'update:modelValue'])

const selectedLeagues = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const handleEditLeague = (league) => emits('edit', league)
const handleDeleteLeague = (league) => emits('delete', league)
</script>

<style lang="scss">
.leagues-data-table {
  .p-avatar {
    img {
      height: auto;
    }
  }
}
</style>
