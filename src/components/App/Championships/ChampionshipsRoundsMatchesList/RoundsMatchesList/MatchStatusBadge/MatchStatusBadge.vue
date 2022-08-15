<template>
  <Badge :value="$t(parsedStatus.text)" :severity="parsedStatus.severity" />
</template>

<script setup>
import { computed } from 'vue'

import { MATCH_STATUSES_LABELS } from '@/constants/matches'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const parsedStatus = computed(
  () =>
    MATCH_STATUSES_LABELS[props.status] || {
      text: props.status
    }
)
</script>
