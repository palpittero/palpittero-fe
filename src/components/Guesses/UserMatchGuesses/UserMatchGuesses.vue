<template>
  <div class="user-match-guesses">
    <BaseDataRenderer :state="{ loading }">
      <MatchCard :match="match" />
      <UsersGuessesMatchDataTable :match="match" :guesses="guesses" />
    </BaseDataRenderer>
  </div>
</template>

<script setup>
import services from '@/services'
import { onMounted, ref } from 'vue'
import BaseDataRenderer from '@/components/Shared/BaseDataRenderer/BaseDataRenderer.vue'
import MatchCard from '@/components/Shared/Matches/MatchCard/MatchCard.vue'
import UsersGuessesMatchDataTable from '@/components/Shared/Guesses/UsersGuessesMatchDataTable/UsersGuessesMatchDataTable.vue'

const props = defineProps({
  leagueId: {
    type: Number,
    required: true
  },
  matchId: {
    type: Number,
    required: true
  }
})

const emits = defineEmits(['ready'])

const match = ref([])
const league = ref(null)
const guesses = ref([])
const loading = ref(true)

onMounted(async () => {
  loading.value = true
  match.value = await services.matches.fetchMatchById(props.matchId)
  league.value = await services.leagues.fetchLeagueById(props.leagueId)
  guesses.value = await services.guesses.fetchGuesses({
    leagueId: props.leagueId,
    matchId: props.matchId,
    roundId: match.value.round.id
  })
  loading.value = false
  emits('ready', { league: league.value, match: match.value })
})
</script>
