<template>
  <nav class="navbar navbar-expand-lg sticky-top bg-light p-0">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <Logo class="m-0" />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              class="nav-link active py-3"
              aria-current="page"
              :to="{ name: 'Home' }"
            >
              {{ $t('common.menu.home') }}
            </router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Dropdown
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Action</a></li>
              <li><a class="dropdown-item" href="#">Another action</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#">Something else here</a></li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled">Disabled</a>
          </li>
        </ul>
        <ul
          v-if="auth.isAdmin"
          class="btn btn-outline-primary navbar-nav mr-auto mb-2 mb-lg-0 p-2"
        >
          <li>
            <router-link
              class="dropdown-item d-flex align-items-center gap-3"
              :to="switchApp.to"
            >
              <font-awesome-icon :icon="switchApp.icon" />
              {{ switchApp.label }}
            </router-link>
          </li>
        </ul>
        <ul class="navbar-nav mr-auto mb-2 mb-lg-0">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle d-flex align-items-center gap-2"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                class="img-fluid rounded-circle app-topbar__avatar"
                :src="loggedInAvatar"
              />
              {{ loggedInMenuLabel }}
            </a>
            <ul class="dropdown-menu dropdown-menu--right">
              <li>
                <router-link
                  class="dropdown-item d-flex align-items-center gap-3"
                  :to="{ name: 'MyAccount' }"
                >
                  <font-awesome-icon icon="fa-solid fa-user" />
                  {{ $t('common.menu.myAccount.myAccount') }}
                </router-link>
              </li>

              <li><hr class="dropdown-divider" /></li>
              <li>
                <a
                  href="#"
                  class="dropdown-item d-flex align-items-center gap-3 text-danger"
                  @click="handleLogout"
                >
                  <font-awesome-icon icon="fa-solid fa-sign-out" />
                  {{ $t('common.menu.logout') }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
        <!-- <form class="d-flex" role="search">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form> -->
      </div>
    </div>
  </nav>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <img alt="Logo" :src="topbarImage" />
      <span class="flex flex-column"> Palpittero </span>
    </router-link>
    <button
      class="p-link layout-menu-button layout-topbar-button"
      @click="onMenuToggle"
    >
      <span class="pi pi-bars" />
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
        {{ switchAppLabel }}
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
  <!-- <div
    v-if="!isProduction"
    class="app-top-bar text-white flex flex-column justify-content-center align-items-center gap-2 w-full p-2 absolute text-bold"
  >
    <div class="flex justify-content-center align-items-center gap-2">
      <span class="pi pi-exclamation-triangle" />
      {{ $t('common.env') }}
    </div>
    <span>
      <a class="text-white" href="https://palpittero.com.br">{{
        $t('common.clickHere')
      }}</a>
      {{ $t('common.accessRightVersion') }}
    </span>
  </div> -->

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
import { Logo } from '@/components/Common'

const router = useRouter()
const i18n = useI18n()
const auth = useAuthStore()

const props = defineProps({
  isAdmin: Boolean
})

const switchApp = computed(() =>
  props.isAdmin
    ? {
        icon: 'fa-solid fa-display',
        label: i18n.t('common.menu.palpittero'),
        to: { name: 'Home' }
      }
    : {
        icon: 'fa-solid fa-gears',
        label: i18n.t('common.menu.adminPanel'),
        to: { name: 'AdminDashboard' }
      }
)

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
  () => auth.loggedUser?.avatar || USER_AVATAR_PLACEHOLDER
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

<style lang="scss">
.app-topbar {
  &__avatar {
    max-width: 30px !important;
  }
}
.app-top-bar {
  background-color: red;
  font-size: 16px;
  top: 4.5rem;

  a {
    text-decoration: underline;
  }
}
</style>
