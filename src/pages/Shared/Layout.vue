<template>
  <div :class="containerClass" @click="onWrapperClick">
    <AppTopBar @menu-toggle="onMenuToggle">
      <template #switch-app>
        <slot name="switch-app" />
      </template>
    </AppTopBar>
    <div class="layout-sidebar" @click="onSidebarClick">
      <slot name="sidebar" :onMenuItemClick="onMenuItemClick" :menu="menu" />
    </div>

    <div class="layout-main-container">
      <div class="layout-main">
        <slot />
      </div>
      <AppFooter />
    </div>

    <transition name="layout-mask">
      <div class="layout-mask p-component-overlay" v-if="mobileMenuActive" />
    </transition>
  </div>
</template>

<script setup>
import AppTopBar from '@/components/Shared/AppTopbar/AppTopbar.vue'
// import AppMenu from '@/components/Shared/AppMenu/AppMenu.vue'
import AppFooter from '@/components/Shared/AppFooter/AppFooter.vue'
import { ref, computed, onBeforeUpdate, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'

const layoutMode = ref('static')
const staticMenuInactive = ref(false)
const overlayMenuActive = ref(false)
const mobileMenuActive = ref(false)
const menuClick = ref(false)
const toast = useToast()
const route = useRoute()

defineProps({
  menu: {
    type: Array,
    default: () => []
  }
})

watch(route.path, () => toast.removeAllGroups())

const onWrapperClick = () => {
  if (!menuClick.value) {
    overlayMenuActive.value = false
    mobileMenuActive.value = false
  }

  menuClick.value = false
}

const onMenuToggle = () => {
  menuClick.value = true

  if (isDesktop()) {
    if (layoutMode.value === 'overlay') {
      if (mobileMenuActive.value === true) {
        overlayMenuActive.value = true
      }

      overlayMenuActive.value = !overlayMenuActive.value
      mobileMenuActive.value = false
    } else if (layoutMode.value === 'static') {
      staticMenuInactive.value = !staticMenuInactive.value
    }
  } else {
    mobileMenuActive.value = !mobileMenuActive.value
  }

  event.preventDefault()
}

const onSidebarClick = () => {
  menuClick.value = true
}

const onMenuItemClick = (event) => {
  if (event.item && !event.item.items) {
    overlayMenuActive.value = false
    mobileMenuActive.value = false
  }
}

// const onLayoutChange = (layoutMode) => {
//   layoutMode.value = layoutMode
// }

const addClass = (element, className) => {
  if (element.classList) element.classList.add(className)
  else element.className += ' ' + className
}

const removeClass = (element, className) => {
  if (element.classList) element.classList.remove(className)
  else
    element.className = element.className.replace(
      new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'),
      ' '
    )
}

const isDesktop = () => {
  return window.innerWidth >= 992
}

// const isSidebarVisible = () => {
//   if (isDesktop()) {
//     if (layoutMode.value === 'static') return !staticMenuInactive.value
//     else if (layoutMode.value === 'overlay') return overlayMenuActive.value
//   }

//   return true
// }

const containerClass = computed(() => {
  return [
    'layout-wrapper',
    {
      'layout-overlay': layoutMode.value === 'overlay',
      'layout-static': layoutMode.value === 'static',
      'layout-static-sidebar-inactive':
        staticMenuInactive.value && layoutMode.value === 'static',
      'layout-overlay-sidebar-active':
        overlayMenuActive.value && layoutMode.value === 'overlay',
      'layout-mobile-sidebar-active': mobileMenuActive.value,
      'p-input-filled': window.$primevue?.config?.inputStyle === 'filled',
      'p-ripple-disabled': window.$primevue?.config?.ripple === false
    }
  ]
})

// const logo = computed(() => {
//   return this.$appState.darkTheme ? 'images/logo-white.svg' : 'images/logo.svg'
// })

onBeforeUpdate(() => {
  if (mobileMenuActive.value) addClass(document.body, 'body-overflow-hidden')
  else removeClass(document.body, 'body-overflow-hidden')
})

// export default {
// watch: {
//   $route() {
//     this.menuActive = false
//     this.$toast.removeAllGroups()
//   }
// },
// }
</script>

<style lang="scss">
.p-toast.p-toast-top-right {
  z-index: 1000;
}
</style>
