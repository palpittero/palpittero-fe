<template>
  <AppLayout>
    <template #sidebar="{ onMenuItemClick }">
      <MyAccountSidebar @menuitem-click="onMenuItemClick" />
    </template>
    <router-view />
    <!-- <MyAccount /> -->
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/pages/App/AppLayout.vue'
import MyAccountSidebar from '@/components/App/MyAccount/MyAccountSidebar/MyAccountSidebar.vue'
// import MyAccount from '@/components/App/MyAccount/MyAccount.vue'
</script>
