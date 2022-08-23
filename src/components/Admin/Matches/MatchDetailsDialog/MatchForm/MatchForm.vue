<template>
  <div class="field">
    <label for="championship">{{ $t('admin.matches.championship') }}</label>
    <ChampionshipSelect
      v-model="championship"
      :invalid="submitted && errors.championshipId"
    />
    <small class="p-invalid" v-if="submitted && errors.championship">
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
        @update:model-value="handleRound"
      />
      <small class="p-invalid" v-if="submitted && errors.roundId">
        {{ $t('admin.matches.validation.round') }}
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
      :min-date="minDate"
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
</template>

<script setup>
import { reactive, watch } from 'vue'
import TeamSelect from '@/components/Admin/Teams/TeamSelect/TeamSelect.vue'
import ChampionshipSelect from '@/components/Admin/Championships/ChampionshipSelect/ChampionshipSelect.vue'
import RoundSelect from '@/components/Admin/Rounds/RoundSelect/RoundSelect.vue'

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
const match = reactive(props.modelValue.value)
const minDate = new Date()
const championship = reactive(props.modelValue.value.championship || null)

watch(match, (value) => emits('update:modelValue', value), { deep: true })

const onFilterHomeTeam = (teams) =>
  teams.filter(({ id }) => id !== match.awayTeam?.id)

const onFilterAwayTeam = (teams) =>
  teams.filter(({ id }) => id !== match.homeTeam?.id)

const handleRound = (round) => (match.roundId = round.id)

const handleHomeTeamUpdate = (team) => (match.homeTeamId = team.id)

const handleAwayTeamUpdate = (team) => (match.awayTeamId = team.id)
</script>

<style lang="scss">
.team-form__badge {
  display: flex;
  justify-content: center;
  max-width: 50%;
}
</style>
