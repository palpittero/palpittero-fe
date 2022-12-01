<template>
  <Card class="card mb-5 p-0">
    <template #title>
      <div class="flex align-items-center justify-content-between mb-0">
        <h5>
          <b>{{ $t('app.guesses.points', rule, rule.points) }}</b>
          <i v-if="rule.hint" class="ml-2">({{ rule.hint }})</i>
        </h5>
      </div>
    </template>

    <template #content>
      <p class="ml-2" v-html="rule.description" />
      <DataTable :value="rule.examples">
        <Column field="guess" :header="$t('app.guesses.yourGuess')">
          <template #body="{ data }">
            <MatchScore :match="data.guess" />
          </template>
        </Column>
        <Column field="result" :header="header">
          <template #body="{ data }">
            <MatchScore :match="data.result" />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup>
import MatchScore from '@/components/Shared/Matches/MatchScore/MatchScore.vue'

defineProps({
  rule: {
    type: Object,
    required: true
  },
  header: {
    type: String,
    required: true
  }
})
</script>
