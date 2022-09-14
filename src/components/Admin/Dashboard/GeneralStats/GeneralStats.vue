<template>
  <BlockViewer header="Stats">
    <div class="surface-ground">
      <div class="grid">
        <div
          class="col-12 md:col-6 lg:col-4"
          v-for="card of generalStatsCards"
          :key="card.id"
        >
          <GeneralStatsCard v-bind="card" />
        </div>
      </div>
    </div>
  </BlockViewer>
</template>

<script setup>
import { computed } from 'vue'
import { map } from 'lodash/fp'
import GeneralStatsCard from './GeneralStatsCard/GeneralStatsCard.vue'

import { DASHBOARD_GENERAL_CARD } from '@/constants/dashboard'

const props = defineProps({
  generalStats: {
    type: Array,
    default: () => []
  }
})
const generalStatsCards = computed(() =>
  map.convert({ cap: false })(
    (value, key) => ({
      ...DASHBOARD_GENERAL_CARD[key],
      value
    }),
    props.generalStats
  )
)
</script>
