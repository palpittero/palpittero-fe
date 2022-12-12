<template>
  <Card class="match-card" :class="`p-0 bg-${variant}-100`">
    <template #content>
      <div class="flex flex-column align-items-center gap-2">
        <div
          class="pb-1 flex flex-column md:flex-row justify-content-center align-items-center gap-2"
        >
          <em>{{ $d(new Date(match.date), 'long', 'pt-BR') }}</em>
          <MatchStatusBadge :status="match.status" />
        </div>
        <small v-if="showGroup" class="text-bold">
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
import { computed } from 'vue'
import { CHAMPIONSHIPS_ROUND_TYPE } from '@/constants/championships'

const props = defineProps({
  match: {
    type: Object,
    required: true
  },
  variant: {
    type: String,
    default: 'primary'
  }
})

const showGroup = computed(
  () =>
    props.match.group &&
    props.match.round?.type === CHAMPIONSHIPS_ROUND_TYPE.REGULAR_TIME
)
</script>

<style lang="scss">
.match-card {
  .p-card-body,
  .p-card-content {
    padding: 0.5rem !important;
  }
}
</style>
