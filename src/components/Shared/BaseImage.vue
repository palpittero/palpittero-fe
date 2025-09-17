<script setup lang="ts">
import { ref } from 'vue'
import imagePlaceholder from '@/assets/images/img-placeholder.svg'

const props = defineProps<{
  src?: string | null
}>()

const image = ref<string>(props.src ?? '')
const isLoaded = ref<boolean>(false)

const handleError = () => {
  image.value = imagePlaceholder
}

const handleLoaded = () => {
  isLoaded.value = true
}
</script>

<template>
  <img
    class="rounded-box object-contain"
    :src="image"
    @error="handleError"
    @load="handleLoaded"
    v-show="isLoaded"
  />
</template>
