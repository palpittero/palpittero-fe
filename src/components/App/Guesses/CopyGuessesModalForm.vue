<script setup lang="ts">
import BaseModal from '@/components/Shared/BaseModal.vue'
import LeagueSelect from '@/components/Shared/Leagues/LeagueSelect.vue'
import ChampionshipsMultiSelect from '@/components/Shared/Teams/ChampionshipsMultiSelect.vue'
import services from '@/services'
import type { iChampionship, iCopyGuesses, iLeague, iState, iUser } from '@/types'
import { computed, reactive, ref } from 'vue'

const props = defineProps<{
  league?: iLeague
  championships?: iChampionship[]
  loggedUser?: iUser | null
}>()

const emit = defineEmits<{
  submit: [data: any]
}>()

const model = ref<iCopyGuesses>({
  sourceLeagueId: null,
  targetLeagueId: null,
  championships: [],
  copyMatchesGuesses: false,
  copyChampionshipsGuesses: false,
})

const filterLeagues = (leagues: iLeague[]): iLeague[] =>
  leagues.filter(
    (league) =>
      league.id !== props.league?.id &&
      league.users.some((user) => user.id === props.loggedUser?.id && user.status === 'approved'),
  )

const targetLeagueChampionships = reactive<iState<iChampionship[]>>({
  loading: false,
  error: null,
  data: [],
})

const loadTargetLeagueChampionships = async (targetLeagueId: any) => {
  if (!targetLeagueId) {
    targetLeagueChampionships.data = []
    return
  }

  targetLeagueChampionships.loading = true
  targetLeagueChampionships.data = await services.leagues.fetchChampionships(targetLeagueId)
  targetLeagueChampionships.loading = false
}

const intersectionChampionships = computed<iChampionship[]>(
  () =>
    props.championships?.filter((championship) =>
      targetLeagueChampionships.data.some(
        (targetChampionship) => targetChampionship.id === championship.id,
      ),
    ) ?? [],
)

const handleOpen = async () => {
  model.value.sourceLeagueId = props.league?.id
}

const handleSubmit = () => {
  emit('submit', model.value)
}

const isCopyGuessesValid = computed<number | null>(() =>
  model.value.copyMatchesGuesses || model.value.copyChampionshipsGuesses ? 1 : null,
)
</script>

<template>
  <BaseModal
    id="copy_guesses_modal"
    title="Copiar Palpites"
    @open="handleOpen"
    size="md"
    confirm-button-text="Copiar Papites"
    @submit="handleSubmit"
  >
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Liga de Origem</legend>
      <input type="text" :value="league?.name" class="input" disabled />
    </fieldset>
    <fieldset class="fieldset">
      <LeagueSelect
        v-model="model.targetLeagueId"
        label="Liga de Destino"
        :filter="filterLeagues"
        @update:model-value="loadTargetLeagueChampionships"
        required
      />
    </fieldset>

    <!-- @vue-ignore -->
    <ChampionshipsMultiSelect
      v-if="model.targetLeagueId"
      v-model="model.championships"
      :championships="intersectionChampionships"
      label="Campeonatos"
      required
    />

    <fieldset class="fieldset w-auto inline">
      <legend class="fieldset-legend">Copiar</legend>

      <div class="flex flex-col lg:flex-row lg:items-center gap-4">
        <div class="flex items-center gap-2">
          <div class="flex flex-col">
            <label class="label">
              <input
                v-model="model.copyMatchesGuesses"
                type="checkbox"
                class="toggle toggle-primary"
                required
              />
              Palpites de Partidas
            </label>
          </div>
          <span
            class="tooltip"
            data-tip="Ao selecionar esta opção os palpites não processados de partidas da liga de origem serão copiados para a liga de destino"
          >
            <i class="fa-solid fa-info-circle text-primary cursor-pointer" />
          </span>
        </div>

        <div class="flex items-center gap-2">
          <label class="label">
            <input
              v-model="model.copyChampionshipsGuesses"
              type="checkbox"
              class="toggle toggle-primary"
            />
            Palpites de Ranking de Campeonatos
          </label>
          <span
            class="tooltip"
            data-tip="Ao selecionar esta opção os palpites não processados de ranking de campeonatos da liga de origem serão copiados para a liga de destino"
          >
            <i class="fa-solid fa-info-circle text-primary cursor-pointer" />
          </span>
        </div>
      </div>

      <div>
        <input type="text" class="input validator hidden" :value="isCopyGuessesValid" required />
        <span class="validator-hint">Selecione pelo menos uma opção</span>
      </div>
    </fieldset>
  </BaseModal>
</template>
