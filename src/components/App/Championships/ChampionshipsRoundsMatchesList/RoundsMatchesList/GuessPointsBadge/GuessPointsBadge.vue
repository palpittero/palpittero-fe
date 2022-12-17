<template>
  <span
    class="badge"
    :class="`text-bg-${style.variant}`"
    :style="style.opacity"
  >
    {{ label }}
  </span>
</template>

<script setup>
import { isNil } from 'lodash/fp'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

import { GUESS_POINTS_BADGE_STYLE } from '@/constants/guesses'

const i18n = useI18n()

const props = defineProps({
  guess: {
    type: Object,
    required: true
  }
})

const style = computed(() => {
  const key = props.guess.id
    ? props.guess.points || 'processing'
    : 'notRegistered'
  console.log(GUESS_POINTS_BADGE_STYLE, key)
  return GUESS_POINTS_BADGE_STYLE[key]
})

const label = computed(() => {
  const { id, points } = props.guess

  if (id) {
    return isNil(points)
      ? i18n.t('app.guesses.processing')
      : i18n.t('app.guesses.points', { points }, points)
  }

  return i18n.t('app.guesses.notRegistered')
})
</script>
