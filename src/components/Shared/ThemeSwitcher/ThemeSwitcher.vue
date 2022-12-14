<template>
  <ul class="navbar-nav mr-auto mb-lg-0">
    <li class="nav-item dropdown">
      <a
        class="nav-link dropdown-toggle d-flex align-items-center gap-2"
        href="#"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <font-awesome-icon icon="fas fa-palette" />
        <span class="d-lg-none">{{ $t('common.menu.changeTheme') }}</span>
      </a>
      <ul class="dropdown-menu dropdown-menu--right">
        <li class="d-none d-lg-block">
          <h6 class="dropdown-header">
            {{ $t('common.menu.changeTheme') }}
          </h6>
        </li>
        <li
          v-for="theme in THEMES_OPTIONS"
          :key="theme.id"
          @click="handleSwitchTheme(theme)"
        >
          <a
            class="dropdown-item d-flex align-items-center gap-2"
            :class="{ disabled: isActiveTheme(theme) }"
            href="#"
          >
            {{ theme.label }}
          </a>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script setup>
import { useThemeStore } from '@/stores/theme'

import { THEMES_OPTIONS } from '@/constants/themes'

const themeStore = useThemeStore()

const handleSwitchTheme = (theme) => themeStore.switchTheme(theme.id)
const isActiveTheme = (theme) => themeStore.theme === theme.id
</script>
