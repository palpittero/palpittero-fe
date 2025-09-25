<script setup lang="ts">
import { reactive } from 'vue'
import services from '@/services'
import type { iGuess, iMatch, iState } from '@/types'
import BaseModal from '@/components/Shared/BaseModal.vue'
import BaseEmptyState from '@/components/Shared/BaseEmptyState.vue'
import MatchGuessesModalHeader from './MatchGuessesModalHeader.vue'
import FormattedDate from '@/components/Shared/FormattedDate.vue'
import MatchGuessesModalItem from '@/components/App/Guesses/MatchGuessModalItem.vue'

const props = defineProps<{
  match: iMatch | null
  leagueId: number
}>()

const matchGuesses = reactive<iState<iGuess[]>>({
  loading: false,
  data: [],
  error: null,
})

const loadMatchGuesses = async () => {
  if (!props.match?.id || !props.leagueId) {
    matchGuesses.data = []
    return
  }

  try {
    matchGuesses.loading = true
    matchGuesses.error = null

    const guesses = await services.guesses.fetchGuesses({
      matchId: props.match.id,
      leagueId: props.leagueId,
    })

    matchGuesses.data = Array.isArray(guesses) ? guesses : guesses?.data || []
  } catch (error) {
    console.error('Error loading match guesses:', error)
    matchGuesses.error = 'Erro ao carregar palpites do jogo'
    matchGuesses.data = []
  } finally {
    matchGuesses.loading = false
  }
}
</script>

<template>
  <BaseModal
    id="match_guesses_modal"
    title="Palpites do Jogo"
    @open="loadMatchGuesses"
    size="md"
    hide-confirm-button
    cancel-button-text="Fechar"
  >
    <div class="flex flex-col space-y-4">
      <MatchGuessesModalHeader :match="match" />

      <div v-if="matchGuesses.loading" class="flex justify-center py-8">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <div v-else-if="matchGuesses.error" class="alert alert-error">
        <i class="fa-solid fa-exclamation-triangle" />
        <span>{{ matchGuesses.error }}</span>
      </div>

      <BaseEmptyState
        v-else-if="matchGuesses.data.length === 0"
        title="Nenhum palpite encontrado"
        description="Ainda não há palpites para este jogo"
      />

      <!-- Guesses list -->
      <div v-else class="space-y-3">
        <div class="flex justify-between items-center">
          <h4 class="font-semibold text-base-content/80">
            {{ matchGuesses.data.length }} palpite(s)
          </h4>
          <div class="text-sm text-base-content/60">
            Atualizado em <FormattedDate :date="new Date().toISOString()" />
          </div>
        </div>

        <div class="grid gap-3">
          <MatchGuessesModalItem
            v-for="guess in matchGuesses.data"
            :key="guess.id || guess.userId"
            :guess="guess"
            :match="match"
            :leagueId="leagueId"
          />
        </div>
      </div>
    </div>
  </BaseModal>
</template>
