<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
    icon?: string
  }>(),
  {
    icon: 'fa-solid fa-layer-group',
  },
)
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body text-center py-12">
      <div class="text-base-content/50 mb-4">
        <i class="text-6xl text-base-content/50" :class="icon" />
      </div>
      <slot name="title">
        <p class="text-lg font-medium">{{ title }}</p>
      </slot>
      <slot name="description" v-if="description">
        <p class="text-sm text-base-content/70">
          {{ description }}
        </p>
      </slot>
    </div>
  </div>
</template>
