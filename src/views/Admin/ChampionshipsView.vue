<script setup lang="ts">
import ChampionshipModalForm from '@/components/Admin/Championships/ChampionshipModalForm.vue'
import ChampionshipsDataTable from '@/components/Admin/Championships/ChampionshipsDataTable.vue'

import services from '@/services'
import type { iChampionship, iState } from '@/types'
import { onMounted, reactive, ref } from 'vue'

const championshipId = ref<number>(0)

const handleAdd = () => {
  // @ts-ignore
  championship_modal_form.showModal()
}

const handleEdit = async (row: iChampionship) => {
  championshipId.value = row.id!
  // @ts-ignore
  championship_modal_form.showModal()
}

const handleSuccess = () => {
  // @ts-ignore
  championship_modal_form.close()
  loadChampionships()
}

const handleCancel = () => {
  championshipId.value = 0
}

const championships = reactive<iState<iChampionship[]>>({
  loading: false,
  error: null,
  data: [],
})

const loadChampionships = async () => {
  try {
    championships.loading = true
    championships.data = await services.championships.fetchChampionships()
  } catch (error: any) {
    championships.error = error.message
  } finally {
    championships.loading = false
  }
}

onMounted(loadChampionships)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold flex gap-2 items-center">
        <i class="fa-solid fa-trophy" />
        Campeonatos
      </h1>

      <div class="flex gap-2 items-center">
        <button class="btn btn-primary" @click="handleAdd">
          <i class="fa-solid fa-plus" />
          Novo Campeonato
        </button>
      </div>
    </div>
    <ChampionshipsDataTable :state="championships" @edit="handleEdit" />
  </div>
  <ChampionshipModalForm
    :championship-id="championshipId"
    @success="handleSuccess"
    @cancel="handleCancel"
  />
</template>
