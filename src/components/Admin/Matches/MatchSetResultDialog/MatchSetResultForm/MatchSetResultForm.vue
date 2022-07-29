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
          <InputNumber
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
</script>

<style lang="scss">
.match-set-result-form__team {
  &-image {
    width: 40%;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }

  .p-inputtext {
    text-align: center;
    font-size: 1.5rem;
  }
}
</style>
