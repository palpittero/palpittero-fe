<template>
  <Card class="card mb-5">
    <template #title>
      <div class="flex align-items-center justify-content-between mb-0">
        <h5>
          <b>{{ $t('common.points', rule, rule.points) }}</b>
          <i v-if="rule.hint" class="ml-2">({{ rule.hint }})</i>
        </h5>
      </div>
    </template>

    <template #content>
      <p class="ml-2" v-html="rule.description" />
      <DataTable :value="rule.examples">
        <Column field="guess" header="Seu Palpite">
          <template #body="{ data }">
            Time da casa <b>{{ data.guess.homeTeamRegularTimeGoals }}</b> x
            <b>{{ data.guess.awayTeamRegularTimeGoals }}</b> Time Visitante
          </template>
        </Column>
        <Column field="result" header="Resultado Final">
          <template #body="{ data }">
            Time da casa <b>{{ data.result.homeTeamRegularTimeGoals }}</b> x
            <b>{{ data.result.awayTeamRegularTimeGoals }}</b> Time Visitante
          </template></Column
        >
      </DataTable>
    </template>
  </Card>
</template>

<script setup>
defineProps({
  rule: {
    type: Object,
    required: true
  }
})
</script>
