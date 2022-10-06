<template>
  <BaseDataTable
    v-model="selectedUsers"
    :items="users"
    :title="$t('common.users')"
    :global-filter-fields="globalFilterFields"
    searchable
  >
    <Column selectionMode="multiple" headerStyle="width: 3rem" />
    <Column
      field="name"
      :header="$t('admin.users.name')"
      sortable
      headerStyle="width:14%; min-width:10rem;"
    >
      <template #body="{ data }">
        <div class="flex align-items-center gap-2">
          <BadgeAvatar :image="data.avatar" />
          {{ data.name }}
        </div>
        <!-- <span class="p-column-title">{{ $t('admin.users.name') }}</span> -->
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
import { computed } from 'vue'
import BaseDataTable from '@/components/Shared/BaseDataTable/BaseDataTable.vue'
import BaseStatus from '@/components/Shared/BaseStatus/BaseStatus.vue'
import BadgeAvatar from '@/components/Shared/BadgeAvatar/BadgeAvatar.vue'

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

const handleEditUser = (user) => emits('edit', user)
const handleDeleteUser = (user) => emits('delete', user)

const globalFilterFields = ['name', 'email', 'role']
</script>
