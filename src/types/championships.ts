import type { iStatus } from './common'

export type iChampionship = {
  id?: number
  name: string
  year: number
  status: iStatus
  createdAt?: string
  updatedAt?: string
}
