<template>
  <Layout :menu="menu">
    <template #switch-app>
      <router-link :to="{ name: 'Home' }">
        <button class="p-link layout-topbar-button p-3">
          <i class="pi pi-desktop" />
          <span>{{ $t('common.menu.palpittero') }}</span>
        </button>
      </router-link>
    </template>
    <template #sidebar="{ onMenuItemClick }">
      <AdminSidebar @menuitem-click="onMenuItemClick" />
    </template>
    <slot />
  </Layout>
</template>

<script setup>
import AdminSidebar from '@/components/Admin/AdminSidebar/AdminSidebar.vue'
import Layout from '@/pages/Shared/Layout.vue'
</script>
