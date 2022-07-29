<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toast />
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button
                label="New"
                icon="pi pi-plus"
                class="p-button-success mr-2"
                @click="handleNewLeague"
              />
              <Button
                label="Delete"
                icon="pi pi-trash"
                class="p-button-danger"
                @click="handleDeleteLeagues"
                :disabled="!selectedLeagues || !selectedLeagues?.length"
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

        <LeaguesDataTable
          v-model="selectedLeagues"
          :leagues="leagues"
          @edit="handleEditLeague"
          @delete="handleDeleteLeague"
          @manage-users="handleManageUsers"
        />

        <LeagueDetailsDialog
          v-model="league"
          :visible="isLeagueDetailsDialogVisible"
          @hide="handleDetailsDialogHide"
          @submit="handleDetailsDialogSubmit"
        />

        <LeagueUsersDialog
          :league="league"
          :visible="isLeagueUsersDialogVisible"
          can-manage
          @hide="handleUsersDialogHide"
          @submit="handleUsersDialogSubmit"
        />

        <LeagueDeleteDialog
          :visible="isLeagueDeleteDialogOpen"
          :leagues="league"
          @hide="handleDeleteDialogHide"
          @submit="handleDeleteDialogSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import LeaguesDataTable from './LeaguesDataTable/LeaguesDataTable.vue'
import LeagueDetailsDialog from './LeagueDetailsDialog/LeagueDetailsDialog.vue'
import LeagueUsersDialog from '@/components/Shared/Leagues/LeagueUsersDialog/LeagueUsersDialog.vue'
import LeagueDeleteDialog from './LeagueDeleteDialog/LeagueDeleteDialog.vue'

import { LEAGUE_MODEL } from '@/constants/leagues'
import services from '@/services'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { clone } from 'lodash'

const i18n = useI18n()
const toast = useToast()

const league = reactive({})
const leagues = reactive({
  loading: false,
  error: null,
  data: []
})

const isLeagueDetailsDialogVisible = ref(false)
const isLeagueDeleteDialogOpen = ref(false)
const isLeagueUsersDialogVisible = ref(false)
const selectedLeagues = ref([])

onMounted(() => loadLeagues())

const loadLeagues = async () => {
  try {
    leagues.loading = true
    leagues.data = await services.leagues.fetchLeagues()
  } catch (error) {
    leagues.error = error.message
  } finally {
    leagues.loading = false
  }
}

const handleNewLeague = () => {
  league.value = clone(LEAGUE_MODEL)
  isLeagueDetailsDialogVisible.value = true
}

const handleDetailsDialogSubmit = async (league) => {
  if (league.id) {
    await services.leagues.updateLeague(league)
  } else {
    await services.leagues.createLeague(league)
  }

  toast.add({
    severity: 'success',
    summary: i18n.t('common.success'),
    detail: i18n.t('admin.leagues.saveSuccess'),
    life: 4000
  })

  handleDetailsDialogHide()
  loadLeagues()
}

const handleDetailsDialogHide = () => {
  isLeagueDetailsDialogVisible.value = false
}

const handleEditLeague = (row) => {
  league.value = { ...row }
  isLeagueDetailsDialogVisible.value = true
}

const handleDeleteLeague = (row) => {
  league.value = [{ ...row }]
  isLeagueDeleteDialogOpen.value = true
}

const handleDeleteLeagues = () => {
  league.value = selectedLeagues.value
  isLeagueDeleteDialogOpen.value = true
}

const handleDeleteDialogHide = () => (isLeagueDeleteDialogOpen.value = false)

const handleDeleteDialogSubmit = async (league) => {
  try {
    await services.leagues.deleteLeague(league)

    toast.add({
      severity: 'success',
      summary: i18n.t('common.success'),
      detail: i18n.t('admin.leagues.deleteSuccess'),
      life: 4000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: i18n.t('common.error'),
      detail: i18n.t('admin.leagues.error.delete'),
      life: 3000,
      group: 'app'
    })
  }
}

const handleManageUsers = (row) => {
  league.value = row
  isLeagueUsersDialogVisible.value = true
}

const handleUsersDialogHide = (row) => {
  league.value = row
  isLeagueUsersDialogVisible.value = false
}

const handleUsersDialogSubmit = async (league) => {
  console.log('submit', league)
}
</script>

<style scoped lang="scss">
@import '@/assets/demo/badges.scss';
</style>
