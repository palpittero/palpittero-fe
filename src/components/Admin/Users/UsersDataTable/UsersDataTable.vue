<template>
  <BaseDataTable
    v-model="selectedUsers"
    :items="users"
    :title="$t('common.users')"
  >
    <template #header>
      <div
        class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
      >
        <h5 class="m-0">{{ $t('common.users') }}</h5>
        <span class="block mt-2 md:mt-0 p-input-icon-left">
          <i class="pi pi-search" />
          <InputText
            v-model="filters['global'].value"
            :placeholder="$t('common.search')"
          />
        </span>
      </div>
    </template>

    <Column selectionMode="multiple" headerStyle="width: 3rem" />
    <Column
      field="name"
      :header="$t('admin.users.name')"
      sortable
      headerStyle="width:14%; min-width:10rem;"
    >
      <template #body="{ data }">
        <!-- <span class="p-column-title">{{ $t('admin.users.name') }}</span> -->
        {{ data.name }}
      </template>
    </Column>
    <Column
      field="email"
      :header="$t('admin.users.email')"
      sortable
      headerStyle="width:14%; min-width:10rem;"
    >
      <template #body="{ data }">
        <!-- <span class="p-column-title">{{ $t('admin.users.email') }}</span> -->
        {{ data.email }}
      </template>
    </Column>
    <Column
      field="role"
      :header="$t('admin.users.role')"
      sortable
      headerStyle="width:14%; min-width:10rem;"
    >
      <template #body="{ data }">
        <!-- <span class="p-column-title">{{ $t('admin.users.role') }}</span> -->
        {{ data.role }}
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
          @click="handleEditUser(data)"
        />
        <Button
          icon="pi pi-trash"
          class="p-button-rounded p-button-warning mt-2"
          @click="handleDeleteUser(data)"
        />
      </template> </Column
  ></BaseDataTable>
</template>

<script setup>
import { FilterMatchMode } from 'primevue/api'
import { computed, reactive } from 'vue'
import BaseDataTable from '@/components/Shared/BaseDataTable/BaseDataTable.vue'
import BaseStatus from '@/components/Shared/BaseStatus/BaseStatus.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  users: {
    type: Object,
    default: () => ({})
  }
})

const emits = defineEmits(['edit', 'delete', 'update:modelValue'])

const selectedUsers = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const filters = reactive({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

const handleEditUser = (user) => emits('edit', user)
const handleDeleteUser = (user) => emits('delete', user)
</script>
