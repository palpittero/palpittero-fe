<script setup lang="ts">
import { type RouteLocationRaw } from 'vue-router'

export type iBreadcrumbItem = {
  label: string
  icon?: string
  to?: RouteLocationRaw | string
  active?: boolean
}

defineProps<{
  items: iBreadcrumbItem[]
}>()
</script>

<template>
  <div class="breadcrumbs text-sm">
    <ul>
      <li v-for="item in items" :key="item.label">
        <router-link v-if="item.to" :to="item.to" exact-active-class="pointer-events-none">
          <i v-if="item.icon" :class="item.icon" />
          {{ item.label }}
        </router-link>
        <template v-else>{{ item.label }}</template>
      </li>
    </ul>
  </div>
</template>
