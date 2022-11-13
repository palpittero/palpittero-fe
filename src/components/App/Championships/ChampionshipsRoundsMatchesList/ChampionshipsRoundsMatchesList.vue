<template>
  <div class="surface-section">
    <div
      class="flex justify-content-between cursor-pointer p-3"
      @click="handleToggle"
    >
      <span class="font-medium text-3xl text-900">
        {{ championship.name }}
      </span>
      <span class="flex align-items-center gap-3">
        {{ toggle.label }} <span :class="toggle.icon" />
      </span>
      <!-- <span>
        <Button class="p-button-text p-button-clear"> Ver Pontuação </Button>
      </span> -->
    </div>
    <Transition name="championships-rounds-matches-list">
      <div v-show="isOpen">
        <!-- <Divider /> -->
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
          v-else-if="rounds.data.length"
          :model-value="matchesGuesses"
          :rounds="rounds.data"
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
import { computed, onMounted, ref } from 'vue'

import RoundMatchesList from './RoundsMatchesList/RoundsMatchesList.vue'

const i18n = useI18n()

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
  isOpen: Boolean
})

const emits = defineEmits(['update:modelValue'])

const rounds = ref({
  loading: false,
  error: null,
  data: []
})

const isOpen = ref(props.isOpen)

const matchesGuesses = ref(props.modelValue)

onMounted(
  async () =>
    (rounds.value.data = await services.championships.fetchRounds(
      props.championship.id
    ))
)

const loading = computed(() => rounds.value.loading)

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
