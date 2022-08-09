<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toast />
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button
                label="New"
                icon="pi pi-plus"
                class="p-button-success mr-2"
                @click="handleNewUser"
              />
              <Button
                label="Delete"
                icon="pi pi-trash"
                class="p-button-danger"
                @click="handleDeleteUsers"
                :disabled="!selectedUsers || !selectedUsers?.length"
              />
            </div>
          </template>

          <template v-slot:end>
            <FileUpload
              mode="basic"
              accept="image/*"
              :maxFileSize="1000000"
              label="Import"
              chooseLabel="Import"
              class="mr-2 inline-block"
            />
            <Button
              label="Export"
              icon="pi pi-upload"
              class="p-button-help"
              @click="exportCSV($event)"
            />
          </template>
        </Toolbar>

        <UsersDataTable
          v-model="selectedUsers"
          :users="users"
          @edit="handleEditUser"
          @delete="handleDeleteUser"
        />

        <UserDetailsDialog
          v-model="user"
          :visible="isUserDetailsDialogVisible"
          :submitted="submitted"
          @hide="handleDetailsDialogHide"
          @submit="handleDetailsDialogSubmit"
        />

        <UserDeleteDialog
          :visible="isUserDeleteDialogOpen"
          :users="user"
          @hide="handleDeleteDialogHide"
          @submit="handleDeleteDialogSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import UsersDataTable from './UsersDataTable/UsersDataTable.vue'
import UserDetailsDialog from './UserDetailsDialog/UserDetailsDialog.vue'
import UserDeleteDialog from './UserDeleteDialog/UserDeleteDialog.vue'

import { USER_MODEL } from '@/constants/users'
import services from '@/services'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { clone } from 'lodash'

const i18n = useI18n()
const toast = useToast()

const user = reactive({})
const users = reactive({
  loading: false,
  error: null,
  data: []
})

const isUserDetailsDialogVisible = ref(false)
const isUserDeleteDialogOpen = ref(false)
const selectedUsers = ref([])

onMounted(() => loadUsers())

const loadUsers = async () => {
  try {
    users.loading = true
    users.data = await services.users.fetchUsers()
  } catch (error) {
    users.error = error.message
  } finally {
    users.loading = false
  }
}

const handleNewUser = () => {
  user.value = clone(USER_MODEL)
  isUserDetailsDialogVisible.value = true
}

const handleDetailsDialogSubmit = async (user) => {
  try {
    if (user.id) {
      await services.users.updateUser(user)
    } else {
      await services.users.createUser(user)
    }

    toast.add({
      severity: 'success',
      summary: i18n.t('common.success'),
      detail: i18n.t('admin.users.saveSuccess'),
      life: 4000
    })

    handleDetailsDialogHide()
    loadUsers()
  } catch (error) {
    if (error.response.status === 409) {
      toast.add({
        severity: 'error',
        summary: i18n.t('common.error'),
        detail: i18n.t('admin.auth.error.emailAlreadyInUse'),
        life: 3000,
        group: 'app'
      })
    }
  }
}

const handleDetailsDialogHide = () => {
  isUserDetailsDialogVisible.value = false
}

const handleEditUser = (row) => {
  user.value = { ...row }
  isUserDetailsDialogVisible.value = true
}

const handleDeleteUser = (row) => {
  user.value = [{ ...row }]
  isUserDeleteDialogOpen.value = true
}

const handleDeleteUsers = () => {
  user.value = selectedUsers.value
  isUserDeleteDialogOpen.value = true
}

const handleDeleteDialogHide = () => (isUserDeleteDialogOpen.value = false)

const handleDeleteDialogSubmit = (user) => console.log('should delete', user)
</script>

<style scoped lang="scss">
@import '@/assets/demo/badges.scss';
</style>
