<template>
  <Avatar :image="badge" size="large" shape="circle" @error="handleError" />
</template>

<script setup>
import { BADGE_AVATAR_PLACEHOLDER } from '@/constants'
import { ref, computed, watch } from 'vue'

const props = defineProps({
  image: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'large'
  },
  shape: {
    type: String,
    default: 'circle'
  }
})

const hasError = ref(false)

watch(
  () => props.image,
  (current, previous) => {
    if (current !== previous) {
      hasError.value = false
    }
  }
)

const handleError = () => (hasError.value = true)

const badge = computed(() =>
  hasError.value ? BADGE_AVATAR_PLACEHOLDER : props.image
)
</script>
