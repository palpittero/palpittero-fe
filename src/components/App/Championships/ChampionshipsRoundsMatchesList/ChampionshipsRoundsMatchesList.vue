<template>
  <div class="surface-section p-3">
    <div
      class="flex justify-content-between cursor-pointer"
      @click="handleToggle"
    >
      <span class="font-medium text-3xl text-900">
        {{ championship.name }}
      </span>
      <span class="flex align-items-center gap-3">
        {{ toggle.label }} <span :class="toggle.icon" />
      </span>
    </div>
    <Transition name="championships-rounds-matches-list">
      <div v-show="isOpen">
        <ChampionshipGuesses
          v-model="championshipGuesses"
          :loading="isLoading"
          :championship-id="championship.id"
          :league-id="leagueId"
          :disabled="!enablePositionGuesses"
        />
        <ul v-if="loading" class="m-0 p-0">
          <li class="mb-4">
            <Skeleton width="100%" class="mb-2" />
            <Skeleton width="75%" />
          </li>
          <li class="mb-4">
            <Skeleton width="100%" class="mb-2" />
            <Skeleton width="75%" />
          </li>
          <li class="mb-4">
            <Skeleton width="100%" class="mb-2" />
            <Skeleton width="75%" />
          </li>
          <li class="mb-4">
            <Skeleton width="100%" class="mb-2" />
            <Skeleton width="75%" />
          </li>
          <li class="mb-4">
            <Skeleton width="100%" class="mb-2" />
            <Skeleton width="75%" />
          </li>
        </ul>
        <RoundMatchesList
          v-else-if="rounds.length"
          :model-value="matchesGuesses"
          :rounds="rounds"
          :league-id="leagueId"
          :memory-registered-guesses="memoryRegisteredGuesses"
          @update:model-value="handleUpdateMatchesGuesses"
        />

        <div v-else class="text-500 mb-5">
          {{ $t(emptyState) }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import services from '@/services'
import { computed, onMounted, ref, watch } from 'vue'

import RoundMatchesList from './RoundsMatchesList/RoundsMatchesList.vue'
import ChampionshipGuesses from './ChampionshipGuesses/ChampionshipGuesses.vue'
import { useAuthStore } from '@/stores/auth'
import {
  getChampionshipGuessesInitialValues,
  parseChampionshipGuesses
} from '@/helpers/guesses'

const i18n = useI18n()
const { loggedUser } = useAuthStore()

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  championship: {
    type: Object,
    required: true
  },
  leagueId: {
    type: Object,
    required: true
  },
  emptyState: {
    type: String,
    default: ''
  },
  memoryRegisteredGuesses: {
    type: Array,
    default: () => []
  },
  enablePositionGuesses: Boolean,
  isOpen: Boolean
})

const emits = defineEmits(['update:modelValue', 'update:championshipGuesses'])

const isOpen = ref(props.isOpen)
const isLoading = ref(false)

const matchesGuesses = ref(props.modelValue)

const rounds = ref([])
const championshipGuesses = ref({})

onMounted(async () => {
  isLoading.value = true

  rounds.value = await services.championships.fetchRounds(props.championship.id)

  // if (props.enablePositionGuesses) {
  const championshipId = props.championship.id
  const leagueId = props.leagueId
  const userId = loggedUser.id

  const championshipGuessesData =
    await services.championshipsGuesses.fetchChampionshipsGuesses({
      championshipId,
      leagueId,
      userId
    })

  championshipGuesses.value = {
    ...getChampionshipGuessesInitialValues({
      championshipId,
      leagueId,
      userId
    }),
    ...parseChampionshipGuesses(championshipGuessesData)
  }

  // }

  isLoading.value = false
})

watch(
  () => championshipGuesses.value,
  (championshipGuesses) =>
    emits('update:championshipGuesses', championshipGuesses),
  { deep: true }
)

const handleUpdateMatchesGuesses = (value) => emits('update:modelValue', value)

const toggle = computed(() => {
  return isOpen.value
    ? {
        icon: 'pi pi-angle-down',
        label: i18n.t('common.hide')
      }
    : {
        icon: 'pi pi-angle-right',
        label: i18n.t('common.show')
      }
})

const handleToggle = () => (isOpen.value = !isOpen.value)
</script>

<style lang="scss">
.championships-rounds-matches-list-enter-active,
.championships-rounds-matches-list-leave-active {
  transition: all 0.3s ease-in-out;
}

.championships-rounds-matches-list-enter-from,
.championships-rounds-matches-list-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>
