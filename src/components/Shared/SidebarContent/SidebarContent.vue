<template>
  <div class="sidebar-content">
    <ul v-if="items" class="layout-menu">
      <template v-for="(item, i) of items">
        <li
          v-if="visible(item) && !item.separator"
          :key="item.label || i"
          :class="[
            {
              'layout-menuitem-category': root,
              'active-menuitem': isMenuActive(item, i)
            }
          ]"
          role="none"
        >
          <template v-if="root">
            <div class="layout-menuitem-root-text" :aria-label="item.label">
              {{ item.label }}
            </div>
            <SidebarContent
              :items="visible(item) && item.items"
              @menuitem-click="$emit('menuitem-click', $event)"
            />
          </template>
          <template v-else>
            <router-link
              v-if="item.to"
              :to="item.to"
              :class="[item.class, 'p-ripple', { 'p-disabled': item.disabled }]"
              :style="item.style"
              @click="onMenuItemClick($event, item, i)"
              :target="item.target"
              :aria-label="item.label"
              :exact="item.exact"
              role="menuitem"
              v-ripple
            >
              <i :class="item.icon" />
              <span>{{ item.label }}</span>
              <i
                v-if="item.items"
                class="pi pi-fw pi-angle-down menuitem-toggle-icon"
              />
              <Badge v-if="item.badge" :value="item.badge"></Badge>
            </router-link>
            <a
              v-if="!item.to"
              :href="item.url || '#'"
              :style="item.style"
              :class="[item.class, 'p-ripple', { 'p-disabled': item.disabled }]"
              @click="onMenuItemClick($event, item, i)"
              :target="item.target"
              :aria-label="item.label"
              role="menuitem"
              v-ripple
            >
              <i :class="item.icon" />
              <span>{{ item.label }}</span>
              <i
                v-if="item.items"
                class="pi pi-fw pi-angle-down menuitem-toggle-icon"
              />
              <Badge v-if="item.badge" :value="item.badge" />
            </a>
            <transition name="layout-submenu-wrapper">
              <SidebarContent
                v-show="activeIndex === i"
                :items="visible(item) && item.items"
                @menuitem-click="$emit('menuitem-click', $event)"
              />
            </transition>
          </template>
        </li>
        <li
          class="p-menu-separator"
          :style="item.style"
          v-if="visible(item) && item.separator"
          :key="'separator' + i"
          role="separator"
        />
      </template>
    </ul>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

defineProps({
  items: {
    type: Array,
    default: () => []
  },
  root: Boolean
})

const emit = defineEmits(['menuitem-click'])

const activeIndex = ref(null)

const onMenuItemClick = (event, item, index) => {
  if (item.disabled) {
    event.preventDefault()
    return
  }

  if (!item.to && !item.url) {
    event.preventDefault()
  }

  //execute command
  if (item.command) {
    item.command({ originalEvent: event, item: item })
  }

  activeIndex.value = index === activeIndex.value ? null : index

  emit('menuitem-click', {
    originalEvent: event,
    item
  })
}

const visible = (item) => {
  return typeof item.visible === 'function'
    ? item.visible()
    : item.visible !== false
}

const isMenuActive = (item, index) => {
  return (
    (activeIndex.value === index && !item.to && !item.disabled) ||
    (route.meta?.parent && route.meta?.parent === item.to?.name)
  )
}
</script>

<style lang="scss">
.sidebar-content {
  .active-menuitem {
    a {
      font-weight: 700 !important;
      color: var(--primary-color) !important;
    }
  }
}
</style>
