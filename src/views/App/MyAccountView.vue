<script setup lang="ts">
import PageBreadcrumbs from '@/components/Shared/PageBreadcrumbs.vue'
import ProfileForm, { type iProfile } from '@/components/App/MyAccount/ProfileForm.vue'
import { onMounted, reactive, ref } from 'vue'

import { useAuthStore, useToastStore } from '@/stores'
import { storeToRefs } from 'pinia'
import ChangePasswordForm, {
  type iCredentials,
} from '@/components/App/MyAccount/ChangePasswordForm.vue'
import services from '@/services'

const authStore = useAuthStore()
const { loggedUser } = storeToRefs(authStore)

const toastStore = useToastStore()

const submittingProfile = ref<boolean>(false)
const profile = reactive<iProfile>({
  name: '',
  email: '',
  avatar: '',
})

const submittingChangePassword = ref<boolean>(false)
const credentials = reactive({
  currentPassword: '',
  newPassword: '',
  newPasswordConfirmation: '',
})

onMounted(() => {
  profile.name = loggedUser.value?.name ?? ''
  profile.email = loggedUser.value?.email ?? ''
  profile.avatar = loggedUser.value?.avatar ?? ''
})

const handleProfileSubmit = async (data: iProfile) => {
  try {
    submittingProfile.value = true

    await services.users.updateUser({
      id: loggedUser.value?.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
    })

    toastStore.success('Dados atualizados com sucesso')
  } catch (error: any) {
    console.log(error)
    if (error.response.status === 409) {
      toastStore.error('E-mail já está em uso')
    }
  } finally {
    submittingProfile.value = false
  }
}

const handleChangePasswordSubmit = async (data: iCredentials) => {
  try {
    submittingChangePassword.value = true

    await services.auth.updatePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })

    toastStore.success('Senha atualizada com sucesso')
  } catch (error: any) {
    if (error.response.status === 400) {
      toastStore.error('Senha atual incorreta')
    }
  } finally {
    submittingChangePassword.value = false
  }
}
</script>

<template>
  <PageBreadcrumbs
    :items="[
      { label: 'Início', to: { name: 'app.index' } },
      { label: 'Minha Conta', to: { name: 'app.my-account' } },
    ]"
  />
  <div class="flex flex-col gap-4">
    <ProfileForm v-model="profile" @submit="handleProfileSubmit" :loading="submittingProfile" />
    <ChangePasswordForm
      v-model="credentials"
      @submit="handleChangePasswordSubmit"
      :loading="submittingChangePassword"
    />
  </div>
</template>
