<template>
  <AppLayout>
    <Rules :league-id="leagueId" />
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/pages/App/AppLayout.vue'
import Rules from '@/components/App/Rules/Rules.vue'
</script>
