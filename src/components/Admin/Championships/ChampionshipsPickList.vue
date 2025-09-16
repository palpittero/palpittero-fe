<script setup lang="ts">
import services from '@/services'
import { type iState, type iChampionship } from '@/types'
import { onMounted, reactive, ref } from 'vue'

const props = defineProps<{
  leagueId?: number | null
  enableGuesses?: boolean
}>()

const selectedChampionships = defineModel<iChampionship[]>()

const state = reactive<iState<iChampionship[]>>({
  loading: false,
  error: null,
  data: [],
})

const loadChampionships = async () => {
  try {
    state.loading = true
    state.data = props.leagueId
      ? await services.leagues.fetchChampionships(props.leagueId)
      : await services.championships.fetchChampionships()
  } catch (error: any) {
    state.error = error.message
  } finally {
    state.loading = false
  }
}

onMounted(loadChampionships)

const handleToggleAll = () => {
  if (selectedChampionships.value?.length !== state.data.length) {
    selectedChampionships.value = state.data
  } else {
    selectedChampionships.value = []
  }
}

const handleSelectChampionship = (event: Event, championship: iChampionship) => {
  if (event.target.checked) {
    selectedChampionships.value.push(championship)
  } else {
    selectedChampionships.value = selectedChampionships.value.filter(
      (c) => c.id !== championship.id,
    )
  }
}
</script>

<template>
  <label class="label flex items-center justify-between">
    Selecionar campeonatos
    <a class="link link-hover" @click="handleToggleAll">Toggle all</a>
  </label>
  <fieldset class="fieldset bg-base-200 border-base-300 rounded-box border p-4 mb-6">
    <!-- <legend class="fieldset-legend">Selecionar campeonatos</legend> -->

    <div class="flex flex-col gap-4 max-h-56 overflow-y-auto">
      <label class="label" v-for="championship in state.data" :key="championship.id">
        <input
          type="checkbox"
          class="checkbox checkbox-md"
          :checked="selectedChampionships?.some((c) => c.id === championship.id)"
          @change="handleSelectChampionship($event, championship)"
        />
        {{ championship.name }}
      </label>
    </div>
  </fieldset>
</template>
