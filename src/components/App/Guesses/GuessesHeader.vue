<script setup lang="ts">
defineProps<{
  leagueName?: string
  isRegisterGuessesDisabled: boolean
  isLoading: boolean
}>()

const emits = defineEmits<{
  registerGuesses: []
  copyGuesses: []
}>()

const handleRegisterGuesses = () => {
  emits('registerGuesses')
}

const handleCopyGuesses = () => {
  emits('copyGuesses')
}
</script>

<template>
  <div
    class="sticky top-0 lg:top-18 bg-base-100/95 backdrop-blur-sm z-50 lg:z-40 p-4 -m-4 rounded-box border border-base-300 flex flex-wrap justify-between items-center gap-4"
  >
    <div>
      <h1 class="text-2xl md:text-3xl font-bold text-base-content flex items-center gap-3">
        <i class="fa-solid fa-flag" />
        {{ leagueName }}
      </h1>
    </div>

    <div class="flex gap-2">
      <button
        class="btn btn-primary gap-2"
        :disabled="isRegisterGuessesDisabled"
        @click="handleRegisterGuesses"
      >
        <i class="fa-solid fa-bolt" />
        Registrar Palpites
      </button>
      <button class="btn btn-secondary gap-2" :disabled="isLoading" @click="handleCopyGuesses">
        <i class="fa-solid fa-copy" />
        Copiar Palpites
      </button>
    </div>
  </div>
</template>
