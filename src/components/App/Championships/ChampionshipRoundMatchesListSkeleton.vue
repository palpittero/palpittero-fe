<template>
  <div class="space-y-4 mt-4">
    <div v-for="i in 3" :key="i" class="animate-pulse flex space-x-4 p-4 bg-base-200 rounded-box">
      <div class="rounded-full bg-base-300 h-12 w-12" />
      <div class="flex-1 space-y-2 py-1">
        <div class="h-4 bg-base-300 rounded w-3/4" />
        <div class="h-4 bg-base-300 rounded w-1/2" />
      </div>
    </div>
  </div>
</template>
