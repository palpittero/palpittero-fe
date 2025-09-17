<script setup lang="ts">
import BaseModal from '@/components/Shared/BaseModal.vue'
import services from '@/services'
import type { iLeague, iState } from '@/types'
import { reactive } from 'vue'

const props = defineProps<{
  league: iLeague | null
}>()

const leagueRanking = reactive<iState<any>>({
  loading: false,
  data: [],
  error: null,
})

const loadingLeagueRanking = async () => {
  if (!props.league) return

  try {
    leagueRanking.loading = true
    const ranking = await services.leagues.fetchUsers({
      league: props.league,
      status: 'approved',
    })

    leagueRanking.data = ranking.map((user: any) => ({
      userId: user.id,
      userName: user.name,
      points: user.points || 0,
      correctGuesses: user.guessesPoints || 0,
    }))
  } catch (error) {
    console.error('Error loading ranking:', error)
    leagueRanking.error = 'Erro ao carregar ranking'
    leagueRanking.data = []
  } finally {
    leagueRanking.loading = false
  }
}

const handleOpen = () => {
  loadingLeagueRanking()
}

const handleClose = () => {
  // @ts-ignore
  league_ranking_modal.close()
}
</script>

<template>
  <BaseModal
    id="league_ranking_modal"
    :title="`Ranking: ${league?.name}`"
    cancel-button-text="Fechar"
    @open="handleOpen"
    @close="handleClose"
    hide-confirm-button
  >
    <div v-if="leagueRanking.loading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="leagueRanking.data.length === 0" class="text-center py-8">
      <p class="text-base-content/70">Nenhuma pontuação registrada ainda</p>
    </div>

    <div v-else class="mt-4">
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Pos.</th>
              <th>Usuário</th>
              <th>Pontos</th>
              <th>Acertos</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(entry, index) in leagueRanking.data"
              :key="entry.userId"
              class="hover:bg-base-200"
            >
              <td>
                <div class="flex items-center gap-2">
                  <span>{{ index + 1 }}º</span>
                  <span v-if="index === 0">🥇</span>
                  <span v-else-if="index === 1">🥈</span>
                  <span v-else-if="index === 2">🥉</span>
                </div>
              </td>
              <td class="font-medium">{{ entry.userName }}</td>
              <td>
                <span class="badge badge-primary">{{ entry.points }} pts</span>
              </td>
              <td>{{ entry.correctGuesses }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </BaseModal>
</template>
