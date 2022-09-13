<template>
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
      <Avatar
        v-else
        shape="circle"
        size="xlarge"
        :image="avatar.image"
        :label="avatar.label"
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
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import services from '@/services'

import UserProfileForm from './UserProfileForm/UserProfileForm.vue'
import RemoveAccountDialog from './RemoveAccountDialog/RemoveAccountDialog.vue'

const toast = useToast()
const i18n = useI18n()
const router = useRouter()
const { logout, loggedUser } = useAuthStore()

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

const avatar = computed(() => {
  if (user.value.data.avatar) {
    return {
      image: user.value.data.avatar
    }
  }

  // eslint-disable-next-line no-unsafe-optional-chaining
  const [firstName, lastName] = user.value.data?.name?.split(' ')
  const label = firstName
    ? lastName
      ? `${firstName[0]}${lastName[0]}`
      : `${firstName[0]}${firstName[1]}`
    : null

  return { label }
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
  await services.users.deleteUser(loggedUser)
  logout()
  router.push({ name: 'AccountRemoved' })
}
</script>

<style lang="scss" scoped>
.p-avatar.p-avatar-xl {
  width: 15rem;
  height: 15rem;
}
</style>
