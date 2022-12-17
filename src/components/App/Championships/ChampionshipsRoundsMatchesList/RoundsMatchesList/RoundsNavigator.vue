<template>
  <div class="hstack justify-content-between bg-blur py-2">
    <PButton
      variant="clear"
      class="border-0"
      icon="fas fa-angle-left"
      :disabled="isCurrentFirstRound"
      @click="emits('previous')"
    />
    <span class="text-bold">{{ selectedRound.name }}</span>
    <PButton
      variant="clear"
      class="border-0"
      icon="fas fa-angle-right"
      :disabled="isCurrentLastRound"
      @click="emits('next')"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedRound: {
    type: Object,
    required: true
  }
  // isCurrentFirstRound: Boolean,
  // isCurrentLastRound: Boolean
})
const emits = defineEmits(['previous', 'next'])

const isCurrentFirstRound = computed(() => props.selectedRound?.first)

const isCurrentLastRound = computed(() => props.selectedRound?.last)
</script>
