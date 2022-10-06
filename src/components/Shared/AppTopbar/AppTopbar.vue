<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <img alt="Logo" :src="topbarImage" />
      <span>Palpittero</span>
    </router-link>
    <button
      class="p-link layout-menu-button layout-topbar-button"
      @click="onMenuToggle"
    >
      <i class="pi pi-bars"></i>
    </button>

    <button
      class="p-link layout-topbar-menu-button layout-topbar-button"
      v-styleclass="{
        selector: '@next',
        enterClass: 'hidden',
        enterActiveClass: 'scalein',
        leaveToClass: 'hidden',
        leaveActiveClass: 'fadeout',
        hideOnOutsideClick: true
      }"
    >
      <i class="pi pi-ellipsis-v"></i>
    </button>
    <ul class="layout-topbar-menu hidden lg:flex origin-top gap-2">
      <li v-if="auth.isAdmin">
        <slot name="switch-app" />
      </li>
      <li class="block lg:hidden">
        <router-link :to="{ name: 'MyAccount' }">
          <button class="p-link layout-topbar-button p-3">
            <i class="pi pi-user" />
            <span>{{ $t('common.menu.myAccount.myAccount') }}</span>
          </button>
        </router-link>
      </li>
      <li class="block lg:hidden">
        <button @click="handleLogout" class="p-link layout-topbar-button p-3">
          <i class="pi pi-sign-out" />
          <span>{{ $t('common.menu.logout') }}</span>
        </button>
      </li>
      <li></li>
      <li>
        <SplitButton
          :model="items"
          class="p-button-text p-button-plain mr-2 mb-2 hidden lg:flex align-items-center gap-2"
        >
          <BadgeAvatar :image="loggedInAvatar" size="small" type="user" />
          {{ loggedInMenuLabel }}
        </SplitButton>
      </li>
    </ul>
  </div>

  <BaseConfirmDialog
    v-if="isLogoutDialogVisible"
    :header="$t('common.logout.header')"
    :message="$t('common.logout.message')"
    :visible="isLogoutDialogVisible"
    @hide="handleLogoutDialogHide"
    @submit="handleLogoutDialogSubmit"
  />
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import BaseConfirmDialog from '@/components/Shared/BaseConfirmDialog/BaseConfirmDialog.vue'
import { USER_AVATAR_PLACEHOLDER } from '@/constants'
import BadgeAvatar from '@/components/Shared/BadgeAvatar/BadgeAvatar.vue'

const router = useRouter()
const i18n = useI18n()
const auth = useAuthStore()

const isLogoutDialogVisible = ref(false)

const emit = defineEmits(['menu-toggle', 'topbar-menu-toggle'])

const onMenuToggle = (event) => {
  emit('menu-toggle', event)
}

const handleLogout = () => (isLogoutDialogVisible.value = true)

const topbarImage = '/images/logo-dark.svg'

const items = [
  {
    label: i18n.t('common.menu.myAccount.myAccount'),
    icon: 'pi pi-user',
    command() {
      router.push({ name: 'Profile' })
    }
  },
  {
    label: i18n.t('common.menu.logout'),
    icon: 'pi pi-sign-out',
    command: handleLogout
  }
]

const loggedInMenuLabel = computed(() =>
  i18n.t('common.menu.hi', auth.loggedUser)
)

const loggedInAvatar = computed(
  () => auth.loggedUser.avatar || USER_AVATAR_PLACEHOLDER
)

const handleLogoutDialogHide = () => (isLogoutDialogVisible.value = false)

const handleLogoutDialogSubmit = () => {
  auth.logout()
  handleLogoutDialogHide()
  router.push({
    name: 'Login'
  })
}
</script>
