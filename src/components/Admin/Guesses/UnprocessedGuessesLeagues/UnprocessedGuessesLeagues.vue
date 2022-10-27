<template>
  <UnprocessedGuessesLeaguesFetcher>
    <template #default="{ data: unprocessedGuesses }">
      <LeaguesDescriptionList
        :leagues="parseGuessesLeagues(unprocessedGuesses)"
        :title="$t('app.leagues.myLeagues.title')"
        :description="$t('app.leagues.myLeagues.description')"
        :empty-state="$t('app.leagues.noJoinedLeagues')"
      >
        <template #actions="{ league }">
          <Button
            :label="$t('admin.guesses.viewGuesses')"
            icon="pi pi-eye"
            class="p-button-text"
            @click="handleViewGuesses(league.id)"
          />
        </template> </LeaguesDescriptionList
    ></template>
  </UnprocessedGuessesLeaguesFetcher>
</template>

<script setup>
import { uniqBy } from 'lodash/fp'
import { useRouter } from 'vue-router'

import UnprocessedGuessesLeaguesFetcher from '@/components/Admin/Guesses/UnprocessedGuessesFetcher/UnprocessedGuessesFetcher.vue'
import LeaguesDescriptionList from '@/components/App/Leagues/LeaguesDescriptionList/LeaguesDescriptionList.vue'

const router = useRouter()

defineProps({
  guesses: {
    type: Array,
    default: () => []
  }
})

const parseGuessesLeagues = (unprocessedGuesses) =>
  uniqBy(
    'id',
    unprocessedGuesses.map(({ league }) => league)
  )

const handleViewGuesses = (leagueId) =>
  router.push({
    name: 'AdminUnprocessedGuesses',
    params: {
      leagueId
    }
  })
</script>
