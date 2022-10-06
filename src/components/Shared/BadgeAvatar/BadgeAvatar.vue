<template>
  <Avatar :image="badge" :size="size" :shape="shape" @error="handleError" />
</template>

<script setup>
import { USER_AVATAR_PLACEHOLDER, BADGE_AVATAR_PLACEHOLDER } from '@/constants'
import { ref, computed, watch } from 'vue'

const props = defineProps({
  image: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'small'
  },
  shape: {
    type: String,
    default: 'circle'
  },
  type: {
    type: String,
    default: 'badge',
    validator: (value) => ['avatar', 'badge'].includes(value)
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

const placeholder = computed(() =>
  props.type === 'user' ? USER_AVATAR_PLACEHOLDER : BADGE_AVATAR_PLACEHOLDER
)

const handleError = () => (hasError.value = true)

const badge = computed(() =>
  hasError.value || !props.image ? placeholder.value : props.image
)
</script>
