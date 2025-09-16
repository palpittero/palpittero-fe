<script setup lang="ts">
import LeagueModalForm from '@/components/Admin/Leagues/LeagueModalForm.vue'
import LeaguesDataTable from '@/components/Admin/Leagues/LeaguesDataTable.vue'
import { parseLeagues } from '@/helpers/leagues'
import services from '@/services'
import type { iLeague, iState } from '@/types'
import { onMounted, reactive, ref } from 'vue'

const leagueId = ref<number>(0)

const handleAdd = () => {
  // @ts-ignore
  league_modal_form.showModal()
}

const handleEdit = async (row: iLeague) => {
  leagueId.value = row.id!
  // @ts-ignore
  league_modal_form.showModal()
}

const handleSuccess = () => {
  // @ts-ignore
  league_modal_form.close()
  loadLeagues()
}

const handleCancel = () => {
  leagueId.value = 0
}

const leagues = reactive<iState<iLeague[]>>({
  loading: false,
  error: null,
  data: [],
})

const loadLeagues = async () => {
  try {
    leagues.loading = true
    leagues.data = parseLeagues(await services.leagues.fetchLeagues())
  } catch (error: any) {
    leagues.error = error.message
  } finally {
    leagues.loading = false
  }
}

onMounted(loadLeagues)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold flex gap-2 items-center">
        <i class="fa-solid fa-flag" />
        Ligas
      </h1>

      <div class="flex gap-2 items-center">
        <button class="btn btn-primary" @click="handleAdd">
          <i class="fa-solid fa-plus" />
          Nova liga
        </button>
      </div>
    </div>
    <LeaguesDataTable :state="leagues" @edit="handleEdit" />
  </div>
  <LeagueModalForm :league-id="leagueId" @success="handleSuccess" @cancel="handleCancel" />
</template>
