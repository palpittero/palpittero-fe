<template>
  <div class="surface-card shadow-2 p-3 border-round">
    <div class="flex justify-content-between mb-3">
      <div>
        <span class="block text-500 font-medium mb-3">
          <router-link
            v-if="route"
            :to="route"
            class="flex align-items-center gap-2"
          >
            {{ $t(title) }} <span class="pi pi-external-link" />
          </router-link>
          <span v-else>
            {{ $t(title) }}
          </span>
        </span>
        <div class="text-900 font-medium text-xl">{{ value }}</div>
      </div>
      <div
        class="flex align-items-center justify-content-center border-round"
        :class="`bg-${color}-100`"
        style="width: 2.5rem; height: 2.5rem"
      >
        <i class="text-xl" :class="iconClass" />
      </div>
    </div>
    <!-- <span class="text-green-500 font-medium">24 new </span>
    <span class="text-500">since last visit</span> -->
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  value: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  route: {
    type: String,
    default: ''
  }
})

const iconClass = computed(() => `${props.icon} text-${props.color}-500`)
</script>
