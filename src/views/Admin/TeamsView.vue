<script setup lang="ts">
import TeamModalForm from '@/components/Admin/Teams/TeamModalForm.vue'
import TeamsDataTable from '@/components/Admin/Teams/TeamsDataTable.vue'

import services from '@/services'
import type { iTeam, iState } from '@/types'
import { onMounted, reactive, ref } from 'vue'

const teamId = ref<number>(0)

const handleAdd = () => {
  // @ts-ignore
  team_modal_form.showModal()
}

const handleEdit = async (row: iTeam) => {
  teamId.value = row.id!
  // @ts-ignore
  team_modal_form.showModal()
}

const handleSuccess = () => {
  // @ts-ignore
  team_modal_form.close()
  loadLeagues()
}

const handleCancel = () => {
  teamId.value = 0
}

const teams = reactive<iState<iTeam[]>>({
  loading: false,
  error: null,
  data: [],
})

const loadLeagues = async () => {
  try {
    teams.loading = true
    teams.data = await services.teams.fetchTeams()
  } catch (error: any) {
    teams.error = error.message
  } finally {
    teams.loading = false
  }
}

onMounted(loadLeagues)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold flex gap-2 items-center">
        <i class="fa-solid fa-shield-halved" />
        Times
      </h1>

      <div class="flex gap-2 items-center">
        <button class="btn btn-primary" @click="handleAdd">
          <i class="fa-solid fa-plus" />
          Novo Time
        </button>
      </div>
    </div>
    <TeamsDataTable :state="teams" @edit="handleEdit" />
  </div>
  <TeamModalForm :team-id="teamId" @success="handleSuccess" @cancel="handleCancel" />
</template>
