<template>
  <nav aria-label="breadcrumb" class="bg-blur mb-2">
    <ol class="breadcrumb mb-0">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="breadcrumb-item"
        :class="{ active: item.active }"
        aria-current="page"
      >
        <div class="hstack gap-2">
          <font-awesome-icon v-if="item.icon" :icon="item.icon" />
          <router-link v-if="item.to" :to="item.to">
            {{ item.label }}
          </router-link>
          <template v-else>
            {{ item.label }}
          </template>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  },
  icon: {
    type: String,
    default: ''
  }
})
</script>
