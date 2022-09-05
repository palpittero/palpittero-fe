<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toast />
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button
                :label="$t('admin.matches.newMatch')"
                icon="pi pi-plus"
                class="p-button-success mr-2"
                @click="handleNewMatch"
              />
              <!-- <Button
                :label="$t('common.removeSelected')"
                icon="pi pi-trash"
                class="p-button-danger"
                @click="handleDeleteMatches"
                :disabled="!selectedMatches || !selectedMatches?.length"
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

        <MatchesDataTable
          v-model="selectedMatches"
          :matches="matches"
          @edit="handleEditMatch"
          @delete="handleDeleteMatch"
          @set-result="handleSetResultMatch"
        />

        <MatchDetailsDialog
          v-if="isMatchDetailsDialogVisible"
          :match="match"
          :visible="isMatchDetailsDialogVisible"
          :submitted="submitted"
          @hide="handleDetailsDialogHide"
          @submit="handleDetailsDialogSubmit"
        />

        <MatchDeleteDialog
          v-if="isMatchDeleteDialogOpen"
          :visible="isMatchDeleteDialogOpen"
          :matches="match"
          @hide="handleDeleteDialogHide"
          @submit="handleDeleteDialogSubmit"
        />

        <MatchSetResultDialog
          v-if="isMatchSetResultDialogOpen"
          :visible="isMatchSetResultDialogOpen"
          :match="match"
          @hide="handleSetResultDialogHide"
          @submit="handleSetResultDialogSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import MatchesDataTable from './MatchesDataTable/MatchesDataTable.vue'
import MatchDetailsDialog from './MatchDetailsDialog/MatchDetailsDialog.vue'
import MatchDeleteDialog from './MatchDeleteDialog/MatchDeleteDialog.vue'
import MatchSetResultDialog from './MatchSetResultDialog/MatchSetResultDialog.vue'

import { MATCH_MODEL } from '@/constants/matches'
import services from '@/services'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { clone, pick } from 'lodash/fp'

const i18n = useI18n()
const toast = useToast()

const match = reactive({})
const matches = reactive({
  loading: false,
  error: null,
  data: []
})

const isMatchDetailsDialogVisible = ref(false)
const isMatchDeleteDialogOpen = ref(false)
const isMatchSetResultDialogOpen = ref(false)
const selectedMatches = ref([])

onMounted(() => loadMatches())

const loadMatches = async () => {
  try {
    matches.loading = true
    matches.data = await services.matches.fetchMatches()
  } catch (error) {
    matches.error = error.message
  } finally {
    matches.loading = false
  }
}

const handleNewMatch = () => {
  match.value = clone(MATCH_MODEL)
  isMatchDetailsDialogVisible.value = true
}

const saveMatch = async (match) => {
  if (match.id) {
    await services.matches.updateMatch(match)
  } else {
    await services.matches.createMatch(match)
  }

  toast.add({
    severity: 'success',
    summary: i18n.t('common.success'),
    detail: i18n.t('admin.matches.saveSuccess'),
    life: 4000
  })

  loadMatches()
}

const handleDetailsDialogHide = () => {
  isMatchDetailsDialogVisible.value = false
}

const handleEditMatch = (row) => {
  const MATCH_FIELDS = ['id', 'name']
  const CHAMPIONSHIP_FIELDS = ['id', 'name', 'year']

  match.value = {
    ...row,
    round: pick(MATCH_FIELDS, row.round),
    championship: pick(CHAMPIONSHIP_FIELDS, row.round.championship),
    date: new Date(row.date)
  }

  isMatchDetailsDialogVisible.value = true
}

const handleDeleteMatch = (row) => {
  match.value = [{ ...row }]
  isMatchDeleteDialogOpen.value = true
}

const handleDeleteMatches = () => {
  match.value = selectedMatches.value
  isMatchDeleteDialogOpen.value = true
}

const handleSetResultMatch = (row) => {
  match.value = { ...row }
  isMatchSetResultDialogOpen.value = true
}

const handleDetailsDialogSubmit = async (match) => {
  await saveMatch(match)
  handleDetailsDialogHide()
}

const handleDeleteDialogHide = () => (isMatchDeleteDialogOpen.value = false)

const handleDeleteDialogSubmit = (match) => console.log('should delete', match)

const handleSetResultDialogHide = () =>
  (isMatchSetResultDialogOpen.value = false)

const handleSetResultDialogSubmit = async (match) => {
  await saveMatch(match)
  handleSetResultDialogHide()
}
</script>

<style scoped lang="scss">
@import '@/assets/demo/badges.scss';
</style>
