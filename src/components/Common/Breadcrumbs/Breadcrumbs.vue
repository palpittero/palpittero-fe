<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="breadcrumb-item"
        :class="{ active: item.active }"
        aria-current="page"
      >
        <!-- <font-awesome-icon v-if="item.icon"  -->
        <router-link v-if="item.to" :to="item.to">
          {{ item.label }}
        </router-link>
        <template v-else>
          {{ item.label }}
        </template>
      </li>
    </ol>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
</script>
