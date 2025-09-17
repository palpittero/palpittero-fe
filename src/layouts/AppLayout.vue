<script setup lang="ts">
import TopBar from '@/components/App/TopBar.vue'
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <TopBar />

    <div class="container mx-auto p-4 max-w-4xl">
      <router-view />
    </div>
  </div>
</template>
