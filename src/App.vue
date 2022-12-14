<template>
  <div v-show="loaded">
    <router-view class="container py-3" />
    <Toast group="app" />
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useThemeStore } from '@/stores/theme'

const loaded = ref(false)
const themeStore = useThemeStore()

watchEffect(async () => {
  loaded.value = false
  await themeStore.switchTheme(themeStore.theme)
  loaded.value = true
})
</script>
