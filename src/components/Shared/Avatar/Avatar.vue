<template>
  <img
    class="rounded-circle border border-grey"
    :class="`p-avatar__${size}`"
    :src="src"
    @error="handleError"
  />
</template>

<script setup>
import { ref } from 'vue'
import { BADGE_AVATAR_PLACEHOLDER } from '@/constants'

const props = defineProps({
  img: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'sm'
  }
})

const src = ref(props.img)

const handleError = () => (src.value = BADGE_AVATAR_PLACEHOLDER)
</script>

<style lang="scss" scoped>
.p-avatar {
  &__sm {
    width: 40px;
  }

  &__md {
    width: 80px;
  }

  &__lg {
    width: 120px;
  }

  &__xlg {
    width: 160px;
  }
}
</style>
