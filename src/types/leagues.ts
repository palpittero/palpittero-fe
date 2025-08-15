import type { iStatus } from './common'

export type iLeague = {
  name: string
  badge?: string | null
  owner: string
  pointsStrategy?: 'grouped'
  visibility?: string
  status?: iStatus | null
  createdAt?: string | null
  updatedAt?: string | null
}
