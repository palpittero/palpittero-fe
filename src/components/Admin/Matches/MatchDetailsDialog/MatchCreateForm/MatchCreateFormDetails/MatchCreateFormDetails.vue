<template>
  <div class="grid align-items-center">
    <div class="col-12 field" v-if="championship.hasGroups && !ignoreGroups">
      <label for="group">{{ $t('admin.matches.group') }}</label>
      <GroupSelect
        v-model="detail.group"
        :championship-id="championship.id"
        :invalid="submitted && parsedErrors.groupId"
        :extra-fields="['teams']"
        @update:model-value="handleGroupUpdate"
      />
      <small class="p-invalid" v-if="submitted && parsedErrors.awayTeamId">
        {{ $t('admin.matches.validation.group') }}
      </small>
    </div>

    <template v-if="showTeams">
      <div class="col-6 lg:col-6 field">
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

      <div class="col-6 lg:col-6 field">
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

      <div class="col-12 field">
        <label for="date">{{ $t('admin.matches.date') }}</label>
        <Calendar
          id="date"
          v-model="detail.date"
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
    </template>
    <div class="w-full flex justify-content-end mb-2">
      <Button
        icon="pi pi-trash"
        :label="$t('admin.matches.removeMatch')"
        class="p-button-text p-button-sm p-button-danger mb-2"
        @click="handleRemoveDetail"
      />
    </div>
    <!-- <div class="col-1"> -->
    <!-- </div> -->
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { get } from 'lodash/fp'

import TeamSelect from '@/components/Admin/Teams/TeamSelect/TeamSelect.vue'
import GroupSelect from '@/components/Shared/Championships/GroupSelect/GroupSelect.vue'

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
  ignoreGroups: Boolean,
  submitted: Boolean
})

const emits = defineEmits(['update:modelValue', 'remove'])

const detail = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const groupTeamsId = computed(
  () => detail.value.group?.teams?.map(({ id }) => id) || []
)

const onFilterHomeTeam = (teams) =>
  teams.filter(
    ({ id }) =>
      (!props.championship.hasGroups ||
        props.ignoreGroups ||
        (props.championship.hasGroups && groupTeamsId.value.includes(id))) &&
      id !== detail.value.awayTeam?.id
  )

const onFilterAwayTeam = (teams) =>
  teams.filter(
    ({ id }) =>
      (!props.championship.hasGroups ||
        props.ignoreGroups ||
        (props.championship.hasGroups && groupTeamsId.value.includes(id))) &&
      id !== detail.value.homeTeam?.id
  )

const handleGroupUpdate = (group) => {
  detail.value.groupId = group?.id ?? null
  detail.value.homeTeam = null
  handleHomeTeamUpdate()
  detail.value.awayTeam = null
  handleAwayTeamUpdate()
}

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

const showTeams = computed(
  () =>
    !props.championship.hasGroups ||
    (props.championship.hasGroups && (detail.value.group || props.ignoreGroups))
)
</script>
