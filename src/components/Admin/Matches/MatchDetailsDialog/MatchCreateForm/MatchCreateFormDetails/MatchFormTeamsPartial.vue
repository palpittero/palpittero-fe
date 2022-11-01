<template>
  <div class="grid align-items-center">
    <div class="col field">
      <label for="homeTeam">{{ $t('admin.matches.homeTeam') }}</label>
      <TeamSelect
        v-model="detail.homeTeam"
        :filter="onFilterHomeTeam"
        :championship-id="championship.id"
        :invalid="submitted && parsedErrors.homeTeamId"
        @update:model-value="handleHomeTeamUpdate"
      />
      <small class="p-invalid" v-if="submitted && parsedErrors.homeTeamId">
        {{ $t('admin.matches.validation.homeTeam') }}
      </small>
    </div>

    <div class="col field">
      <label for="awayTeam">{{ $t('admin.matches.awayTeam') }}</label>
      <TeamSelect
        v-model="detail.awayTeam"
        :filter="onFilterAwayTeam"
        :championship-id="championship.id"
        :invalid="submitted && parsedErrors.awayTeamId"
        @update:model-value="handleAwayTeamUpdate"
      />
      <small class="p-invalid" v-if="submitted && parsedErrors.awayTeamId">
        {{ $t('admin.matches.validation.awayTeam') }}
      </small>
    </div>

    <div class="col field">
      <label for="date">{{ $t('admin.matches.date') }}</label>
      <Calendar
        id="date"
        v-model="detail.date"
        :min-date="minDate"
        show-time
        :show-seconds="false"
        dateFormat="D, d/mm/yy"
        :stepMinute="15"
        show-button-bar
        hide-on-date-time-select
        :manual-input="false"
        :class="{ 'p-invalid': submitted && parsedErrors.date }"
      />
      <small class="p-invalid" v-if="submitted && parsedErrors.date">
        {{ $t('admin.matches.validation.date') }}
      </small>
    </div>
    <Button
      icon="pi pi-trash"
      class="col-1 p-button-text p-button-danger mt-2"
      @click="handleRemoveDetail"
    />
    <!-- <div class="col-1"> -->
    <!-- </div> -->
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { get } from 'lodash/fp'

import TeamSelect from '@/components/Admin/Teams/TeamSelect/TeamSelect.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  championship: {
    type: Object,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  index: {
    type: Number,
    required: true
  },
  submitted: Boolean
})

const emits = defineEmits(['update:modelValue', 'remove'])

const minDate = new Date()

const detail = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const onFilterHomeTeam = (teams) =>
  teams.filter(({ id }) => id !== detail.value.awayTeam?.id)

const onFilterAwayTeam = (teams) =>
  teams.filter(({ id }) => id !== detail.value.homeTeam?.id)

const handleHomeTeamUpdate = (team) =>
  (detail.value.homeTeamId = team?.id ?? null)

const handleAwayTeamUpdate = (team) =>
  (detail.value.awayTeamId = team?.id ?? null)

const handleRemoveDetail = () => emits('remove', props.modelValue.uuid)

const parsedErrors = computed(() => {
  const homeTeamId = get(`details[${props.index}].homeTeamId`, props.errors)
  const awayTeamId = get(`details[${props.index}].awayTeamId`, props.errors)
  const date = get(`details[${props.index}].date`, props.errors)

  return {
    homeTeamId,
    awayTeamId,
    date
  }
})
</script>
