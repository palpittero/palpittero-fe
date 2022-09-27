<template>
  <div class="field">
    <label for="name">{{ $t('admin.championships.name') }}</label>
    <InputText
      id="name"
      v-model.trim="championship.name"
      required
      autofocus
      :class="{ 'p-invalid': submitted && errors.name }"
    />
    <small class="p-invalid" v-if="submitted && errors.name">
      {{ $t('admin.championships.validation.name') }}
    </small>
  </div>

  <div class="field">
    <label for="name">{{ $t('admin.championships.year') }}</label>
    <InputNumber
      id="year"
      :step="1"
      v-model="championship.year"
      required
      :class="{ 'p-invalid': submitted && errors.year }"
    />
    <small class="p-invalid" v-if="submitted && errors.year">
      {{ $t('admin.championships.validation.year') }}
    </small>
  </div>

  <div class="field">
    <label for="teams">{{ $t('admin.championships.teams') }}</label>
    <TeamsPickList id="teams" v-model="championship.teams" required />
  </div>

  <div class="field">
    <label class="mb-3">{{ $t('admin.championships.rounds') }}</label>
    <div class="grid" v-if="isCreating">
      <div class="field-radiobutton col-6">
        <RadioButton
          id="rounds-simple"
          name="roundsType"
          :value="CHAMPIONSHIPS_ROUNDS.SIMPLE"
          v-model="championship.roundsType"
        />
        <label for="rounds-simple">{{
          $t('admin.championships.simple')
        }}</label>
      </div>
      <div class="field-radiobutton col-6">
        <RadioButton
          id="rounds-detailed"
          name="roundsType"
          :value="CHAMPIONSHIPS_ROUNDS.DETAILED"
          v-model="championship.roundsType"
        />
        <label for="rounds-detailed">{{
          $t('admin.championships.detailed')
        }}</label>
      </div>
      <hr />
    </div>

    <InputNumber
      v-if="isRoundsTypeSimple"
      id="rounds"
      class="col-6 p-0"
      :step="1"
      v-model="championship.rounds"
      required
      :class="{ 'p-invalid': submitted && errors.rounds }"
    />

    <template v-else>
      <div
        class="grid p-fluid"
        v-for="(round, index) of championship.rounds"
        :key="round._id || round.id"
      >
        <div class="col-6">
          <InputText
            v-model="round.name"
            :placeholder="$t('admin.championships.name')"
          />
        </div>
        <div class="col-5">
          <RoundTypeSelect v-model="round.type" />
        </div>
        <div class="col" v-if="index > 0">
          <span
            class="pi pi-trash p-button p-button-text p-button-danger"
            @click="handleRemoveRound(round)"
          />
        </div>
      </div>
      <InlineMessage severity="warn" v-if="hasNoRounds">
        {{ $t('admin.championships.noRounds') }}
      </InlineMessage>
      <hr />
      <Button
        class="p-button p-button-icon justify-content-center"
        @click="handleAddRound"
      >
        <span class="pi pi-plus mr-2" />
        {{ $t('admin.championships.addRound') }}
      </Button>
    </template>
  </div>

  <div class="field">
    <label class="mb-3">{{ $t('common.status') }}</label>
    <BaseStatusPartialForm v-model="championship.status" />
  </div>
</template>

<script setup>
import BaseStatusPartialForm from '@/components/Shared/BaseStatusPartialForm/BaseStatusPartialForm.vue'
import TeamsPickList from '@/components/Admin/Teams/TeamsPickList/TeamsPickList.vue'
import { computed, reactive, ref, watch } from 'vue'
import {
  CHAMPIONSHIPS_ROUNDS,
  CHAMPIONSHIPS_ROUND_TYPE
} from '@/constants/championships'
import { uniqueId } from 'lodash'
import RoundTypeSelect from '@/components/Admin/Rounds/RoundTypeSelect/RoundTypeSelect.vue'

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
const championship = reactive(props.modelValue.value)

const newRound = (name) => ({
  _id: uniqueId(),
  name: name || '',
  type: CHAMPIONSHIPS_ROUND_TYPE.REGULAR_TIME
})

let rounds = ref([newRound('Rodada #1')])

watch(
  championship,
  (value) => {
    emits('update:modelValue', value)
  },
  { deep: true }
)

const isRoundsTypeSimple = computed(
  () => championship.roundsType === CHAMPIONSHIPS_ROUNDS.SIMPLE
)

const isCreating = computed(() => !championship.id)

const hasNoRounds = computed(() => championship.rounds.length === 0)

watch(isRoundsTypeSimple, (current, previous) => {
  if (previous === false) {
    championship.rounds = championship.rounds.length
  } else {
    championship.rounds = rounds.value
  }
})

const handleAddRound = () => {
  const name = `Rodada #${championship.rounds.length + 1}`
  championship.rounds = [...championship.rounds, newRound(name)]
}

const handleRemoveRound = (round) =>
  (championship.rounds = championship.rounds.filter(
    ({ _id, id }) => id !== round.id || _id !== round._id
  ))
</script>
