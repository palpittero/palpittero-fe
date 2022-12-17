<template>
  <PInput
    v-if="isMatchScheduled(match)"
    className="d-flex"
    type="number"
    v-model="value"
    :min="0"
  />
  <span v-else>
    <span class="flex gap-2 px-2 font-large">
      <!-- Regular time goals -->
      <span :class="classes.regularTime">
        {{ regularTimeGoals }}
      </span>
      <!-- Penalties time goals -->
      <span v-if="isPenaltiesRoundType(match)" :class="classes.penaltiesTime">
        ({{ penaltiesTimeGoals }})
      </span>
    </span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

import { isMatchScheduled, parseMatchGoals } from '@/helpers/matches'
import { isPenaltiesRoundType } from '@/helpers/rounds'

const props = defineProps({
  modelValue: {
    type: Number,
    default: null
  },
  match: {
    type: Object,
    required: true
  },
  guess: {
    type: Object,
    required: true
  },
  team: {
    type: String,
    default: 'home',
    validator: (value) => ['home', 'away'].includes(value)
  },
  classes: {
    type: Object,
    default: () => ({
      regularTime: null,
      penaltiesTime: null
    })
  }
})

const emits = defineEmits(['update:model-value'])

const value = computed({
  set(value) {
    emits('update:model-value', value)
  },
  get() {
    return props.modelValue
  }
})

const regularTimeGoals = computed(() =>
  parseMatchGoals(props.guess[`${props.team}TeamRegularTimeGoals`])
)
const penaltiesTimeGoals = computed(() =>
  parseMatchGoals(props.guess[`${props.team}TeamPenaltiesTimeGoals`])
)
</script>
