<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="flex gap-2 flex-column md:flex-row">
              <Button
                :label="$t('admin.matches.newMatch')"
                icon="pi pi-plus"
                class="p-button-success"
                @click="handleNewMatch"
              />
              <Button
                :label="$t('common.removeSelected')"
                icon="pi pi-trash"
                class="p-button-danger"
                @click="handleDeleteMatches"
                :disabled="!selectedMatches || !selectedMatches?.length"
              />
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
        <MatchesFilters
          v-model="filters"
          @update:model-value="handleFiltersUpdate"
        />

        <MatchesDataTable
          v-model="selectedMatches"
          :matches="{ ...matches, data: filteredMatches }"
          @edit="handleEditMatch"
          @delete="handleDeleteMatch"
          @set-result="handleSetResultMatch"
        />

        <MatchDetailsDialog
          v-if="isMatchDetailsDialogVisible"
          :match="match"
          :visible="isMatchDetailsDialogVisible"
          :submitted="submitted"
          :submitting="isSubmitting"
          @hide="handleDetailsDialogHide"
          @submit="handleDetailsDialogSubmit"
        />

        <MatchDeleteDialog
          v-if="isMatchDeleteDialogOpen"
          :matches="match"
          :visible="isMatchDeleteDialogOpen"
          :disabled="isSubmitting"
          @hide="handleDeleteDialogHide"
          @submit="handleDeleteDialogSubmit"
        />

        <MatchSetResultDialog
          v-if="isMatchSetResultDialogOpen"
          :match="match"
          :visible="isMatchSetResultDialogOpen"
          :disabled="isSubmitting"
          @hide="handleSetResultDialogHide"
          @submit="handleSetResultDialogSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import MatchesDataTable from './MatchesDataTable/MatchesDataTable.vue'
import MatchDetailsDialog from './MatchDetailsDialog/MatchDetailsDialog.vue'
import MatchDeleteDialog from './MatchDeleteDialog/MatchDeleteDialog.vue'
import MatchSetResultDialog from './MatchSetResultDialog/MatchSetResultDialog.vue'
import MatchesFilters from './MatchesFilters/MatchesFilters.vue'

import { MATCH_MODEL, MATCH_DETAIL_MODEL } from '@/constants/matches'
import services from '@/services'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { clone, pick, uniqueId } from 'lodash/fp'

const i18n = useI18n()
const toast = useToast()

let match = ref({})
const matches = ref({
  loading: false,
  error: null,
  data: []
})

const isMatchDetailsDialogVisible = ref(false)
const isMatchDeleteDialogOpen = ref(false)
const isMatchSetResultDialogOpen = ref(false)
const selectedMatches = ref([])
const isSubmitting = ref(false)
const filters = ref({
  championshipId: null
})

onMounted(() => loadMatches())

const loadMatches = async () => {
  try {
    matches.value.loading = true
    matches.value.data = await services.matches.fetchMatches()
  } catch (error) {
    matches.value.error = error.message
  } finally {
    matches.value.loading = false
  }
}

const filteredMatches = computed(() =>
  matches.value.data.filter((match) => {
    const championshipMatches =
      !filters.value.championshipId ||
      match.round.championship.id === filters.value.championshipId

    const groupMatches =
      !filters.value.groupId ||
      (match.round.championship.hasGroups &&
        match.group?.id === filters.value.groupId)

    const roundMatches =
      !filters.value.roundId || match.round?.id === filters.value.roundId

    return championshipMatches && groupMatches && roundMatches
  })
)

const handleNewMatch = () => {
  match.value = clone({
    ...MATCH_MODEL,
    details: [
      {
        ...MATCH_DETAIL_MODEL,
        uuid: uniqueId()
      }
    ]
  })
  isMatchDetailsDialogVisible.value = true
}

const saveMatch = async (match) => {
  isSubmitting.value = true
  if (match.id) {
    await services.matches.updateMatch(match)
  } else {
    await services.matches.createMatches(match)
  }

  toast.add({
    group: 'app',
    severity: 'success',
    summary: i18n.t('common.success'),
    detail: i18n.t('admin.matches.saveSuccess'),
    life: 4000
  })

  isSubmitting.value = false
  loadMatches()
}

const handleDetailsDialogHide = () => {
  isMatchDetailsDialogVisible.value = false
  isSubmitting.value = false
}

const handleEditMatch = (row) => {
  const MATCH_FIELDS = ['id', 'name', 'ignoreGroups']
  const CHAMPIONSHIP_FIELDS = ['id', 'name', 'year', 'hasGroups']

  match.value = {
    ...row,
    round: pick(MATCH_FIELDS, row.round),
    championship: pick(CHAMPIONSHIP_FIELDS, row.round.championship),
    championshipId: row.round.championship.id,
    date: new Date(row.date),
    resetStatus: MATCH_MODEL.resetStatus
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
  match.value = {
    ...row,
    regularTimeHomeTeamGoals: row.regularTimeHomeTeamGoals || 0,
    regularTimeAwayTeamGoals: row.regularTimeAwayTeamGoals || 0,
    penaltiesTimeHomeTeamGoals: row.penaltiesTimeHomeTeamGoals || 0,
    penaltiesTimeAwayTeamGoals: row.penaltiesTimeAwayTeamGoals || 0
  }
  isMatchSetResultDialogOpen.value = true
}

const handleDetailsDialogSubmit = async (match) => {
  await saveMatch(match)
  handleDetailsDialogHide()
}

const handleDeleteDialogHide = () => (isMatchDeleteDialogOpen.value = false)

const handleDeleteDialogSubmit = async (matches) => {
  try {
    isSubmitting.value = true
    const ids = matches.map(({ id }) => id)
    await services.matches.deleteMatches(ids)

    toast.add({
      group: 'app',
      severity: 'success',
      summary: i18n.t('common.success'),
      detail: i18n.t('admin.matches.deleteSuccess'),
      life: 4000
    })

    handleDeleteDialogHide()
    loadMatches()
  } catch (error) {
    toast.add({
      group: 'app',
      severity: 'error',
      summary: i18n.t('common.error'),
      detail: i18n.t('admin.matches.error.delete'),
      life: 4000
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleSetResultDialogHide = () =>
  (isMatchSetResultDialogOpen.value = false)

const handleSetResultDialogSubmit = async (match) => {
  await saveMatch(match)
  handleSetResultDialogHide()
}

const handleFiltersUpdate = (filters) => {
  console.log({ filters })
}
</script>

<style scoped lang="scss">
@import '@/assets/demo/badges.scss';
</style>
