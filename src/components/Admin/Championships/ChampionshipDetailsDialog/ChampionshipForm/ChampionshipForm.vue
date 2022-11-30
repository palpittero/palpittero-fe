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
        class="flex gap-3 mb-2 align-items-center"
        v-for="round of championship.rounds"
        :key="round.uuid || round.id"
      >
        <InputText
          v-model="round.name"
          class="flex-1"
          :placeholder="$t('admin.championships.name')"
        />
        <div class="flex align-items-center gap-3 flex-1">
          <RoundTypeSelect class="flex-1" v-model="round.type" />
          <div class="flex align-items-center gap-2">
            <Checkbox
              inputId="ignore-groups"
              v-model="round.ignoreGroups"
              :binary="true"
            />
            <label for="ignore-groups">
              {{ $t('admin.championships.ignoreGroups') }}
            </label>
          </div>
        </div>

        <span
          class="pi pi-trash p-button p-button-text p-button-danger"
          @click="handleRemoveRound(round)"
        />
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
    <div class="flex align-items-center gap-3 mb-3">
      {{ $t('admin.championships.setGroups') }}
      <InputSwitch v-model="championship.hasGroups" />
    </div>
    <hr />

    <template v-if="championship.hasGroups">
      <div
        class="flex align-items-start gap-2 mb-2"
        v-for="group of championship.groups"
        :key="group.uuid || group.id"
      >
        <InputText
          class="w-full"
          v-model="group.name"
          :placeholder="$t('admin.championships.name')"
        />
        <TeamsAutoComplete
          v-model="group.teams"
          class="w-full"
          :on-filter="getOnFilterTeams(championship.groups)"
          :teams="championship.teams"
        />

        <span
          class="pi pi-trash p-button p-button-text p-button-danger"
          @click="handleRemoveGroup(group)"
        />
      </div>
      <InlineMessage severity="warn" v-if="hasNoGroups">
        {{ $t('admin.championships.noGroups') }}
      </InlineMessage>
      <hr />
      <Button
        class="p-button p-button-icon justify-content-center"
        @click="handleAddGroup"
      >
        <span class="pi pi-plus mr-2" />
        {{ $t('admin.championships.addGroup') }}
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
import { computed, ref, watch } from 'vue'
import {
  CHAMPIONSHIPS_ROUNDS,
  CHAMPIONSHIPS_ROUND_TYPE
} from '@/constants/championships'
import { uniqueId } from 'lodash'
import RoundTypeSelect from '@/components/Admin/Rounds/RoundTypeSelect/RoundTypeSelect.vue'
import TeamsAutoComplete from '@/components/Shared/Teams/TeamsAutoComplete/TeamsAutoComplete.vue'

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
const championship = ref(props.modelValue)

const newRound = (name) => ({
  uuid: uniqueId(),
  name: name || '',
  type: CHAMPIONSHIPS_ROUND_TYPE.REGULAR_TIME,
  ignoreGroups: false
})

const newGroup = (name) => ({
  uuid: uniqueId(),
  name: name || '',
  teams: []
})

let rounds = ref([newRound('Rodada #1')])
let groups = ref([newGroup('Grupo A')])

watch(
  () => championship.value,
  (value) => {
    emits('update:modelValue', value)
  },
  { deep: true, immediate: true }
)

const isRoundsTypeSimple = computed(
  () => championship.value.roundsType === CHAMPIONSHIPS_ROUNDS.SIMPLE
)

const isCreating = computed(() => !championship.value.id)

const hasNoRounds = computed(() => championship.value.rounds?.length === 0)

watch(isRoundsTypeSimple, (current) => {
  if (current) {
    championship.value.rounds = championship.value.rounds.length
  } else if (!championship.value.id) {
    championship.value.rounds = rounds.value
  }
})

watch(
  () => isCreating.value && championship.value.hasGroups,
  (current) => {
    if (current) {
      championship.value.groups = groups.value
    }
  }
)

const handleAddRound = () => {
  const name = `Rodada #${championship.value.rounds.length + 1}`
  championship.value.rounds = [...championship.value.rounds, newRound(name)]
}

const handleRemoveRound = (round) =>
  (championship.value.rounds = championship.value.rounds.filter(
    ({ uuid, id }) => id !== round.id || uuid !== round.uuid
  ))

const handleAddGroup = () => {
  const name = `Grupo ${championship.value.groups.length + 1}`
  championship.value.groups = [...championship.value.groups, newGroup(name)]
}

const handleRemoveGroup = (group) =>
  (championship.value.groups = championship.value.groups.filter(
    ({ uuid, id }) => id !== group.id || uuid !== group.uuid
  ))

const getOnFilterTeams = (groups) => (team) => {
  const selectedTeams = groups.reduce(
    (acc, group) => [...acc, ...group.teams.map(({ id }) => id)],
    []
  )

  return !selectedTeams.includes(team.id)
}
</script>
