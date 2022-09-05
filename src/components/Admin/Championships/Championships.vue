<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toast />
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button
                :label="$t('admin.championships.newChampionship')"
                icon="pi pi-plus"
                class="p-button-success mr-2"
                @click="handleNewChampionship"
              />
              <!-- <Button
                :label="$t('common.removeSelected')"
                icon="pi pi-trash"
                class="p-button-danger"
                @click="handleDeleteChampionships"
                :disabled="
                  !selectedChampionships || !selectedChampionships?.length
                "
              /> -->
            </div>
          </template>

          <!-- <template v-slot:end>
            <FileUpload
              mode="basic"
              accept="image/*"
              :maxFileSize="1000000"
              label="Import"
              chooseLabel="Import"
              class="mr-2 inline-block"
            />
            <Button
              label="Export"
              icon="pi pi-upload"
              class="p-button-help"
              @click="exportCSV($event)"
            />
          </template> -->
        </Toolbar>

        <ChampionshipsDataTable
          v-model="selectedChampionships"
          :championships="championships"
          @edit="handleEditChampionship"
          @delete="handleDeleteChampionship"
        />

        <ChampionshipDetailsDialog
          v-model="championship"
          :visible="isChampionshipDetailsDialogVisible"
          @hide="handleDetailsDialogHide"
          @submit="handleDetailsDialogSubmit"
        />

        <ChampionshipDeleteDialog
          :visible="isChampionshipDeleteDialogOpen"
          :championships="championship"
          @hide="handleDeleteDialogHide"
          @submit="handleDeleteDialogSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import ChampionshipsDataTable from './ChampionshipsDataTable/ChampionshipsDataTable.vue'
import ChampionshipDetailsDialog from './ChampionshipDetailsDialog/ChampionshipDetailsDialog.vue'
import ChampionshipDeleteDialog from './ChampionshipDeleteDialog/ChampionshipDeleteDialog.vue'

import { CHAMPIONSHIP_MODEL } from '@/constants/championships'
import services from '@/services'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { clone } from 'lodash'

const i18n = useI18n()
const toast = useToast()

const championship = reactive({})
const championships = reactive({
  loading: false,
  error: null,
  data: []
})

const isChampionshipDetailsDialogVisible = ref(false)
const isChampionshipDeleteDialogOpen = ref(false)
const selectedChampionships = ref([])

onMounted(() => loadChampionships())

const loadChampionships = async () => {
  try {
    championships.loading = true
    championships.data = await services.championships.fetchChampionships()
  } catch (error) {
    championships.error = error.message
  } finally {
    championships.loading = false
  }
}

const handleNewChampionship = () => {
  championship.value = clone(CHAMPIONSHIP_MODEL)
  isChampionshipDetailsDialogVisible.value = true
}

const handleDetailsDialogSubmit = async (championship) => {
  if (championship.id) {
    await services.championships.updateChampionship(championship)
  } else {
    await services.championships.createChampionship(championship)
  }

  toast.add({
    severity: 'success',
    summary: i18n.t('common.success'),
    detail: i18n.t('admin.championships.saveSuccess'),
    life: 4000
  })

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

const handleDeleteDialogSubmit = async ([championship]) => {
  try {
    await services.championships.deleteChampionship(championship)

    toast.add({
      severity: 'success',
      summary: i18n.t('common.success'),
      detail: i18n.t('admin.championships.deleteSuccess'),
      life: 4000
    })

    isChampionshipDeleteDialogOpen.value = false
    loadChampionships()
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: i18n.t('common.error'),
      detail: i18n.t('admin.championships.error.delete'),
      life: 3000,
      group: 'app'
    })
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/demo/badges.scss';
</style>
