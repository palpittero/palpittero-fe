<template>
  <div class="d-flex flex-column align-items-center text-center gap-3">
    {{ title }}
    <h1 class="d-flex align-items-center m-0 gap-3">
      <font-awesome-icon v-if="icon" :icon="icon" :class="iconClass" />
      {{ subtitle }}
    </h1>
    {{ message }}
    <div class="d-flex align-items-center gap-2">
      <router-link
        v-if="cta.route"
        :to="cta.route"
        class="btn btn-primary btn-lg d-flex gap-2 align-items-center"
      >
        <font-awesome-icon v-if="cta.icon" :icon="cta.icon" />
        {{ cta.label }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'fa-solid fa-check'
  },
  iconClass: {
    type: String,
    default: 'text-success'
  },
  message: {
    type: String,
    default: ''
  },
  cta: {
    type: Object,
    default: () => ({
      icon: '',
      label: '',
      route: ''
    })
  }
})
</script>
