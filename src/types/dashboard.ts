import type { RouteLocationRaw } from 'vue-router'

export type iDashboardStats = {
  leagues: number
  users: number
  processedGuesses: number
}

export type iDashboardStatsCard = {
  id: string
  title: string
  icon: string
  color: string
  route?: RouteLocationRaw
}
