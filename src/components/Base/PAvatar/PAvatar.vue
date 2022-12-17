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
import { BADGE_AVATAR_PLACEHOLDER, USER_AVATAR_PLACEHOLDER } from '@/constants'

const props = defineProps({
  img: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'sm'
  },
  type: {
    type: String,
    default: 'user',
    validator: (value) => ['avatar', 'badge'].includes(value)
  }
})

const src = ref(String(props.img))

const handleError = () => {
  src.value =
    props.type === 'user' ? USER_AVATAR_PLACEHOLDER : BADGE_AVATAR_PLACEHOLDER
}
</script>

<style lang="scss" scoped>
.p-avatar {
  &__xs {
    width: 30px;
  }

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
