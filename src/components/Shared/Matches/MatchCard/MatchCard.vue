<template>
  <Card class="match-card bg-primary-100">
    <template #content>
      <div class="flex flex-column align-items-center">
        <div
          class="pt-3 pb-1 flex justify-content-center align-items-center gap-2"
        >
          <em>{{ $d(new Date(match.date), 'long', 'pt-BR') }}</em>
          <MatchStatusBadge :status="match.status" />
        </div>
        <small>{{ match.round.name }}</small>
      </div>
      <MatchScore :match="match" />
    </template>
  </Card>
</template>

<script setup>
import MatchScore from '@/components/Shared/Matches/MatchScore/MatchScore.vue'
import MatchStatusBadge from '@/components/App/Championships/ChampionshipsRoundsMatchesList/RoundsMatchesList/MatchStatusBadge/MatchStatusBadge.vue'

defineProps({
  match: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss">
.match-card {
  .p-card-body,
  .p-card-content {
    padding: 0 !important;
  }
}
</style>
