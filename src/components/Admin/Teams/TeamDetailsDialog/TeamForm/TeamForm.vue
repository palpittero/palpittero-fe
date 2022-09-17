<template>
  <div class="field">
    <label for="name">{{ $t('admin.teams.name') }}</label>
    <InputText
      id="name"
      v-model.trim="team.name"
      required
      autofocus
      :class="{ 'p-invalid': submitted && errors.name }"
    />
    <small class="p-invalid" v-if="submitted && errors.name">
      {{ $t('admin.teams.validation.name') }}
    </small>
  </div>
  <div class="field">
    <label for="badge">{{ $t('admin.teams.badge') }}</label>
    <ImageInput v-model="team.badge" />
  </div>

  <div class="field">
    <label class="mb-3">{{ $t('admin.teams.type') }}</label>
    <div class="grid">
      <div
        class="field-radiobutton col"
        v-for="option of TEAM_TYPES_OPTIONS"
        :key="option.id"
      >
        <RadioButton
          :id="`type-${option.id}`"
          name="type"
          :value="option.id"
          v-model="team.type"
        />
        <label :for="`type-${option.id}`">{{ $t(option.name) }}</label>
      </div>
    </div>
  </div>

  <template v-if="isClub">
    <div class="field" v-if="isClub">
      <label class="mb-3">{{ $t('admin.teams.country') }}</label>
      <CountrySelect v-model="team.country" />
    </div>

    <div class="field">
      <label for="region">{{ $t('admin.teams.region') }}</label>
      <InputText id="region" v-model.trim="team.region" />
    </div>

    <div class="field">
      <label for="national-division">{{
        $t('admin.teams.nationalDivision')
      }}</label>
      <InputNumber id="national-division" v-model="team.nationalDivision" />
    </div>
  </template>

  <div class="field">
    <label class="mb-3">{{ $t('common.status') }}</label>
    <BaseStatusPartialForm v-model="team.status" />
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import ImageInput from '@/components/Shared/ImageInput/ImageInput.vue'
import BaseStatusPartialForm from '@/components/Shared/BaseStatusPartialForm/BaseStatusPartialForm.vue'

import { TEAM_TYPES, TEAM_TYPES_OPTIONS } from '@/constants/teams'
import CountrySelect from '../../CountrySelect/CountrySelect.vue'

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
const team = reactive(props.modelValue.value)

watch(
  team,
  (value) => {
    emits('update:modelValue', value)
  },
  { deep: true }
)

const isClub = computed(() => team.type === TEAM_TYPES.CLUB)
</script>

<style lang="scss">
.team-form__badge {
  display: flex;
  justify-content: center;
  max-width: 50%;
  border-radius: 50%;
}
</style>
