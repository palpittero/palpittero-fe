<template>
  <div class="field">
    <label for="championship">{{ $t('admin.matches.championship') }}</label>
    <ChampionshipSelect
      v-model="championship"
      :invalid="submitted && errors.championshipId"
      :extra-fields="['hasGroups']"
      @update:model-value="handleChampionshipUpdate"
    />
    <small class="p-invalid" v-if="submitted && errors.championshipId">
      {{ $t('admin.matches.validation.championship') }}
    </small>
  </div>
  <template v-if="championship">
    <div class="field">
      <label for="championship">{{ $t('admin.matches.round') }}</label>
      <RoundSelect
        v-model="match.round"
        :championship-id="championship.id"
        :invalid="submitted && errors.roundId"
        :extra-fields="['ignoreGroups']"
        @update:model-value="handleRoundUpdate"
      />
      <small class="p-invalid" v-if="submitted && errors.roundId">
        {{ $t('admin.matches.validation.round') }}
      </small>
    </div>
    <div class="field" v-if="showGroup">
      <label for="championship">{{ $t('admin.matches.group') }}</label>
      <GroupSelect
        v-model="match.group"
        :championship-id="championship.id"
        :invalid="submitted && errors.groupId"
        :extra-fields="['teams']"
        @update:model-value="handleGroupUpdate"
      />
      <small class="p-invalid" v-if="submitted && errors.groupId">
        {{ $t('admin.matches.validation.group') }}
      </small>
    </div>
    <div class="field">
      <label for="homeTeam">{{ $t('admin.matches.homeTeam') }}</label>
      <TeamSelect
        v-model="match.homeTeam"
        :filter="onFilterHomeTeam"
        :championship-id="championship.id"
        :invalid="submitted && errors.homeTeamId"
        @update:model-value="handleHomeTeamUpdate"
      />
      <small class="p-invalid" v-if="submitted && errors.homeTeamId">
        {{ $t('admin.matches.validation.homeTeam') }}
      </small>
    </div>

    <div class="field">
      <label for="awayTeam">{{ $t('admin.matches.awayTeam') }}</label>
      <TeamSelect
        v-model="match.awayTeam"
        :filter="onFilterAwayTeam"
        :championship-id="championship.id"
        :invalid="submitted && errors.awayTeamId"
        @update:model-value="handleAwayTeamUpdate"
      />
      <small class="p-invalid" v-if="submitted && errors.awayTeamId">
        {{ $t('admin.matches.validation.awayTeam') }}
      </small>
    </div>
  </template>

  <div class="field">
    <label for="date">{{ $t('admin.matches.date') }}</label>
    <Calendar
      id="date"
      v-model="match.date"
      show-time
      :show-seconds="false"
      dateFormat="D, d/mm/yy"
      :stepMinute="15"
      show-button-bar
      hide-on-date-time-select
      :manual-input="false"
      :class="{ 'p-invalid': submitted && errors.date }"
    />
    <small class="p-invalid" v-if="submitted && errors.date">
      {{ $t('admin.matches.validation.date') }}
    </small>
  </div>
  <div class="field-checkbox">
    <Checkbox id="admin" name="city" v-model="match.resetStatus" binary />
    <label for="admin" class="mr-2">
      {{ $t('admin.matches.resetStatus') }}
    </label>
    <span
      class="pi pi-question-circle"
      v-tooltip="$t('admin.matches.resetStatusHint')"
    />
  </div>
</template>

<script setup>
import { watch, ref, computed } from 'vue'
import TeamSelect from '@/components/Admin/Teams/TeamSelect/TeamSelect.vue'
import ChampionshipSelect from '@/components/Admin/Championships/ChampionshipSelect/ChampionshipSelect.vue'
import RoundSelect from '@/components/Admin/Rounds/RoundSelect/RoundSelect.vue'
import GroupSelect from '@/components/Shared/Championships/GroupSelect/GroupSelect.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  submitted: Boolean
})

const emits = defineEmits(['update:modelValue'])
const match = ref(props.modelValue)
const championship = ref(match.value.championship || null)

watch(
  () => match.value,
  (value) => {
    emits('update:modelValue', value), { deep: true }
  },
  { deep: true, immediate: true }
)

watch(
  () => match.value.group,
  () => {
    match.value.homeTeam = null
    match.value.awayTeam = null

    handleHomeTeamUpdate()
    handleAwayTeamUpdate()
  }
)

const groupTeamsId = computed(
  () => match.value.group?.teams?.map(({ id }) => id) || []
)

const showGroup = computed(
  () => championship.value.hasGroups && !match.value.round.ignoreGroups
)

const onFilterHomeTeam = (teams) =>
  teams.filter(
    ({ id }) =>
      (!championship.value.hasGroups ||
        match.value.round.ignoreGroups ||
        (championship.value.hasGroups && groupTeamsId.value.includes(id))) &&
      id !== match.value.awayTeam?.id
  )

const onFilterAwayTeam = (teams) =>
  teams.filter(
    ({ id }) =>
      (!championship.value.hasGroups ||
        match.value.round.ignoreGroups ||
        (championship.value.hasGroups && groupTeamsId.value.includes(id))) &&
      id !== match.value.homeTeam?.id
  )

const handleChampionshipUpdate = (championship) => {
  match.value.championshipId = championship.id

  match.value.round = null
  match.value.homeTeam = null
  match.value.awayTeam = null

  handleRoundUpdate()
  handleHomeTeamUpdate()
  handleAwayTeamUpdate()
}

const handleRoundUpdate = (round) => (match.value.roundId = round?.id ?? null)

const handleHomeTeamUpdate = (team) =>
  (match.value.homeTeamId = team?.id ?? null)

const handleAwayTeamUpdate = (team) =>
  (match.value.awayTeamId = team?.id ?? null)
</script>

<style lang="scss">
.team-form__badge {
  display: flex;
  justify-content: center;
  max-width: 50%;
}
</style>
