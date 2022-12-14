<template>
  <nav
    class="app-topbar navbar navbar-expand-lg sticky-top navbar-dark bg-primary px-0"
  >
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <Logo class="m-0" />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#app-top-bar"
        aria-controls="app-top-bar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div class="collapse navbar-collapse" id="app-top-bar">
        <ul class="navbar-nav me-auto mb-lg-0">
          <li class="nav-item">
            <router-link
              class="nav-link d-flex align-items-center gap-2"
              :to="{ name: 'Home' }"
            >
              <font-awesome-icon icon="fas fa-home" />
              {{ $t('common.menu.home') }}
            </router-link>
          </li>
        </ul>
        <ul class="navbar-nav mr-auto mb-lg-0">
          <li class="nav-item" v-if="auth.isAdmin">
            <router-link
              class="nav-link d-flex align-items-center gap-2"
              :to="switchApp.to"
            >
              <font-awesome-icon :icon="switchApp.icon" />
              {{ switchApp.label }}
            </router-link>
          </li>
          <li class="nav-item d-block d-sm-none">
            <router-link
              class="nav-link d-flex align-items-center gap-2"
              :to="{ name: 'MyAccount' }"
            >
              <font-awesome-icon icon="fas fa-user" />
              {{ $t('common.menu.myAccount.myAccount') }}
            </router-link>
          </li>
          <ThemeSwitcher class="d-lg-none" />
          <li class="nav-item d-block d-sm-none">
            <a
              href="#"
              class="nav-link d-flex align-items-center gap-2"
              data-bs-toggle="modal"
              :data-bs-target="`#logout-confirm-dialog`"
            >
              <font-awesome-icon icon="fas fa-sign-out" />
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
                  class="dropdown-item d-flex align-items-center gap-2"
                  :to="{ name: 'MyAccount' }"
                >
                  <font-awesome-icon icon="fas fa-user" />
                  {{ $t('common.menu.myAccount.myAccount') }}
                </router-link>
              </li>

              <li><hr class="dropdown-divider" /></li>
              <li>
                <a
                  href="#"
                  class="dropdown-item d-flex align-items-center gap-2"
                  data-bs-toggle="modal"
                  data-bs-target="#logout-confirm-dialog"
                >
                  <font-awesome-icon icon="fas fa-sign-out" />
                  {{ $t('common.menu.logout') }}
                </a>
              </li>
            </ul>
          </li>
        </ul>

        <ThemeSwitcher class="d-none d-lg-block" />
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

import { Logo } from '@/components/Common'
import BaseConfirmDialog from '@/components/Shared/BaseConfirmDialog/BaseConfirmDialog.vue'
import ThemeSwitcher from '@/components/Shared/ThemeSwitcher/ThemeSwitcher.vue'

import { USER_AVATAR_PLACEHOLDER } from '@/constants'

const router = useRouter()
const i18n = useI18n()
const auth = useAuthStore()

const props = defineProps({
  isAdmin: Boolean
})

const switchApp = computed(() =>
  props.isAdmin
    ? {
        icon: 'fas fa-display',
        label: i18n.t('common.menu.palpittero'),
        to: { name: 'Home' }
      }
    : {
        icon: 'fas fa-gears',
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
