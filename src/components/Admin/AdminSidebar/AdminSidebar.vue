<template>
  <div class="layout-menu-container">
    <SidebarContent
      :items="menu"
      class="layout-menu"
      root
      @menuitem-click="onMenuItemClick"
      @keydown="onKeyDown"
    />
  </div>
</template>

<script setup>
import { reactive } from 'vue-demi'
import { useI18n } from 'vue-i18n'
import SidebarContent from '@/components/Shared/SidebarContent/SidebarContent.vue'

const i18n = useI18n()

const emit = defineEmits(['menuitem-click'])

const menu = reactive([
  {
    label: i18n.t('common.menu.adminPanel'),
    items: [
      {
        label: i18n.t('common.dashboard'),
        icon: 'pi pi-fw pi-chart-bar',
        to: { name: 'AdminDashboard' },
        exact: true
      },
      {
        label: i18n.t('common.unprocessedGuesses'),
        icon: 'pi pi-fw pi-clock',
        to: { name: 'AdminUnprocessedGuessesLeagues' },
        exact: false
      },
      {
        label: i18n.t('common.users'),
        icon: 'pi pi-fw pi-users',
        to: { name: 'AdminUsers' },
        exact: true
      },
      {
        label: i18n.t('common.leagues'),
        icon: 'pi pi-fw pi-flag',
        to: { name: 'AdminLeagues' },
        exact: true
      },
      {
        label: i18n.t('common.teams'),
        icon: 'pi pi-fw pi-shield',
        to: { name: 'AdminTeams' },
        exact: true
      },
      {
        label: i18n.t('common.championships'),
        icon: 'pi pi-fw pi-list',
        to: { name: 'AdminChampionships' },
        exact: true
      },
      {
        label: i18n.t('common.matches'),
        icon: 'pi pi-fw pi-money-bill',
        to: { name: 'AdminMatches' },
        exact: true
      }
    ]
  }
])

const onMenuItemClick = (event) => {
  emit('menuitem-click', event)
}

const onKeyDown = (event) => {
  const nodeElement = event.target
  if (event.code === 'Enter' || event.code === 'Space') {
    nodeElement.click()
    event.preventDefault()
  }
}
</script>
