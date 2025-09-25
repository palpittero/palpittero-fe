<script setup lang="ts">
import { useAuthStore } from '@/stores'
import LogoutConfirmationModal from '@/components/App/Auth/LogoutConfirmationModal.vue'
import { storeToRefs } from 'pinia'
import BaseImage from '../Shared/BaseImage.vue'
import { ref } from 'vue'
import MyAccountModalForm from '@/components/App/Auth/MyAccountModalForm.vue'

const authStore = useAuthStore()
const { loggedUser, isAdmin } = storeToRefs(authStore)

const handleMyAccount = () => {
  // @ts-ignore
  my_account_modal_form.showModal()
}

const handleMyAccountSuccess = () => {
  // @ts-ignore
  my_account_modal_form.close()
}

const handleLogoutConfirmation = () => {
  // @ts-ignore
  logout_confirmation_modal.showModal()
}

const handleLogout = () => {
  authStore.logout()
}

const isAdminPanelOpen = ref<boolean>(false)
</script>

<template>
  <div class="navbar bg-base-100 shadow-lg sticky top-0 z-[51]">
    <div class="navbar-start">
      <!-- Mobile menu -->
      <div class="dropdown lg:hidden">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
          <i class="fa-solid fa-bars" />
        </div>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-64 mt-3 gap-1"
        >
          <li>
            <router-link
              class="text-sm"
              :to="{ name: 'app.index' }"
              exact-active-class="menu-active"
            >
              <i class="fa-solid fa-house" /> Início
            </router-link>
          </li>
          <li>
            <router-link
              class="text-sm"
              :to="{ name: 'app.rules' }"
              exact-active-class="menu-active"
            >
              <i class="fa-solid fa-book" />Regras
            </router-link>
          </li>

          <li v-if="isAdmin">
            <a class="text-sm"><i class="fa-solid fa-cog" /> Painel Administrativo</a>
            <ul class="flex flex-col gap-1">
              <li>
                <router-link
                  :to="{ name: 'admin.index' }"
                  class="text-sm"
                  exact-active-class="menu-active"
                >
                  <i class="fa-solid fa-chart-line" /> Dashboard
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'admin.guesses' }"
                  class="text-sm"
                  exact-active-class="menu-active"
                >
                  <i class="fa-solid fa-clock" /> Palpites não processados
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'admin.users' }"
                  class="text-sm"
                  exact-active-class="menu-active"
                >
                  <i class="fa-solid fa-users" /> Usuários
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'admin.leagues' }"
                  class="text-sm"
                  exact-active-class="menu-active"
                >
                  <i class="fa-solid fa-flag" /> Ligas
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'admin.teams' }"
                  class="text-sm"
                  exact-active-class="menu-active"
                >
                  <i class="fa-solid fa-shield-halved" /> Times
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'admin.championships' }"
                  class="text-sm"
                  exact-active-class="menu-active"
                >
                  <i class="fa-solid fa-trophy" /> Campeonatos
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'admin.matches' }"
                  class="text-sm"
                  exact-active-class="menu-active"
                >
                  <i class="fa-solid fa-futbol" /> Partidas
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <router-link to="/" class="btn btn-ghost text-xl"> Palpittero </router-link>
    </div>

    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal gap-1">
        <li>
          <router-link
            :to="{ name: 'app.index' }"
            class="btn btn-ghost"
            exact-active-class="btn-active"
          >
            <i class="fa-solid fa-house" /> Início
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'app.rules' }"
            class="btn btn-ghost"
            exact-active-class="btn-active"
          >
            <i class="fa-solid fa-book" /> Regras
          </router-link>
        </li>
        <div class="relative group">
          <input
            v-model="isAdminPanelOpen"
            type="checkbox"
            id="admin-panel-dropdown-toggle"
            class="hidden peer"
          />

          <label for="admin-panel-dropdown-toggle" class="btn btn-ghost">
            <i class="fa-solid fa-cog" /> Painel Administrativo
            <i class="fa-solid fa-angle-down" />
          </label>

          <ul
            class="absolute right-0 mt-2 w-60 bg-base-100 shadow-lg rounded-box menu p-2 transition-all duration-150"
            tabindex="-1"
            :class="{ 'opacity-0 invisible': !isAdminPanelOpen }"
            @click="isAdminPanelOpen = false"
          >
            <li>
              <router-link
                :to="{ name: 'admin.index' }"
                class="text-sm"
                exact-active-class="menu-active"
              >
                <i class="fa-solid fa-chart-line" /> Dashboard
              </router-link>
            </li>
            <li>
              <router-link
                :to="{ name: 'admin.guesses' }"
                class="text-sm"
                exact-active-class="menu-active"
              >
                <i class="fa-solid fa-clock" /> Palpites não processados
              </router-link>
            </li>
            <li>
              <router-link
                :to="{ name: 'admin.users' }"
                class="text-sm"
                exact-active-class="menu-active"
              >
                <i class="fa-solid fa-users" /> Usuários
              </router-link>
            </li>
            <li>
              <router-link
                :to="{ name: 'admin.leagues' }"
                class="text-sm"
                exact-active-class="menu-active"
              >
                <i class="fa-solid fa-flag" /> Ligas
              </router-link>
            </li>
            <li>
              <router-link
                :to="{ name: 'admin.teams' }"
                class="text-sm"
                exact-active-class="menu-active"
              >
                <i class="fa-solid fa-shield-halved" /> Times
              </router-link>
            </li>
            <li>
              <router-link
                :to="{ name: 'admin.championships' }"
                class="text-sm"
                exact-active-class="menu-active"
              >
                <i class="fa-solid fa-trophy" /> Campeonatos
              </router-link>
            </li>
            <li>
              <router-link
                :to="{ name: 'admin.matches' }"
                class="text-sm"
                exact-active-class="menu-active"
              >
                <i class="fa-solid fa-futbol" /> Partidas
              </router-link>
            </li>
          </ul>
        </div>
      </ul>
    </div>

    <div class="navbar-end">
      <div class="dropdown dropdown-end">
        <button tabindex="0" role="button" class="btn btn-ghost flex items-center gap-2">
          <span class="hidden lg:block">{{ loggedUser?.name }}</span>
          <BaseImage :src="loggedUser?.avatar" class="rounded-full w-6" />
        </button>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-3 gap-1"
        >
          <li>
            <a class="text-sm" @click="handleMyAccount">
              <i class="fa-solid fa-user" /> Minha Conta
            </a>
          </li>
          <li>
            <a class="text-sm" @click="handleLogoutConfirmation">
              <i class="fa-solid fa-sign-out" /> Sair
            </a>
          </li>
        </ul>
      </div>
    </div>
    <MyAccountModalForm @success="handleMyAccountSuccess" />
    <LogoutConfirmationModal @submit="handleLogout" />
  </div>
</template>
