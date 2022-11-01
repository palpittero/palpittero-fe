<template>
  <div
    class="px-4 py-5 shadow-2 flex flex-column md:flex-row md:align-items-center justify-content-between mb-3 unprocessed-guesses-banner__process-guesses"
  >
    <div>
      <div class="text-white font-medium text-5xl">
        {{ $t('admin.dashboard.unprocessedGuesses.title', { total }, total) }}
      </div>
    </div>
    <div class="mt-4 mr-auto md:mt-0 md:mr-0">
      <Button
        @click="goToUnprocessedGuessesLeagues"
        class="p-button font-bold px-5 py-3 p-button-warning p-button-rounded p-button-raised"
      >
        {{ $t('admin.dashboard.unprocessedGuesses.cta') }}
      </Button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
  guesses: {
    type: Array,
    default: () => []
  }
})

const total = computed(() => props.guesses.length)

const goToUnprocessedGuessesLeagues = () =>
  router.push({
    name: 'AdminUnprocessedGuessesLeagues'
  })
</script>

<style lang="scss" scoped>
.unprocessed-guesses-banner {
  &__process-guesses {
    border-radius: 1rem;
    background: linear-gradient(
        0deg,
        rgba(0, 123, 255, 0.5),
        rgba(0, 123, 255, 0.5)
      ),
      linear-gradient(92.54deg, #1c80cf 47.88%, #ffffff 100.01%);
  }
}
</style>
