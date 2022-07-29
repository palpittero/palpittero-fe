<template>
  <Layout>
    <template #switch-app>
      <router-link :to="{ name: 'Admin' }">
        <button class="p-link layout-topbar-button">
          <i class="pi pi-desktop" />
          <span>{{ $t('common.menu.adminPanel') }}</span>
        </button>
      </router-link>
    </template>
    <template #sidebar="{ onMenuItemClick }">
      <AppSidebar @menuitem-click="onMenuItemClick" />
    </template>
    <slot />
  </Layout>
</template>

<script setup>
import Layout from '@/pages/Shared/Layout.vue'
import AppSidebar from '@/components/App/AppSidebar/AppSidebar.vue'
</script>
