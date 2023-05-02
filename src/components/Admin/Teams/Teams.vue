<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="flex gap-2 flex-column md:flex-row">
              <Button
                :label="$t('admin.teams.newTeam')"
                icon="pi pi-plus"
                class="p-button-success"
                @click="handleNewTeam"
              />
              <Button
                :label="$t('common.removeSelected')"
                icon="pi pi-trash"
                class="p-button-danger"
                @click="handleDeleteTeams"
                :disabled="!selectedTeams || !selectedTeams?.length"
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

        <TeamsDataTable
          v-model="selectedTeams"
          :teams="teams"
          @edit="handleEditTeam"
          @delete="handleDeleteTeam"
        />

        <TeamDetailsDialog
          v-model="team"
          :visible="isTeamDetailsDialogVisible"
          :submitting="isSubmitting"
          :serverErrors="serverErrors"
          @hide="handleDetailsDialogHide"
          @submit="handleDetailsDialogSubmit"
        />

        <TeamDeleteDialog
          :visible="isTeamDeleteDialogOpen"
          :teams="team"
          :disabled="isSubmitting"
          @hide="handleDeleteDialogHide"
          @submit="handleDeleteDialogSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import TeamsDataTable from './TeamsDataTable/TeamsDataTable.vue'
import TeamDetailsDialog from './TeamDetailsDialog/TeamDetailsDialog.vue'
import TeamDeleteDialog from './TeamDeleteDialog/TeamDeleteDialog.vue'

import { TEAM_MODEL } from '@/constants/teams'
import services from '@/services'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { clone } from 'lodash'

const i18n = useI18n()
const toast = useToast()

const team = reactive({})
const teams = reactive({
  loading: false,
  error: null,
  data: []
})

const isTeamDetailsDialogVisible = ref(false)
const isTeamDeleteDialogOpen = ref(false)
const selectedTeams = ref([])
const isSubmitting = ref(false)
const serverErrors = ref({})

onMounted(() => loadTeams())

const loadTeams = async () => {
  try {
    teams.loading = true
    teams.data = await services.teams.fetchTeams()
  } catch (error) {
    teams.error = error.message
  } finally {
    teams.loading = false
  }
}

const handleNewTeam = () => {
  team.value = clone(TEAM_MODEL)
  isTeamDetailsDialogVisible.value = true
}

const handleDetailsDialogSubmit = async (team) => {
  try {
    isSubmitting.value = true
    serverErrors.value = {}
    if (team.id) {
      await services.teams.updateTeam(team)
    } else {
      await services.teams.createTeam(team)
    }

    toast.add({
      group: 'app',
      severity: 'success',
      summary: i18n.t('common.success'),
      detail: i18n.t('admin.teams.saveSuccess'),
      life: 4000
    })

    handleDetailsDialogHide()
    loadTeams()
  } catch (error) {
    if (error.response.status === 409) {
      console.log(i18n.t('admin.teams.validation.duplicatedName'))
      serverErrors.value.duplicatedName = true
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleDetailsDialogHide = () => {
  isTeamDetailsDialogVisible.value = false
}

const handleEditTeam = (row) => {
  team.value = { ...row }
  isTeamDetailsDialogVisible.value = true
}

const handleDeleteTeam = (row) => {
  team.value = [{ ...row }]
  isTeamDeleteDialogOpen.value = true
}

const handleDeleteTeams = () => {
  team.value = selectedTeams.value
  isTeamDeleteDialogOpen.value = true
}

const handleDeleteDialogHide = () => (isTeamDeleteDialogOpen.value = false)

const handleDeleteDialogSubmit = async (teams) => {
  try {
    isSubmitting.value = true
    const ids = teams.map(({ id }) => id)
    await services.teams.deleteTeams(ids)

    toast.add({
      group: 'app',
      severity: 'success',
      summary: i18n.t('common.success'),
      detail: i18n.t('admin.teams.deleteSuccess'),
      life: 4000
    })

    handleDeleteDialogHide()
    loadTeams()
  } catch (error) {
    toast.add({
      group: 'app',
      severity: 'error',
      summary: i18n.t('common.error'),
      detail: i18n.t('admin.teams.error.delete'),
      life: 4000
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/demo/badges.scss';
</style>
