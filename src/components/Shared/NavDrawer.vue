<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(
  () => route.name,
  (current, previous) => {
    console.log(current, previous)
    if (previous && current !== previous) {
      document.getElementById('drawer')?.click()
    }
  },
)
</script>

<template>
  <div class="drawer-side">
    <label for="drawer" aria-label="close sidebar" class="drawer-overlay" />
    <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
      <li>
        <span>Painel Administrativo</span>
      </li>

      <li>
        <router-link class="py-2" :to="{ name: 'admin.index' }">
          <i class="fa-solid fa-chart-line" />
          Dashboard
        </router-link>
      </li>

      <li>
        <router-link class="py-2" :to="{ name: 'admin.guesses' }">
          <i class="fa-solid fa-clock" />
          Palpites não processados
        </router-link>
      </li>

      <li>
        <router-link class="py-2" :to="{ name: 'admin.users' }">
          <i class="fa-solid fa-users" />
          Usuários
        </router-link>
      </li>
      <li>
        <router-link class="py-2" :to="{ name: 'admin.leagues' }">
          <i class="fa-solid fa-flag" />
          Ligas
        </router-link>
      </li>
      <li>
        <router-link class="py-2" :to="{ name: 'admin.teams' }">
          <i class="fa-solid fa-shield-halved" />
          Times
        </router-link>
      </li>
      <li>
        <router-link class="py-2" :to="{ name: 'admin.championships' }">
          <i class="fa-solid fa-trophy" />
          Campeonatos
        </router-link>
      </li>
      <li>
        <router-link class="py-2" :to="{ name: 'admin.matches' }">
          <i class="fa-solid fa-futbol" />
          Partidas
        </router-link>
      </li>
    </ul>
  </div>
</template>
