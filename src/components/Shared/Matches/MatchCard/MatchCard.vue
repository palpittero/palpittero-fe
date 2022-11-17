<template>
  <Card class="match-card" :class="`p-0 bg-${variant}-100`">
    <template #content>
      <div class="flex flex-column align-items-center gap-2">
        <div class="pb-1 flex justify-content-center align-items-center gap-2">
          <em>{{ $d(new Date(match.date), 'long', 'pt-BR') }}</em>
          <MatchStatusBadge :status="match.status" />
        </div>
        <small v-if="match.group" class="text-bold">
          {{ match.group.name }}
        </small>
      </div>
      <MatchCenterScore :match="match" class="my-3" />
      <div class="flex flex-column align-items-center gap-2">
        <div>
          {{ match.round.championship.name }}
          {{ match.round.championship.year }}
        </div>
        <small>{{ match.round.name }}</small>
      </div>
    </template>
  </Card>
</template>

<script setup>
import MatchCenterScore from '@/components/Shared/Matches/MatchCenterScore/MatchCenterScore.vue'
import MatchStatusBadge from '@/components/App/Championships/ChampionshipsRoundsMatchesList/RoundsMatchesList/MatchStatusBadge/MatchStatusBadge.vue'

defineProps({
  match: {
    type: Object,
    required: true
  },
  variant: {
    type: String,
    default: 'primary'
  }
})
</script>
