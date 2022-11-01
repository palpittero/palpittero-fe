<template>
  <div class="surface-section p-5">
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
    <!-- <ul v-if="loading" class="m-0 p-0">
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
    </ul> -->

    <Transition name="championships-matches-list">
      <UsersGuessesDataTable
        v-show="isOpen"
        class="mt-3"
        :guesses="championship.guesses"
      />
    </Transition>

    <!-- <div v-else class="text-500 mb-5">
      {{ $t(emptyState) }}
    </div> -->
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'

import UsersGuessesDataTable from '../../Guesses/UsersGuessesDataTable/UsersGuessesDataTable.vue'

const i18n = useI18n()

defineProps({
  championship: {
    type: Object,
    required: true
  }
})

const isOpen = ref(true)

const toggle = computed(() => {
  return isOpen.value
    ? {
        icon: 'pi pi-angle-down',
        label: i18n.t('common.seeLess')
      }
    : {
        icon: 'pi pi-angle-right',
        label: i18n.t('common.seeMore')
      }
})

const handleToggle = () => (isOpen.value = !isOpen.value)
// const emits = defineEmits(['update:modelValue'])

// const rounds = reactive({
//   loading: false,
//   error: null,
//   data: []
// })

// const matchesGuesses = ref(props.modelValue)

// onMounted(
//   async () =>
//     (rounds.data = await services.championships.fetchRounds(
//       props.championship.id
//     ))
// )

// const loading = computed(() => rounds.loading)

// const handleUpdateMatchesGuesses = (value) => emits('update:modelValue', value)
</script>

<style lang="scss">
.championships-matches-list-enter-active,
.championships-matches-list-leave-active {
  transition: all 0.3s ease-in-out;
}

.championships-matches-list-enter-from,
.championships-matches-list-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>
