<template>
  <AppTopBar :is-admin="isAdmin">
    <template #switch-app>
      <slot name="switch-app" />
    </template>
  </AppTopBar>
  <div class="layout container">
    <slot />
  </div>
  <AppFooter />
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

import AppTopBar from '@/components/Shared/AppTopbar/AppTopbar.vue'
import AppFooter from '@/components/Shared/AppFooter/AppFooter.vue'

const toast = useToast()
const route = useRoute()

defineProps({
  menu: {
    type: Array,
    default: () => []
  },
  isAdmin: Boolean
})

watch(route.path, () => toast.removeAllGroups())
</script>

<style lang="scss">
.layout {
  padding-top: 15px;
  padding-bottom: 60px;
}
</style>
