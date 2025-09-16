<template>
  <div class="col-span-12 lg:col-span-3">
    <ul class="menu menu-md bg-base-200 rounded-box w-full hidden lg:flex flex-col gap-1">
      <li class="menu-title">
        <span>Painel Administrativo</span>
      </li>
      <li>
        <router-link class="py-2" :to="{ name: 'admin.index' }" exact-active-class="menu-active">
          <i class="fa-solid fa-chart-line" />
          Dashboard
        </router-link>
      </li>
      <li>
        <router-link class="py-2" :to="{ name: 'admin.guesses' }" exact-active-class="menu-active">
          <i class="fa-solid fa-clock" />
          Palpites não processados
        </router-link>
      </li>
      <li>
        <router-link class="py-2" :to="{ name: 'admin.users' }" exact-active-class="menu-active">
          <i class="fa-solid fa-users" />
          Usuários
        </router-link>
      </li>
      <li>
        <router-link class="py-2" :to="{ name: 'admin.leagues' }" exact-active-class="menu-active">
          <i class="fa-solid fa-flag" />
          Ligas
        </router-link>
      </li>
      <li>
        <router-link class="py-2" :to="{ name: 'admin.teams' }" exact-active-class="menu-active">
          <i class="fa-solid fa-shield-halved" />
          Times
        </router-link>
      </li>
      <li>
        <router-link
          class="py-2"
          :to="{ name: 'admin.championships' }"
          exact-active-class="menu-active"
        >
          <i class="fa-solid fa-trophy" />
          Campeonatos
        </router-link>
      </li>
      <li>
        <router-link class="py-2" :to="{ name: 'admin.matches' }" exact-active-class="menu-active">
          <i class="fa-solid fa-futbol" />
          Partidas
        </router-link>
      </li>
    </ul>
    <div class="block lg:hidden">
      <div class="menu-title px-0">
        <span>Menu de Navegação</span>
      </div>
      <select class="select">
        <!-- <option disabled selected>Pick a color</option> -->
        <option>
          <router-link class="py-2" :to="{ name: 'admin.index' }">
            <i class="fa-solid fa-chart-line" />
            Dashboard
          </router-link>
        </option>
        <option>
          <router-link class="py-2" :to="{ name: 'admin.guesses' }">
            <i class="fa-solid fa-clock" />
            Palpites não processados
          </router-link>
        </option>
        <option>
          <router-link class="py-2" :to="{ name: 'admin.users' }">
            <i class="fa-solid fa-users" />
            Usuários
          </router-link>
        </option>
        <option>
          <router-link class="py-2" :to="{ name: 'admin.leagues' }">
            <i class="fa-solid fa-flag" />
            Ligas
          </router-link>
        </option>
        <option>
          <router-link class="py-2" :to="{ name: 'admin.teams' }">
            <i class="fa-solid fa-shield-halved" />
            Times
          </router-link>
        </option>
        <option>
          <router-link class="py-2" :to="{ name: 'admin.championships' }">
            <i class="fa-solid fa-trophy" />
            Campeonatos
          </router-link>
        </option>
        <option>
          <router-link class="py-2" :to="{ name: 'admin.matches' }">
            <i class="fa-solid fa-futbol" />
            Partidas
          </router-link>
        </option>
      </select>
    </div>
  </div>
</template>
