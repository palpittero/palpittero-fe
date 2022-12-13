<template>
  <div class="accordion">
    <div class="hstack gap-3">
      <Heading class="h2" :label="title" />
      <PButton
        class="ms-auto"
        variant="clear"
        :icon="icon"
        @click.stop="toggle"
      />
    </div>
    <Transition name="accordion">
      <div v-show="show">
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

const icon = computed(() => (show.value ? 'fa-angle-down' : 'fa-angle-up'))
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
