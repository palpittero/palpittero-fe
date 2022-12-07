<template>
  <div
    class="d-flex flex-column align-items-center justify-content-center h-100vh"
  >
    <Logo />
    <Jumbotron
      :title="$t('common.notFound.title')"
      icon="fa-solid fa-exclamation-triangle  "
      icon-class="text-warning"
      :subtitle="$t('common.notFound.message')"
      :cta="{
        icon: 'fa-solid fa-home',
        label: $t('common.notFound.cta'),
        route: { name: 'Home' }
      }"
    />
  </div>
</template>

<script setup>
import { Logo, Jumbotron } from '@/components/Common'
// import Jumbotron from '@/components/Common/Jumbotron/Jumbotron.vue'
</script>
