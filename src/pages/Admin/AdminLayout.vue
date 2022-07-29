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
// import { reactive } from 'vue'

import AdminSidebar from '@/components/Admin/AdminSidebar/AdminSidebar.vue'
import Layout from '@/pages/Shared/Layout.vue'
// import { useI18n } from 'vue-i18n'

// const i18n = useI18n()

// const menu = reactive([
//   {
//     label: i18n.t('common.menu.adminPanel'),
//     items: [
//       {
//         label: i18n.t('common.users'),
//         icon: 'pi pi-fw pi-users',
//         to: { name: 'AdminUsers' }
//       },
//       {
//         label: i18n.t('common.leagues'),
//         icon: 'pi pi-fw pi-flag',
//         to: { name: 'AdminLeagues' }
//       },
//       {
//         label: i18n.t('common.teams'),
//         icon: 'pi pi-fw pi-shield',
//         to: { name: 'AdminTeams' }
//       },
//       {
//         label: i18n.t('common.championships'),
//         icon: 'pi pi-fw pi-ticket',
//         to: { name: 'AdminChampionships' }
//       },
//       {
//         label: i18n.t('common.matches'),
//         icon: 'pi pi-fw pi-ticket',
//         to: { name: 'AdminMatches' }
//       }
//     ]
//   }
// ])
</script>
