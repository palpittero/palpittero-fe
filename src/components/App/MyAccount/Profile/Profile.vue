<template>
  <div class="container">
    <main>
      <!-- <div class="col-md-5 col-lg-4">
          <h4 class="d-flex justify-content-between align-items-center mb-3">
            <span class="text-primary">Your cart</span>
            <span class="badge bg-primary rounded-pill">3</span>
          </h4>
          <ul class="list-group mb-3">
            <li class="list-group-item d-flex justify-content-between lh-sm">
              <div>
                <h6 class="my-0">Product name</h6>
                <small class="text-muted">Brief description</small>
              </div>
              <span class="text-muted">$12</span>
            </li>
            <li class="list-group-item d-flex justify-content-between lh-sm">
              <div>
                <h6 class="my-0">Second product</h6>
                <small class="text-muted">Brief description</small>
              </div>
              <span class="text-muted">$8</span>
            </li>
            <li class="list-group-item d-flex justify-content-between lh-sm">
              <div>
                <h6 class="my-0">Third item</h6>
                <small class="text-muted">Brief description</small>
              </div>
              <span class="text-muted">$5</span>
            </li>
            <li class="list-group-item d-flex justify-content-between bg-light">
              <div class="text-success">
                <h6 class="my-0">Promo code</h6>
                <small>EXAMPLECODE</small>
              </div>
              <span class="text-success">−$5</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <span>Total (USD)</span>
              <strong>$20</strong>
            </li>
          </ul>

          <form class="card p-2">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                placeholder="Promo code"
              />
              <button type="submit" class="btn btn-secondary">Redeem</button>
            </div>
          </form>
        </div> -->

      <h4 class="d-flex w-full justify-content-end">
        {{ $t('common.menu.myAccount.profile') }}
      </h4>
      <hr class="mb-5" />
      <form novalidate v-if="user.data">
        <div class="row g-3">
          <ImageInput
            class="col-sm-3 px-5 mb-3"
            v-model="user.data.avatar"
            :label="$t('common.edit')"
            select-button-class="p-button-text"
            :placeholder="USER_AVATAR_PLACEHOLDER"
          />

          <UserProfileForm
            class="col-sm-9"
            :user="user.data"
            :loading="isSaving"
            @submit="handleSubmit"
            @remove="handleRemoveAccount"
          />

          <BaseConfirmDialog
            target="remove-account"
            :visible="isRemoveAccountDialogVisible"
            :message="$t('app.myAccount.profile.removeAccount.message')"
            @hide="handleRemoveAccountDialogHide"
            @submit="handleRemoveAccountDialogSubmit"
          />

          <!-- <RemoveAccountDialog
            :visible="isRemoveAccountDialogVisible"
            @hide="handleRemoveAccountDialogHide"
            @submit="handleRemoveAccountDialogSubmit"
          /> -->
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import services from '@/services'

import UserProfileForm from './UserProfileForm/UserProfileForm.vue'
import BaseConfirmDialog from '@/components/Shared/BaseConfirmDialog/BaseConfirmDialog.vue'
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

    toast(i18n.t('app.myAccount.profile.saved'))

    auth.fetchLoggedUser()
  } catch (error) {
    if (error.response.status === 409) {
      toast.error(i18n.t('admin.auth.error.emailAlreadyInUse'))
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
