<template>
  <div class="field">
    <label for="championship">{{ $t('admin.matches.championship') }}</label>
    <ChampionshipSelect
      v-model="championship"
      :invalid="submitted && errors.championshipId"
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
        :championship-id="championshipId"
        :invalid="submitted && errors.roundId"
        @update:model-value="handleRoundUpdate"
        :disabled="!championship"
      />
      <small class="p-invalid" v-if="submitted && errors.roundId">
        {{ $t('admin.matches.validation.round') }}
      </small>
    </div>
    <template v-if="match.round">
      <h5>Partidas</h5>
      <Divider />
      <div>
        <template v-for="(detail, index) in match.details" :key="detail.uuid">
          <MatchCreateFormDetails
            :model-value="detail"
            :championship="championship"
            :index="index"
            :errors="errors"
            :submitted="submitted"
            @update:model-value="(detail) => handleUpdateDetail(detail, index)"
            @remove="handleRemoveDetail"
          />
        </template>
        <Button
          class="w-full justify-content-center"
          icon="pi pi-plus"
          :label="'Adicionar Partida'"
          @click="handleAddNewDetail"
        />
      </div>
    </template>
  </template>
</template>

<script setup>
import { watch, ref, computed } from 'vue'
import { uniqueId } from 'lodash/fp'
import ChampionshipSelect from '@/components/Admin/Championships/ChampionshipSelect/ChampionshipSelect.vue'
import RoundSelect from '@/components/Admin/Rounds/RoundSelect/RoundSelect.vue'
import MatchCreateFormDetails from './MatchCreateFormDetails/MatchCreateFormDetails.vue'
import { MATCH_DETAIL_MODEL } from '@/constants/matches'

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
const generateDetail = () => ({
  ...MATCH_DETAIL_MODEL,
  uuid: uniqueId()
})

const initDetails = () => [generateDetail()]

const handleChampionshipUpdate = (championship) => {
  match.value.championshipId = championship.id

  match.value.round = null
  match.value.homeTeam = null
  match.value.awayTeam = null

  match.value.details = initDetails(match.value)

  handleRoundUpdate()
}

const handleRoundUpdate = (round) => (match.value.roundId = round?.id ?? null)

const handleAddNewDetail = () =>
  (match.value.details = [...match.value.details, generateDetail()])

const handleUpdateDetail = (detail, index) =>
  (match.value.details[index] = detail)

const handleRemoveDetail = (uuid) => {
  console.log(uuid)
  match.value.details = match.value.details.filter(
    (detail) => detail.uuid !== uuid
  )
}

const championshipId = computed(() => championship.value?.id)
</script>

<style lang="scss">
.team-form__badge {
  display: flex;
  justify-content: center;
  max-width: 50%;
}
</style>
