<template>
  <div
    class="position-fixed bottom-0 w-100 p-3 d-flex align-items-center justify-content-center gap-2 bg-light"
  >
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
