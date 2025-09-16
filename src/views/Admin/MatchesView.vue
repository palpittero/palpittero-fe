<script setup lang="ts">
import MatchModalForm from '@/components/Admin/Matches/MatchModalForm.vue'
import MatchResultModalForm from '@/components/Admin/Matches/MatchResultModalForm.vue'
import MatchesDataTable from '@/components/Admin/Matches/MatchesDataTable.vue'

import services from '@/services'
import type { iMatch, iState } from '@/types'
import { onMounted, reactive, ref } from 'vue'

const matchId = ref<number>(0)

const handleAdd = () => {
  // @ts-ignore
  match_modal_form.showModal()
}

const handleEdit = async (row: iMatch) => {
  matchId.value = row.id!
  // @ts-ignore
  match_modal_form.showModal()
}

const handleUpdateResult = async (row: iMatch) => {
  matchId.value = row.id!
  // @ts-ignore
  match_result_modal_form.showModal()
}

const handleSuccess = () => {
  // @ts-ignore
  match_modal_form.close()
  // @ts-ignore
  match_result_modal_form.close()
  loadMatches()
}

const handleCancel = () => {
  matchId.value = 0
}

const matches = reactive<iState<iMatch[]>>({
  loading: false,
  error: null,
  data: [],
})

const loadMatches = async () => {
  try {
    matches.loading = true
    matches.data = await services.matches.fetchMatches()
  } catch (error: any) {
    matches.error = error.message
  } finally {
    matches.loading = false
  }
}

onMounted(loadMatches)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold flex gap-2 items-center">
        <i class="fa-solid fa-futbol" />
        Partidas
      </h1>

      <div class="flex gap-2 items-center">
        <button class="btn btn-primary" @click="handleAdd">
          <i class="fa-solid fa-plus" />
          Nova Partida
        </button>
      </div>
    </div>
    <MatchesDataTable :state="matches" @edit="handleEdit" @update-result="handleUpdateResult" />
  </div>
  <MatchModalForm :match-id="matchId" @success="handleSuccess" @cancel="handleCancel" />
  <MatchResultModalForm :match-id="matchId" @success="handleSuccess" @cancel="handleCancel" />
</template>
