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
        <ul class="navbar-nav me-auto mb-lg-0">
          <li class="nav-item">
            <router-link
              class="nav-link d-flex align-items-center gap-2"
              active-class="text-primary"
              :to="{ name: 'Home' }"
            >
              <font-awesome-icon icon="fa-solid fa-home" />
              {{ $t('common.menu.home') }}
            </router-link>
          </li>
        </ul>
        <ul class="navbar-nav mr-auto mb-lg-0">
          <li class="nav-item" v-if="auth.isAdmin">
            <router-link
              class="nav-link d-flex align-items-center gap-2 px-2"
              active-class="text-primary"
              :to="switchApp.to"
            >
              <font-awesome-icon :icon="switchApp.icon" />
              {{ switchApp.label }}
            </router-link>
          </li>
          <li class="nav-item d-block d-sm-none">
            <router-link
              class="nav-link d-flex align-items-center gap-2 px-2"
              active-class="text-primary"
              :to="{ name: 'MyAccount' }"
            >
              <font-awesome-icon icon="fa-solid fa-user" />
              {{ $t('common.menu.myAccount.myAccount') }}
            </router-link>
          </li>
          <li class="nav-item d-block d-sm-none">
            <a
              href="#"
              class="nav-link d-flex align-items-center gap-3 text-danger px-2"
              data-bs-toggle="modal"
              :data-bs-target="`#logout-confirm-dialog`"
            >
              <font-awesome-icon icon="fa-solid fa-sign-out" />
              {{ $t('common.menu.logout') }}
            </a>
          </li>
        </ul>
        <ul class="navbar-nav mr-auto mb-lg-0 d-none d-lg-block">
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
                  data-bs-toggle="modal"
                  :data-bs-target="`#logout-confirm-dialog`"
                >
                  <font-awesome-icon icon="fa-solid fa-sign-out" />
                  {{ $t('common.menu.logout') }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <BaseConfirmDialog
    target="logout-confirm-dialog"
    :header="$t('common.logout.header')"
    :message="$t('common.logout.message')"
    @hide="handleLogoutDialogHide"
    @submit="handleLogoutDialogSubmit"
  />
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import BaseConfirmDialog from '@/components/Shared/BaseConfirmDialog/BaseConfirmDialog.vue'
import { USER_AVATAR_PLACEHOLDER } from '@/constants'
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

const loggedInMenuLabel = computed(() =>
  i18n.t('common.menu.hi', auth.loggedUser)
)

const loggedInAvatar = computed(
  () => auth.loggedUser?.avatar || USER_AVATAR_PLACEHOLDER
)

const handleLogoutDialogSubmit = (modal) => {
  auth.logout()
  modal.hide()
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
