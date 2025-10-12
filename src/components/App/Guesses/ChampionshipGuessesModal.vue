<script setup lang="ts">
import { computed, reactive } from 'vue'
import services from '@/services'
import type { iChampionship, iState, iUserChampionshipGuess } from '@/types'
import BaseImage from '@/components/Shared/BaseImage.vue'
import BaseModal from '@/components/Shared/BaseModal.vue'
import FormattedDate from '@/components/Shared/FormattedDate.vue'
import { parseChampionshipsGuesses } from '@/helpers/guesses'
import MatchGuessPointsBadge from '../Championships/MatchGuessPointsBadge.vue'

const props = defineProps<{
  championship: iChampionship | null
  leagueId: number
}>()

const championshipGuesses = reactive<iState<iUserChampionshipGuess>>({
  loading: false,
  error: null,
  data: {} as iUserChampionshipGuess,
})

const championshipName = computed<string>(() => {
  const name = championshipGuesses.data?.name ?? ''
  const year = championshipGuesses.data?.year ?? ''

  return `${name} ${year}`
})

const positionLabels: Record<string, { label: string; icon: string }> = {
  1: {
    label: 'Campeão',
    icon: '🥇',
  },
  2: {
    label: 'Vice-campeão',
    icon: '🥈',
  },
}

const hasChampionshipGuesses = computed<boolean>(() => championshipGuesses.data.users?.length > 0)

const loadChampionshipGuesses = async () => {
  if (!props.championship?.id || !props.leagueId) {
    championshipGuesses.data = {} as iUserChampionshipGuess
    return
  }

  try {
    championshipGuesses.loading = true
    championshipGuesses.error = null

    const data = await services.championshipsGuesses.fetchChampionshipsGuesses({
      championshipId: props.championship?.id,
      leagueId: props.leagueId,
    })

    const parsedData = parseChampionshipsGuesses(data)

    championshipGuesses.data = parsedData.find(({ id }) => id === props.championship?.id)!
  } catch (error) {
    console.error('Error loading championship guesses:', error)
    championshipGuesses.error = 'Erro ao carregar palpites do campeonato'
    championshipGuesses.data = {} as iUserChampionshipGuess
  } finally {
    championshipGuesses.loading = false
  }
}
</script>

<template>
  <BaseModal
    id="championship_guesses_modal"
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

      <div v-else class="space-y-4">
        <div class="card bg-base-200/50 shadow-sm">
          <div class="card-body p-4 text-center">
            <h4 class="font-bold text-xl">{{ championshipName }}</h4>

            <div class="flex justify-center items-center gap-2">
              <div
                class="text-xs uppercase font-semibold opacity-80 flex items-center gap-2"
                v-for="position in championship?.positions"
                :key="position.id"
              >
                <!-- {{ position.position }} -->
                <BaseImage
                  :src="position.team?.badge"
                  :alt="position.team?.name"
                  class="size-4 rounded-md"
                />
                <!-- {{ position.team?.name }} -->
                {{ positionLabels[position.position].label }}
              </div>
            </div>

            <div class="text-xs text-base-content/60">
              Atualizado em <FormattedDate :date="new Date().toISOString()" />
            </div>
          </div>
        </div>
        <div v-if="hasChampionshipGuesses" class="space-y-3">
          <div
            class="space-y-2"
            v-for="user in championshipGuesses.data.users"
            :key="`championship-${user.id}`"
          >
            <div class="card bg-base-100 shadow-sm">
              <ul class="list bg-base-100 rounded-box shadow-md">
                <li class="p-4 pb-2 text-xs opacity-60 tracking-wide flex items-center gap-2">
                  <BaseImage :src="user.avatar" :alt="user.name" class="size-6 rounded-md" />
                  {{ user.name }}
                </li>
                <li
                  class="list-row items-center flex"
                  v-for="guess in user.guesses"
                  :key="guess.id"
                >
                  <div class="text-xl font-thin opacity-30 tabular-nums">
                    {{ guess.position }}
                  </div>
                  <div>
                    <BaseImage
                      :src="guess.team?.badge"
                      :alt="guess.team?.name"
                      class="size-6 rounded-box"
                    />
                  </div>
                  <div class="list-col-grow">
                    <div>{{ guess.team?.name }}</div>
                    <div class="text-xs uppercase font-semibold opacity-60">
                      {{ positionLabels[guess.position].label }}
                    </div>
                  </div>
                  <MatchGuessPointsBadge :guess="guess" />
                </li>
              </ul>
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
