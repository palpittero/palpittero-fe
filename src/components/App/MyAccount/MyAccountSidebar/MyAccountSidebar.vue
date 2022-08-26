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
    label: i18n.t('common.menu.myAccount.myAccount'),
    items: [
      // {
      //   label: i18n.t('common.users'),
      //   icon: 'pi pi-fw pi-users',
      //   to: { name: 'AdminUsers' }
      // },
      {
        label: i18n.t('common.menu.myAccount.profile'),
        icon: 'pi pi-fw pi-user',
        to: { name: 'Profile' }
      },
      {
        label: i18n.t('common.menu.myAccount.changePassword'),
        icon: 'pi pi-fw pi-lock',
        to: { name: 'ChangePassword' }
      }
      // {
      //   label: i18n.t('common.teams'),
      //   icon: 'pi pi-fw pi-shield',
      //   to: { name: 'AdminTeams' }
      // },
      // {
      //   label: i18n.t('common.championships'),
      //   icon: 'pi pi-fw pi-ticket',
      //   to: { name: 'AdminChampionships' }
      // },
      // {
      //   label: i18n.t('common.matches'),
      //   icon: 'pi pi-fw pi-ticket',
      //   to: { name: 'AdminMatches' }
      // }
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
