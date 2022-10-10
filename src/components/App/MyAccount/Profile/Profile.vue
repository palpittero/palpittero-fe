<template>
  <div class="profile">
    <h1>
      {{ $t('common.menu.myAccount.profile') }}
    </h1>
    <div class="surface-section grid p-5">
      <div class="col-3 justify-content-center flex">
        <Skeleton
          v-if="user.loading"
          shape="circle"
          height="180px"
          width="180px"
          class="mb-3"
        />
        <ImageInput
          v-else
          class-name="flex-column"
          v-model="user.data.avatar"
          :label="$t('common.edit')"
          select-button-class="p-button-text"
          :placeholder="USER_AVATAR_PLACEHOLDER"
        />
      </div>
      <Divider layout="vertical" class="col-1" />
      <div class="col-7">
        <template v-if="user.loading">
          <Skeleton width="30%" height="10%" class="mb-3" />
          <Skeleton width="100%" height="10%" class="mb-3" />

          <Skeleton width="30%" height="10%" class="mb-3" />
          <Skeleton width="100%" height="10%" class="mb-3" />

          <Divider class="my-5" />

          <Skeleton width="100%" height="10%" class="mb-3" />
        </template>
        <template v-else>
          <UserProfileForm
            :user="user.data"
            @submit="handleSubmit"
            :loading="isSaving"
          />

          <Divider class="my-5" />

          <div class="flex justify-content-end">
            <Button
              :label="$t('app.myAccount.profile.removeAccount.title')"
              icon="pi pi-trash"
              class="p-button-danger"
              @click="handleRemoveAccount"
              :disabled="isSaving"
            />

            <RemoveAccountDialog
              :visible="isRemoveAccountDialogVisible"
              @hide="handleRemoveAccountDialogHide"
              @submit="handleRemoveAccountDialogSubmit"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import services from '@/services'

import UserProfileForm from './UserProfileForm/UserProfileForm.vue'
import RemoveAccountDialog from './RemoveAccountDialog/RemoveAccountDialog.vue'
import ImageInput from '@/components/Shared/ImageInput/ImageInput.vue'

import { USER_AVATAR_PLACEHOLDER } from '@/constants'

const toast = useToast()
const i18n = useI18n()
const router = useRouter()
const auth = useAuthStore()

const user = ref({
  loading: true,
  error: null,
  data: null
})

const isSaving = ref(false)
const isRemoveAccountDialogVisible = ref(false)

onMounted(async () => {
  user.value.loading = true
  user.value.data = await services.auth.fetchLoggedUser()
  user.value.loading = false
})

const handleSubmit = async ({ id, name, email, avatar }) => {
  try {
    isSaving.value = true
    await services.users.updateUser({ id, name, email, avatar })

    toast.add({
      severity: 'success',
      summary: i18n.t('common.success'),
      detail: i18n.t('app.myAccount.profile.saved'),
      life: 4000,
      group: 'app'
    })

    auth.fetchLoggedUser()
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
  } finally {
    isSaving.value = false
  }
}
const handleRemoveAccount = () => {
  isRemoveAccountDialogVisible.value = true
}

const handleRemoveAccountDialogHide = () =>
  (isRemoveAccountDialogVisible.value = false)

const handleRemoveAccountDialogSubmit = async () => {
  isRemoveAccountDialogVisible.value = false
  await services.users.deleteUser(auth.loggedUser)
  auth.logout()
  router.push({ name: 'AccountRemoved' })
}
</script>

<style lang="scss">
.profile {
  .p-avatar.p-avatar-xl {
    width: 15rem;
    height: 15rem;
  }
}
</style>
