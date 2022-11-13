<template>
  <div class="layout-footer">
    <img alt="Logo" :src="footerImage" height="20" class="mr-2" />

    <div class="flex align-items-center justify-content-center gap-2">
      Palpittero &copy; {{ year }}
    </div>
  </div>
</template>

<script setup>
const footerImage = '/images/logo-dark.svg'
const year = new Date().getFullYear()
</script>
