<template>
  <div class="surface-section p-5">
    <div class="flex justify-content-between mb-3">
      <span class="font-medium text-3xl text-900">
        {{ championship.name }}
      </span>
      <!-- <span>
        <Button class="p-button-text p-button-clear"> Ver Pontuação </Button>
      </span> -->
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
    <UsersGuessesDataTable :guesses="championship.guesses" />

    <!-- <div v-else class="text-500 mb-5">
      {{ $t(emptyState) }}
    </div> -->
  </div>
</template>

<script setup>
import UsersGuessesDataTable from '../../Guesses/UsersGuessesDataTable/UsersGuessesDataTable.vue'

defineProps({
  championship: {
    type: Object,
    required: true
  }
})

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
