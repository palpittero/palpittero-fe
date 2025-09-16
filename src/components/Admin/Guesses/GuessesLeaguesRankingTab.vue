<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import ChampionshipRankingGuessesList from '../Championships/ChampionshipRankingGuessesList.vue'

const props = defineProps<{
  championships: any[]
}>()

const emit = defineEmits<{
  'process-guesses': [championship: any]
}>()

const handleProcessGuesses = (championship: any) => {
  emit('process-guesses', championship)
}

const collapseMap = reactive<Record<string, boolean>>({})

onMounted(() => {
  props.championships.forEach((championship) => {
    collapseMap[championship.id] = true
  })
})
</script>

<template>
  <label class="tab flex items-center gap-2">
    <input type="radio" name="guesses_leagues_tabs" />
    <i class="fa-solid fa-ranking-star" />
    Colocações
  </label>
  <div class="tab-content bg-base-100 border-base-300 p-6">
    <div v-if="championships.length === 0" class="alert alert-soft">
      <span> <i class="fa-solid fa-check" /> Todos os palpites já foram processados </span>
    </div>
    <div
      v-for="championship in championships"
      :key="championship.id"
      class="collapse-arrow border-base-300 collapse border overflow-x-auto col-span-12 lg:col-span-12"
    >
      <input v-model="collapseMap[championship.id]" type="checkbox" class="peer" />
      <div class="collapse-title font-semibold flex items-center">
        {{ championship.name }} {{ championship.year }}
      </div>
      <div class="collapse-content">
        <div class="text-right">
          <button
            class="btn btn-outline btn-primary btn-xs self-end"
            @click.stop="handleProcessGuesses"
          >
            <i class="fa-solid fa-bolt" />
            Processar Palpites
          </button>
        </div>
        <ul class="list flex flex-col" v-for="championship in championships" :key="championship.id">
          <ChampionshipRankingGuessesList
            v-for="user in championship.users"
            :key="user.id"
            :user="user"
          />
        </ul>
      </div>
    </div>
  </div>
</template>
