<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="flex gap-2 flex-column md:flex-row">
              <Button
                :label="$t('admin.leagues.newLeague')"
                icon="pi pi-plus"
                class="p-button-success"
                @click="handleNewLeague"
              />
              <Button
                :label="$t('common.removeSelected')"
                icon="pi pi-trash"
                class="p-button-danger"
                @click="handleDeleteLeagues"
                :disabled="!selectedLeagues || !selectedLeagues?.length"
              />
            </div>
          </template>
        </Toolbar>

        <LeaguesDataTable
          v-model="selectedLeagues"
          :leagues="leagues"
          @edit="handleEditLeague"
          @delete="handleDeleteLeague"
        />

        <LeagueDetailsDialog
          v-if="isLeagueDetailsDialogVisible"
          v-model="league"
          :visible="isLeagueDetailsDialogVisible"
          :submitting="isSubmitting"
          @hide="handleDetailsDialogHide"
          @submit="handleDetailsDialogSubmit"
        />

        <LeagueDeleteDialog
          v-if="isLeagueDeleteDialogOpen"
          :visible="isLeagueDeleteDialogOpen"
          :submitting="isSubmitting"
          :leagues="league"
          @hide="handleDeleteDialogHide"
          @submit="handleDeleteDialogSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LeaguesDataTable from './LeaguesDataTable/LeaguesDataTable.vue'
import LeagueDetailsDialog from '@/components/Shared/Leagues/LeagueDetailsDialog/LeagueDetailsDialog.vue'
import LeagueDeleteDialog from '@/components/Shared/Leagues/LeagueDeleteDialog/LeagueDeleteDialog.vue'

import { LEAGUE_MODEL } from '@/constants/leagues'
import services from '@/services'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'
import { clone } from 'lodash'
import { parseLeague, parseLeagueInput, parseLeagues } from '@/helpers/leagues'

const i18n = useI18n()
const toast = useToast()

const league = ref({})
const leagues = ref({
  loading: false,
  error: null,
  data: []
})
const isSubmitting = ref(false)

const isLeagueDetailsDialogVisible = ref(false)
const isLeagueDeleteDialogOpen = ref(false)
const selectedLeagues = ref([])

onMounted(() => loadLeagues())

const loadLeagues = async () => {
  try {
    leagues.value.loading = true
    leagues.value.data = parseLeagues(await services.leagues.fetchLeagues())
  } catch (error) {
    leagues.value.error = error.message
  } finally {
    leagues.value.loading = false
  }
}

const handleNewLeague = () => {
  league.value = clone(LEAGUE_MODEL)
  isLeagueDetailsDialogVisible.value = true
}

const handleDetailsDialogSubmit = async (league) => {
  isSubmitting.value = true
  const parsedLeague = parseLeagueInput(league)

  if (league.id) {
    await services.leagues.updateLeague(parsedLeague)
  } else {
    await services.leagues.createLeague(parsedLeague)
  }

  toast.add({
    group: 'app',
    severity: 'success',
    summary: i18n.t('common.success'),
    detail: i18n.t('admin.leagues.saveSuccess'),
    life: 4000
  })

  handleDetailsDialogHide()
  isSubmitting.value = false
  loadLeagues()
}

const handleDetailsDialogHide = () => {
  isLeagueDetailsDialogVisible.value = false
}

const handleEditLeague = async ({ id }) => {
  const parsedLeague = await services.leagues.fetchLeagueById(id)
  league.value = parseLeague(parsedLeague)
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

const handleDeleteDialogSubmit = async (leagues) => {
  try {
    const ids = leagues.map(({ id }) => id)
    await services.leagues.deleteLeagues(ids)

    toast.add({
      group: 'app',
      severity: 'success',
      summary: i18n.t('common.success'),
      detail: i18n.t('admin.leagues.deleteSuccess'),
      life: 4000
    })

    handleDeleteDialogHide()
    loadLeagues()
  } catch (error) {
    toast.add({
      group: 'app',
      severity: 'error',
      summary: i18n.t('common.error'),
      detail: i18n.t('admin.leagues.error.delete'),
      life: 4000
    })
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/demo/badges.scss';
</style>
