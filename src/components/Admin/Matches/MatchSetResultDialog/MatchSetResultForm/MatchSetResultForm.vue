<template>
  <div class="grid gap-5">
    <div
      class="card col-12 md:col-6 p-fluid match-set-result-form__team flex-1 text-center"
    >
      <div class="mb-3">
        <img
          :src="match.homeTeam.badge"
          :alt="match.homeTeam.name"
          class="match-set-result-form__team-image"
        />
      </div>
      <div>
        <h4 class="mb-1">
          {{ match.homeTeam.name }}
        </h4>
        <h6 class="mt-0 mb-3">
          {{ $t('admin.matches.homeTeam') }}
        </h6>
        <div class="field px-5">
          <label for="regular-time-home-team-goals">
            <small>
              {{ $t('admin.championships.regularTime') }}
            </small>
          </label>
          <InputNumber
            id="regular-time-home-team-goals"
            :value="match.regularTimeHomeTeamGoals"
            show-buttons
            :min="0"
            button-layout="horizontal"
            increment-button-icon="pi pi-plus"
            decrement-button-icon="pi pi-minus"
            :class="{ 'p-invalid': errors.regularTimeHomeTeamGoals }"
            @input="(value) => handleInput(value, 'regularTimeHomeTeamGoals')"
          />
          <small
            class="p-invalid"
            v-if="submitted && errors.regularTimeHomeTeamGoals"
          >
            {{ $t('admin.matches.validation.regularTimeHomeTeamGoals') }}
          </small>
        </div>

        <div class="field px-5" v-if="showPenaltiesResults">
          <label for="penalties-time-home-team-goals">
            <small>
              {{ $t('admin.championships.penalties') }}
            </small>
          </label>
          <InputNumber
            id="penalties-time-home-team-goals"
            :value="match.penaltiesTimeHomeTeamGoals"
            show-buttons
            :min="0"
            button-layout="horizontal"
            increment-button-icon="pi pi-plus"
            decrement-button-icon="pi pi-minus"
            :class="{ 'p-invalid': errors.regularTimeHomeTeamGoals }"
            @input="(value) => handleInput(value, 'penaltiesTimeHomeTeamGoals')"
          />
          <small
            class="p-invalid"
            v-if="submitted && errors.penaltiesTimeHomeTeamGoals"
          >
            {{ $t('admin.matches.validation.penaltiesTimeHomeTeamGoals') }}
          </small>
        </div>
      </div>
    </div>
    <div
      class="card col-12 md:col-6 p-fluid match-set-result-form__team flex-1 text-center"
    >
      <div class="mb-3">
        <img
          :src="match.awayTeam.badge"
          :alt="match.awayTeam.name"
          class="match-set-result-form__team-image"
        />
      </div>
      <div>
        <h4 class="mb-1">
          {{ match.awayTeam.name }}
        </h4>
        <h6 class="mt-0 mb-3">
          {{ $t('admin.matches.awayTeam') }}
        </h6>
        <div class="field px-5">
          <label for="regular-time-home-team-goals">
            <small>
              {{ $t('admin.championships.regularTime') }}
            </small>
          </label>
          <InputNumber
            :value="match.regularTimeAwayTeamGoals"
            show-buttons
            min="0"
            button-layout="horizontal"
            increment-button-icon="pi pi-plus"
            decrement-button-icon="pi pi-minus"
            :class="{ 'p-invalid': errors.regularTimeAwayTeamGoals }"
            @input="(value) => handleInput(value, 'regularTimeAwayTeamGoals')"
          />
          <small
            class="p-invalid"
            v-if="submitted && errors.regularTimeAwayTeamGoals"
          >
            {{ $t('admin.matches.validation.regularTimeAwayTeamGoals') }}
          </small>
        </div>

        <div class="field px-5" v-if="showPenaltiesResults">
          <label for="penalties-time-away-team-goals">
            <small>
              {{ $t('admin.championships.penalties') }}
            </small>
          </label>
          <InputNumber
            id="penalties-time-away-team-goals"
            :value="match.penaltiesTimeAwayTeamGoals"
            show-buttons
            :min="0"
            button-layout="horizontal"
            increment-button-icon="pi pi-plus"
            decrement-button-icon="pi pi-minus"
            :class="{ 'p-invalid': errors.regularTimeAwayTeamGoals }"
            @input="(value) => handleInput(value, 'penaltiesTimeAwayTeamGoals')"
          />
          <small
            class="p-invalid"
            v-if="submitted && errors.penaltiesTimeAwayTeamGoals"
          >
            {{ $t('admin.matches.validation.penaltiesTimeAwayTeamGoals') }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { CHAMPIONSHIPS_ROUND_TYPE } from '@/constants/championships'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  submitted: Boolean
})

const emits = defineEmits(['update:modelValue'])
const match = ref(props.modelValue)

const handleInput = ({ value }, key) => {
  match.value[key] = parseInt(value)
  emits('update:modelValue', match.value)
}

onMounted(() => {
  document.getElementById('regular-time-home-team-goals').focus()
})

const isPenaltiesRoundType = computed(() =>
  [
    CHAMPIONSHIPS_ROUND_TYPE.EXTRA_TIME,
    CHAMPIONSHIPS_ROUND_TYPE.PENALTIES
  ].includes(match.value.round.type)
)

const showPenaltiesResults = computed(() => {
  return (
    isPenaltiesRoundType.value &&
    match.value.regularTimeHomeTeamGoals ===
      match.value.regularTimeAwayTeamGoals
  )
})

watch(
  () => showPenaltiesResults.value,
  (currentValue) => {
    if (!currentValue) {
      match.value.penaltiesTimeHomeTeamGoals = null
      match.value.penaltiesTimeAwayTeamGoals = null
    } else {
      // if (!currentValue) {
      match.value.penaltiesTimeHomeTeamGoals = 0
      match.value.penaltiesTimeAwayTeamGoals = 0
      // }
    }
  }
)
</script>

<style lang="scss">
.match-set-result-form__team {
  &-image {
    width: 200px;
    height: 200px;
    object-fit: contain;
  }

  .p-inputtext {
    text-align: center;
    font-size: 1.5rem;
  }
}
</style>
