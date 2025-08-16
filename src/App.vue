<script setup lang="ts">
import Toast from '@/components/Common/Toast.vue'
import NavBar from '@/components/Shared/NavBar.vue'
import { onMounted } from 'vue'

onMounted(() => {
  window.addEventListener('click', function (e) {
    document.querySelectorAll('.dropdown').forEach(function (dropdown) {
      if (!dropdown.contains(e.target)) {
        // Click was outside the dropdown, close it
        dropdown.open = false
      }
    })
  })
})
</script>

<template>
  <Toast />
  <NavBar />
  <router-view />
</template>
