<script setup lang="ts">
import { useAuthStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute, type RouteLocationRaw } from 'vue-router'

const authStore = useAuthStore()
const { isAdmin } = storeToRefs(authStore)

const handleLogout = () => {
  authStore.logout()
}

const route = useRoute()

const indexRoute = computed<{
  icon: string
  label: string
  route: RouteLocationRaw
} | null>(() => {
  if (!isAdmin.value) return null

  if (route.name?.toString().includes('admin')) {
    return {
      icon: 'fa-solid fa-house',
      label: 'Início',
      route: { name: 'app.index' },
    }
  }

  return {
    icon: 'fa-solid fa-cog',
    label: 'Painel Administrativo',
    route: { name: 'admin.index' },
  }
})
</script>

<template>
  <div class="navbar bg-base-300 w-full">
    <div class="navbar-start">
      <ul class="menu menu-horizontal" v-if="isAdmin && indexRoute">
        <li>
          <router-link class="btn btn-ghost rounded-field" :to="indexRoute.route">
            <i :class="indexRoute.icon" />
            {{ indexRoute.label }}
          </router-link>
        </li>
      </ul>
    </div>
    <div class="hidden flex-1 text-center lg:block text-xl">Palpittero</div>
    <div class="navbar-end">
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost rounded-field">
          <i class="fa-solid fa-user" />
          Administrador <i class="fa-solid fa-angle-down" />
        </div>
        <ul
          tabindex="0"
          class="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm"
        >
          <li>
            <router-link
              :to="{ name: 'app.my-account' }"
              onclick="setTimeout(() => document.activeElement.blur(), 100)"
              ><i class="fa-solid fa-id-card" /> Minha Conta</router-link
            >
          </li>
          <li>
            <a @click="handleLogout"><i class="fa-solid fa-sign-out" /> Sair</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
