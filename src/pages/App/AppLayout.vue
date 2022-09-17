<template>
  <Layout>
    <template #switch-app>
      <router-link :to="{ name: 'AdminDashboard' }">
        <button class="p-link layout-topbar-button">
          <i class="pi pi-desktop" />
          <span>{{ $t('common.menu.adminPanel') }}</span>
        </button>
      </router-link>
    </template>
    <template #sidebar="{ onMenuItemClick }">
      <slot name="sidebar" :on-menu-item-click="onMenuItemClick">
        <AppSidebar @menuitem-click="onMenuItemClick" />
      </slot>
    </template>
    <slot />
  </Layout>
</template>

<script setup>
import Layout from '@/pages/Shared/Layout.vue'
import AppSidebar from '@/components/App/AppSidebar/AppSidebar.vue'
</script>
