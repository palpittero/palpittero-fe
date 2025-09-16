<script setup lang="ts">
import UserModalForm from '@/components/Admin/Users/UserModalForm.vue'
import UsersDataTable from '@/components/Admin/Users/UsersDataTable.vue'
import services from '@/services'
import type { iState, iUser } from '@/types'
import { onMounted, reactive, ref } from 'vue'

const userId = ref<number>(0)

const handleAdd = () => {
  // @ts-ignore
  user_modal_form.showModal()
}

const handleEdit = async (row: iUser) => {
  userId.value = row.id!
  // @ts-ignore
  user_modal_form.showModal()
}

const handleSuccess = () => {
  // @ts-ignore
  user_modal_form.close()
  loadUsers()
}

const handleCancel = () => {
  userId.value = 0
}

const users = reactive<iState<iUser[]>>({
  loading: false,
  error: null,
  data: [],
})

const loadUsers = async () => {
  try {
    users.loading = true
    users.data = await services.users.fetchUsers()
  } catch (error: any) {
    users.error = error.message
  } finally {
    users.loading = false
  }
}

onMounted(loadUsers)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold flex gap-2 items-center">
        <i class="fa-solid fa-users" />
        Usuários
      </h1>

      <div class="flex gap-2 items-center">
        <!-- <button class="btn btn-secondary">
        <i class="fa-solid fa-trash" />
        Remover Selecionados
      </button> -->
        <button class="btn btn-primary" @click="handleAdd">
          <i class="fa-solid fa-plus" />
          Novo usuário
        </button>
      </div>
    </div>
    <UsersDataTable :state="users" @edit="handleEdit" />
  </div>
  <UserModalForm :user-id="userId" @success="handleSuccess" @cancel="handleCancel" />
</template>
