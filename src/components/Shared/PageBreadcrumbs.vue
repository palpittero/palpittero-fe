<script setup lang="ts">
import { type RouteLocationRaw } from 'vue-router'

export type iBreadcrumbItem = {
  label: string
  icon?: string
  to: RouteLocationRaw | string
  active?: boolean
}

defineProps<{
  items: iBreadcrumbItem[]
}>()
</script>

<template>
  <div class="breadcrumbs">
    <ul>
      <li v-for="item in items" :key="item.label">
        <i v-if="item.icon" :class="item.icon" />
        <router-link :to="item.to" exact-active-class="pointer-events-none">{{
          item.label
        }}</router-link>
      </li>
    </ul>
  </div>
</template>
