<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="flex gap-2 flex-column md:flex-row">
              <Button
                :label="$t('admin.championships.newChampionship')"
                icon="pi pi-plus"
                class="p-button-success"
                @click="handleNewChampionship"
              />
              <Button
                :label="$t('common.removeSelected')"
                icon="pi pi-trash"
                class="p-button-danger"
                @click="handleDeleteChampionships"
                :disabled="
                  !selectedChampionships || !selectedChampionships?.length
                "
              />
            </div>
          </template>
        </Toolbar>

        <ChampionshipsDataTable
          v-model="selectedChampionships"
          :championships="championships"
          @edit="handleEditChampionship"
          @delete="handleDeleteChampionship"
          @ranking="handleSetRankingChampionship"
        />

        <ChampionshipDetailsDialog
          v-if="isChampionshipDetailsDialogVisible"
          :championship="championship"
          :visible="isChampionshipDetailsDialogVisible"
          :submitting="isSubmitting"
          @hide="handleDetailsDialogHide"
          @submit="handleDetailsDialogSubmit"
        />

        <ChampionshipDeleteDialog
          :championships="championship"
          :visible="isChampionshipDeleteDialogOpen"
          :disabled="isSubmitting"
          @hide="handleDeleteDialogHide"
          @submit="handleDeleteDialogSubmit"
        />

        <ChampionshipSetRankingDialog
          v-if="isChampionshipSetRankingDialogOpen"
          :championship="championship"
          :visible="isChampionshipSetRankingDialogOpen"
          :disabled="isSubmitting"
          @hide="handleSetRankingDialogHide"
          @submit="handleSetRankingDialogSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ChampionshipsDataTable from './ChampionshipsDataTable/ChampionshipsDataTable.vue'
import ChampionshipDetailsDialog from './ChampionshipDetailsDialog/ChampionshipDetailsDialog.vue'
import ChampionshipDeleteDialog from './ChampionshipDeleteDialog/ChampionshipDeleteDialog.vue'
import ChampionshipSetRankingDialog from './ChampionshipSetRankingDialog/ChampionshipSetRankingDialog.vue'

import { CHAMPIONSHIP_MODEL } from '@/constants/championships'
import services from '@/services'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { clone } from 'lodash'
import {
  getChampionshipPositionsInitialValues,
  parseChampionshipInput,
  parseChampionshipPositions
} from '@/helpers/championships'

const i18n = useI18n()
const toast = useToast()

const championship = ref({})
const championships = ref({
  loading: false,
  error: null,
  data: []
})

const isChampionshipDetailsDialogVisible = ref(false)
const isChampionshipDeleteDialogOpen = ref(false)
const isChampionshipSetRankingDialogOpen = ref(false)
const selectedChampionships = ref([])
const isSubmitting = ref(false)

onMounted(() => loadChampionships())

const loadChampionships = async () => {
  try {
    championships.value.loading = true
    championships.value.data = await services.championships.fetchChampionships()
  } catch (error) {
    championships.value.error = error.message
  } finally {
    championships.value.loading = false
  }
}

const handleNewChampionship = () => {
  championship.value = clone(CHAMPIONSHIP_MODEL)
  isChampionshipDetailsDialogVisible.value = true
}

const saveChampionship = async (championship) => {
  isSubmitting.value = true
  const parsedChampionship = parseChampionshipInput(championship)

  if (championship.id) {
    await services.championships.updateChampionship(parsedChampionship)
  } else {
    await services.championships.createChampionship(parsedChampionship)
  }

  toast.add({
    group: 'app',
    severity: 'success',
    summary: i18n.t('common.success'),
    detail: i18n.t('admin.championships.saveSuccess'),
    life: 4000
  })

  isSubmitting.value = false
}

const handleDetailsDialogSubmit = async (championship) => {
  await saveChampionship(championship)
  handleDetailsDialogHide()
  loadChampionships()
}

const handleDetailsDialogHide = () => {
  isChampionshipDetailsDialogVisible.value = false
}

const handleEditChampionship = (row) => {
  championship.value = { ...row }
  isChampionshipDetailsDialogVisible.value = true
}

const handleDeleteChampionship = (row) => {
  championship.value = [{ ...row }]
  isChampionshipDeleteDialogOpen.value = true
}

const handleDeleteChampionships = () => {
  championship.value = selectedChampionships.value
  isChampionshipDeleteDialogOpen.value = true
}

const handleDeleteDialogHide = () =>
  (isChampionshipDeleteDialogOpen.value = false)

const handleDeleteDialogSubmit = async (championships) => {
  try {
    isSubmitting.value = true
    const ids = championships.map(({ id }) => id)
    await services.championships.deleteChampionships(ids)

    toast.add({
      group: 'app',
      severity: 'success',
      summary: i18n.t('common.success'),
      detail: i18n.t('admin.championships.deleteSuccess'),
      life: 4000
    })

    handleDeleteDialogHide()
    loadChampionships()
  } catch (error) {
    toast.add({
      group: 'app',
      severity: 'error',
      summary: i18n.t('common.error'),
      detail: i18n.t('admin.championships.error.delete'),
      life: 4000
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleSetRankingChampionship = (row) => {
  championship.value = {
    ...row,
    positions: {
      ...getChampionshipPositionsInitialValues(championship.value.id),
      ...parseChampionshipPositions(row.positions)
    }
  }

  isChampionshipSetRankingDialogOpen.value = true
}

const handleSetRankingDialogHide = () =>
  (isChampionshipSetRankingDialogOpen.value = false)

const handleSetRankingDialogSubmit = async (championship) => {
  await saveChampionship(championship)
  handleSetRankingDialogHide()
  loadChampionships()
}
</script>

<style scoped lang="scss">
@import '@/assets/demo/badges.scss';
</style>
