<template>
  <div>
    <router-view />
    <Toast group="app" />
  </div>
</template>

<script setup>
import { usePrimeVue } from 'primevue/config'
import { onMounted } from 'vue-demi'
import i18n, { locale } from './i18n'

const primeVue = usePrimeVue()

onMounted(() => (primeVue.config.locale = locale[i18n.global.locale.value]))
</script>
