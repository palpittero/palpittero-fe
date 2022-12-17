<template>
  <div class="accordion card">
    <div class="hstack gap-3 card-header px-2 py-1 p-lg-3" @click.stop="toggle">
      <Heading class="h3 mb-0 text-bold" :label="title" />
      <font-awesome-icon class="ms-auto p-3" :icon="icon" />
    </div>
    <Transition name="accordion">
      <div v-show="show" class="card-body p-0">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import Heading from '@/components/Shared/Heading/Heading.vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  open: Boolean
})

const show = ref(props.open)
const toggle = () => (show.value = !show.value)

const icon = computed(() => (show.value ? 'fa-angle-down' : 'fa-angle-right'))
</script>

<style lang="scss" scoped>
.accordion {
  &-enter-active,
  &-leave-active {
    transition: all 0.2s ease-in;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}
</style>
