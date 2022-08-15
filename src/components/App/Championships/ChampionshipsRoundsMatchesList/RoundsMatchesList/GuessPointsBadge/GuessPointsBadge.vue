<template>
  <Badge :value="label" :style="style" />
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

import { GUESS_POINTS_BADGE_STYLE } from '@/constants/guesses'

const i18n = useI18n()

const props = defineProps({
  points: {
    type: Number,
    required: true
  }
})

const style = computed(() => GUESS_POINTS_BADGE_STYLE[props.points])
const label = computed(() =>
  i18n.t('app.guesses.points', { points: props.points })
)
</script>
