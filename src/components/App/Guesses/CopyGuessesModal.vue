<template>
  <div v-if="visible" class="modal modal-open">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-4">
        Copiar Palpites para {{ league.name }}
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Source league (read-only) -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Liga de origem</span>
          </label>
          <input
            type="text"
            :value="league.name"
            class="input input-bordered"
            readonly
            disabled
          />
        </div>

        <!-- Target league selection -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Liga de destino</span>
          </label>
          <select
            v-model="copyGuesses.targetLeagueId"
            class="select select-bordered w-full"
            required
          >
            <option value="">Selecione uma liga</option>
            <option
              v-for="targetLeague in availableLeagues"
              :key="targetLeague.id"
              :value="targetLeague.id"
            >
              {{ targetLeague.name }}
            </option>
          </select>
        </div>

        <!-- Championships selection -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Campeonatos</span>
          </label>
          <div class="space-y-2 max-h-48 overflow-y-auto border border-base-300 rounded-lg p-3">
            <label
              v-for="championship in championships"
              :key="championship.id"
              class="label cursor-pointer justify-start gap-3"
            >
              <input
                type="checkbox"
                :value="championship.id"
                v-model="copyGuesses.championshipsIds"
                class="checkbox checkbox-primary"
              />
              <span class="label-text">{{ championship.name }}</span>
            </label>
          </div>
          <div class="label">
            <span class="label-text-alt text-base-content/60">
              Selecione os campeonatos cujos palpites deseja copiar
            </span>
          </div>
        </div>

        <!-- Copy options -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Opções de cópia</span>
          </label>
          <div class="space-y-2">
            <label class="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                v-model="copyGuesses.copyMatchesGuesses"
                class="checkbox checkbox-primary"
              />
              <div>
                <div class="label-text">Copiar palpites de jogos</div>
                <div class="label-text-alt text-base-content/60">
                  Palpites de resultados dos jogos
                </div>
              </div>
            </label>

            <label class="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                v-model="copyGuesses.copyChampionshipsGuesses"
                class="checkbox checkbox-primary"
              />
              <div>
                <div class="label-text">Copiar palpites de campeonatos</div>
                <div class="label-text-alt text-base-content/60">
                  Palpites de campeão e vice-campeão
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Summary -->
        <div v-if="copyGuesses.targetLeagueId && copyGuesses.championshipsIds.length > 0" class="alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="stroke-current shrink-0 w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div class="text-sm">
            <div class="font-medium">Resumo da cópia:</div>
            <ul class="list-disc list-inside mt-1 space-y-1">
              <li>{{ copyGuesses.championshipsIds.length }} campeonato(s) selecionado(s)</li>
              <li v-if="copyGuesses.copyMatchesGuesses">Palpites de jogos serão copiados</li>
              <li v-if="copyGuesses.copyChampionshipsGuesses">Palpites de campeonatos serão copiados</li>
              <li v-if="!copyGuesses.copyMatchesGuesses && !copyGuesses.copyChampionshipsGuesses" class="text-warning">
                Nenhuma opção de cópia selecionada
              </li>
            </ul>
          </div>
        </div>
      </form>

      <div class="modal-action">
        <button type="button" class="btn btn-ghost" @click="handleHide">
          Cancelar
        </button>
        <button
          type="button"
          class="btn btn-primary gap-2"
          :disabled="isSubmitDisabled"
          @click="handleSubmit"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copiar Palpites
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import services from '@/services'

interface League {
  id: number
  name: string
}

interface Championship {
  id: number
  name: string
}

interface CopyGuessesData {
  sourceLeagueId: number
  targetLeagueId: number | null
  championshipsIds: number[]
  copyMatchesGuesses: boolean
  copyChampionshipsGuesses: boolean
}

const props = defineProps<{
  visible: boolean
  league: League
  championships: Championship[]
}>()

const emits = defineEmits<{
  submit: [data: CopyGuessesData]
  hide: []
}>()

const availableLeagues = reactive<{ loading: boolean; data: League[] }>({
  loading: false,
  data: []
})

const copyGuesses = ref<CopyGuessesData>({
  sourceLeagueId: props.league.id,
  targetLeagueId: null,
  championshipsIds: [],
  copyMatchesGuesses: false,
  copyChampionshipsGuesses: false
})

const isSubmitDisabled = computed(() => {
  return (
    !copyGuesses.value.targetLeagueId ||
    copyGuesses.value.championshipsIds.length === 0 ||
    (!copyGuesses.value.copyMatchesGuesses && !copyGuesses.value.copyChampionshipsGuesses)
  )
})

const loadAvailableLeagues = async () => {
  try {
    availableLeagues.loading = true
    const leagues = await services.leagues.fetchLeagues()

    // Filter out the current league
    availableLeagues.data = leagues.filter((league: League) => league.id !== props.league.id)
  } catch (error) {
    console.error('Error loading available leagues:', error)
  } finally {
    availableLeagues.loading = false
  }
}

const handleSubmit = () => {
  if (!isSubmitDisabled.value) {
    emits('submit', copyGuesses.value)
  }
}

const handleHide = () => {
  // Reset form
  copyGuesses.value = {
    sourceLeagueId: props.league.id,
    targetLeagueId: null,
    championshipsIds: [],
    copyMatchesGuesses: false,
    copyChampionshipsGuesses: false
  }

  emits('hide')
}

onMounted(() => {
  if (props.visible) {
    loadAvailableLeagues()
  }
})

// Load leagues when modal becomes visible
watch(() => props.visible, (visible) => {
  if (visible) {
    loadAvailableLeagues()
  }
})
</script>