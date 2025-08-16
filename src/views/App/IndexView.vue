<script setup lang="ts">
import { useAuthStore } from '@/stores'

const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <h1>Home Page</h1>
  <button class="btn btn-primary" @click="handleLogout">Logout</button>
</template>
