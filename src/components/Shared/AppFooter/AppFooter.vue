<template>
  <div
    class="app-footer bottom-0 w-100 p-1 d-flex align-items-center justify-content-center bg-blur gap-2"
  >
    <img alt="Logo" :src="footerImage" height="20" class="mr-2" />

    <small class="flex align-items-center justify-content-center gap-2">
      Palpittero &copy; {{ year }}
    </small>
  </div>
</template>

<script setup>
const footerImage = '/images/logo-dark.svg'
const year = new Date().getFullYear()
</script>

<style lang="scss">
.app-footer {
  z-index: 0;
  border: none;
  box-shadow: inset 1px 1px rgb(255 255 255 / 20%),
    inset -1px -1px rgb(255 255 255 / 10%), 1px 3px 24px -1px rgb(0 0 0 / 15%);
}
</style>
