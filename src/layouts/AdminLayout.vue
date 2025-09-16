<script lang="ts" setup>
import AdminSidebar from '@/components/Admin/AdminSidebar.vue'
</script>

<template>
  <div class="container mx-auto p-4 grid grid-cols-12 gap-4">
    <AdminSidebar />
    <div class="col-span-12 lg:col-span-9">
      <RouterView />
    </div>
  </div>
</template>
