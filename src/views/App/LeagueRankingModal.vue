<script setup lang="ts">
import BaseModal from '@/components/Shared/BaseModal.vue'
</script>

<template>
  <BaseModal
    id="league_ranking_modal"
    :title="`Ranking: ${selectedLeague?.name}`"
    confirm-button-text="Confirmar"
    @open="handleOpen"
    @close="handleClose"
    @submit="handleConfirm"
  >
    <div v-if="rankingData.loading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="rankingData.data.length === 0" class="text-center py-8">
      <p class="text-base-content/70">Nenhuma pontuação registrada ainda</p>
    </div>

    <div v-else class="mt-4">
      <div class="overflow-x-auto">
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th>Pos.</th>
              <th>Usuário</th>
              <th>Pontos</th>
              <th>Acertos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in rankingData.data" :key="entry.userId">
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
