<script setup lang="ts">
import type { iState } from '@/types'
import type { iUnprocessedGuess } from '@/types'
import { computed } from 'vue'

const props = defineProps<iState<iUnprocessedGuess | null>>()

const total = computed<number>(
  () => (props.data?.matchesGuesses?.length ?? 0) + (props.data?.championshipsGuesses?.length ?? 0),
)
</script>

<template>
  <div v-if="total > 0" role="alert" class="alert alert-soft alert-warning text-xl py-4">
    <i class="fa-solid fa-comments" />
    <span>{{ total }} palpites não processados</span>
    <router-link :to="{ name: 'admin.guesses' }" class="btn btn-sm btn-warning"
      >Ver Palpites</router-link
    >
  </div>
</template>
