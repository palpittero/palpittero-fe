<script setup lang="ts">
import type { iDashboardStats, iDashboardStatsCard, iState } from '@/types'
import { map } from 'lodash/fp'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<iState<iDashboardStats | null>>()

const generalStatsMap: Record<keyof iDashboardStats, iDashboardStatsCard> = {
  users: {
    id: 'users',
    title: 'Total de Usuários',
    icon: 'fa-solid fa-users',
    color: 'text-primary',
    route: { name: 'admin.users' },
  },
  leagues: {
    id: 'leagues',
    title: 'Total de Ligas',
    icon: 'fa-solid fa-flag',
    color: 'text-secondary',
    route: { name: 'admin.leagues' },
  },
  processedGuesses: {
    id: 'processedGuesses',
    title: 'Total de Palpites Processados',
    icon: 'fa-solid fa-comments',
    color: 'text-accecnt',
  },
}

const stats = computed(() =>
  // @ts-ignore
  map.convert({ cap: false })(
    (value: string, key: string) => ({
      ...generalStatsMap[key as keyof typeof generalStatsMap],
      value,
    }),
    props.data,
  ),
)

const router = useRouter()

const navigateTo = (route: any) => {
  router.push(route)
}
</script>

<template>
  <div class="stats shadow stats-vertical lg:stats-horizontal w-full lg:flex">
    <div
      class="stat bg-base-200 hover:bg-base-300 cursor-pointer"
      v-for="card in stats"
      :key="card.id"
      @click="navigateTo(card.route)"
    >
      <div class="stat-figure" :class="card.color">
        <i :class="card.icon" />
      </div>
      <div class="stat-title">{{ card.title }}</div>
      <div class="stat-value" :class="card.color">{{ card.value }}</div>
    </div>
  </div>
</template>
