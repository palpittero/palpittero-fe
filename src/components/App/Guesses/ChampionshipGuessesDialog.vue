<script setup lang="ts">
import { computed, reactive } from 'vue'
import services from '@/services'
import type { iChampionshipGuess, iState } from '@/types'
import BaseImage from '@/components/Shared/BaseImage.vue'
import BaseModal from '@/components/Shared/BaseModal.vue'
import FormattedDate from '@/components/Shared/FormattedDate.vue'

const props = defineProps<{
  championshipId: number | null
  leagueId: number
}>()

const championshipGuesses = reactive<iState<iChampionshipGuess[]>>({
  loading: false,
  data: [],
  error: null,
})

const championshipName = computed<string>(
  () => championshipGuesses.data[0]?.championship?.name || '',
)

// Computed properties to separate champion and runner-up guesses
const championGuesses = computed<iChampionshipGuess[]>(() =>
  championshipGuesses.data.filter((guess) => guess.position === 1),
)

const runnerUpGuesses = computed<iChampionshipGuess[]>(() =>
  championshipGuesses.data.filter((guess) => guess.position === 2),
)

const hasChampionshipGuesses = computed<boolean>(() => championshipGuesses.data.length > 0)

const loadChampionshipGuesses = async () => {
  if (!props.championshipId || !props.leagueId) {
    championshipGuesses.data = []
    return
  }

  try {
    championshipGuesses.loading = true
    championshipGuesses.error = null

    championshipGuesses.data = await services.championshipsGuesses.fetchChampionshipsGuesses({
      championshipId: props.championshipId,
      leagueId: props.leagueId,
    })
  } catch (error) {
    console.error('Error loading championship guesses:', error)
    championshipGuesses.error = 'Erro ao carregar palpites do campeonato'
    championshipGuesses.data = []
  } finally {
    championshipGuesses.loading = false
  }
}
</script>

<template>
  <BaseModal
    id="championship_guesses_dialog"
    title="Palpites do Campeonato"
    @open="loadChampionshipGuesses"
    size="sm"
    hide-confirm-button
    cancel-button-text="Fechar"
  >
    <div class="flex flex-col space-y-4">
      <div v-if="championshipGuesses.loading" class="flex justify-center py-8">
        <span class="loading loading-spinner loading-lg text-primary" />
      </div>

      <div v-else-if="championshipGuesses.error" class="alert alert-error">
        <i class="fa-solid fa-exclamation-triangle" />
        <span>{{ championshipGuesses.error }}</span>
      </div>

      <div v-else class="space-y-2">
        <div class="card bg-base-200/50 shadow-sm">
          <div class="card-body p-4 text-center">
            <h4 class="font-bold text-xl">{{ championshipName }}</h4>
            <p class="text-sm text-base-content/60">Campeão e vice-campeão</p>
          </div>
        </div>
        <!-- Guesses list -->
        <div v-if="hasChampionshipGuesses" class="space-y-3">
          <div class="flex justify-between items-center">
            <h4 class="font-semibold text-base-content/80">
              {{ championshipGuesses.data.length }} palpite(s)
            </h4>
            <div class="text-sm text-base-content/60">
              Atualizado em <FormattedDate :date="new Date().toISOString()" />
            </div>
          </div>

          <!-- Champion guesses -->
          <div class="space-y-2">
            <h5 class="font-semibold text-base-content/80 flex items-center gap-2">
              <i class="fa-solid fa-crown text-yellow-500" />
              Campeão
            </h5>
            <div
              v-for="guess in championGuesses"
              :key="`champion-${guess.userId}`"
              class="card bg-base-100 shadow-sm"
            >
              <div class="card-body p-3">
                <div class="flex justify-between items-center">
                  <!-- User info -->
                  <div class="flex items-center gap-3">
                    <BaseImage
                      :src="guess.user?.avatar"
                      :alt="guess.user?.name"
                      class="size-8 rounded-lg"
                    />
                    <div>
                      <div class="font-medium">{{ guess.user?.name }}</div>
                      <div v-if="guess.points !== null" class="text-xs text-base-content/60">
                        {{ guess.points }} pontos
                      </div>
                    </div>
                  </div>

                  <!-- Team guess -->
                  <div class="flex items-center gap-3">
                    <span class="font-medium">{{ guess.team?.name }}</span>
                    <BaseImage
                      :src="guess.team?.badge"
                      :alt="guess.team?.name"
                      class="size-8 rounded-lg"
                    />
                    <div
                      v-if="guess.points !== null && Number(guess.points) > 0"
                      class="badge badge-success gap-1"
                    >
                      <i class="fa-solid fa-star text-xs" />
                      {{ guess.points }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Runner-up guesses -->
          <div class="space-y-2">
            <h5 class="font-semibold text-base-content/80 flex items-center gap-2">
              <i class="fa-solid fa-medal text-gray-400" />
              Vice-campeão
            </h5>
            <div
              v-for="guess in runnerUpGuesses"
              :key="`runner-up-${guess.userId}`"
              class="card bg-base-100 shadow-sm"
            >
              <div class="card-body p-3">
                <div class="flex justify-between items-center">
                  <!-- User info -->
                  <div class="flex items-center gap-3">
                    <BaseImage
                      :src="guess.user?.avatar"
                      :alt="guess.user?.name"
                      class="size-8 rounded-lg"
                    />
                    <div>
                      <div class="font-medium">{{ guess.user?.name || 'Usuário' }}</div>
                      <div v-if="guess.points !== null" class="text-xs text-base-content/60">
                        {{ guess.points }} pontos
                      </div>
                    </div>
                  </div>

                  <!-- Team guess -->
                  <div class="flex items-center gap-3">
                    <span class="font-medium">{{ guess.team?.name }}</span>
                    <BaseImage
                      :src="guess.team?.badge"
                      :alt="guess.team?.name"
                      class="size-8 rounded-lg"
                    />
                    <div v-if="Number(guess.points) > 0" class="badge badge-success gap-1">
                      <i class="fa-solid fa-star text-xs" />
                      {{ guess.points }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-12">
          <div class="text-base-content/50 mb-4">
            <i class="fa-solid fa-trophy text-6xl" />
          </div>
          <p class="text-lg font-medium">Nenhum palpite encontrado</p>
          <p class="text-sm text-base-content/70">Ainda não há palpites para este campeonato</p>
        </div>
      </div>
    </div>
  </BaseModal>
</template>
