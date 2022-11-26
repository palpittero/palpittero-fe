<template>
  <div class="field">
    <label class="text-bold" for="league">
      {{ $t('common.leagues') }}
    </label>
    <LeagueSelect
      id="league"
      v-model="league"
      :filter="onFilterLeagues"
      @update:model-value="handleLeagueUpdate"
    />
  </div>
  <div class="field" v-if="copyGuesses.sourceLeagueId">
    <label class="text-bold">{{ $t('app.guesses.copyGuessesFrom') }}</label>
    <div class="flex gap-5">
      <div class="field-checkbox">
        <Checkbox
          id="copy-matches-guesses"
          name="city"
          v-model="copyGuesses.copyMatchesGuesses"
          binary
        />
        <label for="copy-matches-guesses" class="mr-2">
          {{ $t('common.matches') }}
        </label>
      </div>
      <div class="field-checkbox">
        <Checkbox
          id="copy-championships-guesses"
          name="city"
          v-model="copyGuesses.copyChampionshipsGuesses"
          binary
        />
        <label for="copy-championships-guesses" class="mr-2">
          {{ $t('common.positions') }}
        </label>
      </div>
    </div>
    <ChampionshipsPickList
      v-if="displayChampionships"
      v-model="championships"
      :invalid="submitted && errors.championships"
      :league-id="copyGuesses.leagueId"
      @update:modelValue="handleChampionshipsUpdate"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

import LeagueSelect from '@/components/Admin/Leagues/LeagueSelect/LeagueSelect.vue'
import ChampionshipsPickList from '@/components/Admin/Championships/ChampionshipsPickList/ChampionshipsPickList.vue'

import { USERS_LEAGUES_STATUSES } from '@/constants/leagues'

const { loggedUser } = useAuthStore()

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  leagueId: {
    type: Number,
    required: true
  },
  championships: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['update:modelValue'])

const league = ref(null)
const championships = ref([])

const copyGuesses = computed({
  set(value) {
    emits('update:modelValue', value)
  },
  get() {
    return props.modelValue
  }
})

const onFilterLeagues = ({ id, users }) => {
  return (
    id !== props.leagueId &&
    users.find(
      ({ id, status }) =>
        id === loggedUser?.id && status === USERS_LEAGUES_STATUSES.APPROVED
    )
  )
}

const handleLeagueUpdate = (league) =>
  (copyGuesses.value.sourceLeagueId = league?.id)

const handleChampionshipsUpdate = (championships) =>
  (copyGuesses.value.championshipsIds = championships.map(({ id }) => id))

const displayChampionships = computed(
  () =>
    copyGuesses.value.copyMatchesGuesses ||
    copyGuesses.value.copyChampionshipsGuesses
)
</script>
