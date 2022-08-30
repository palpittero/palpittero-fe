<template>
  <div class="flex pb-3" :class="alignClass">
    <InlineMessage class="flex pb-3">
      <div class="flex flex-column gap-3 align-items-center">
        <div class="flex gap-2 align-items-center">
          <small>
            {{ $t('app.guesses.matchHasNoResult') }}
          </small>
        </div>
      </div>
    </InlineMessage>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  align: {
    type: String,
    default: ''
  }
})

const alignClass = computed(() => `justify-content-${props.align}`)
</script>
