<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="flex gap-2 flex-column md:flex-row">
              <Button
                :label="$t('admin.users.newUser')"
                icon="pi pi-plus"
                class="p-button-success"
                @click="handleNewUser"
              />
              <Button
                :label="$t('common.removeSelected')"
                icon="pi pi-trash"
                class="p-button-danger"
                @click="handleDeleteUsers"
                :disabled="!selectedUsers || !selectedUsers?.length"
              />
            </div>
          </template>

          <!-- <template v-slot:end>
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
          </template> -->
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
          :submitting="isSubmitting"
          @hide="handleDetailsDialogHide"
          @submit="handleDetailsDialogSubmit"
        />

        <UserDeleteDialog
          :visible="isUserDeleteDialogOpen"
          :users="user"
          :submitting="isSubmitting"
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
const isSubmitting = ref(false)

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
    isSubmitting.value = true
    if (user.id) {
      await services.users.updateUser(user)
    } else {
      await services.users.createUser(user)
    }

    toast.add({
      group: 'app',
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
        group: 'app',
        severity: 'error',
        summary: i18n.t('common.error'),
        detail: i18n.t('admin.auth.error.emailAlreadyInUse'),
        life: 4000
      })
    }
  } finally {
    isSubmitting.value = false
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

const handleDeleteDialogSubmit = async (users) => {
  isSubmitting.value = true
  const ids = users.map(({ id }) => id)
  await services.users.deleteUsers(ids)

  toast.add({
    group: 'app',
    severity: 'success',
    summary: i18n.t('common.success'),
    detail: i18n.t('admin.users.deleteSuccess'),
    life: 4000
  })

  handleDeleteDialogHide()
  isSubmitting.value = false
  loadUsers()
}
</script>
