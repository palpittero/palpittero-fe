<template>
  <div
    class="app-footer position-fixed bottom-0 w-100 p-1 d-flex align-items-center justify-content-center gap-2"
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
  border: none;
  box-shadow: inset 1px 1px rgb(255 255 255 / 20%),
    inset -1px -1px rgb(255 255 255 / 10%), 1px 3px 24px -1px rgb(0 0 0 / 15%);
  background-color: transparent;
  background-image: linear-gradient(
    125deg,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.2) 70%
  );
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
}
</style>
