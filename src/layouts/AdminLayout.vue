<script lang="ts" setup>
import AdminSidebar from '@/components/Admin/AdminSidebar.vue'
import TopBar from '@/components/App/TopBar.vue'
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <TopBar />

    <div class="mx-auto p-4 max-w-6xl">
      <div class="grid grid-cols-12 gap-4">
        <AdminSidebar />
        <div class="col-span-12 lg:col-span-9">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>
