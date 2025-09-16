import type { iChampionship } from './championships'
import type { iStatus } from './common'
import type { iUser } from './user'

export type iLeaguePrize = {
  id?: number
  leagueId?: number
  league?: iLeague
  position: number
  amount: number | null
  createdAt?: string | null
  updatedAt?: string | null
}

export type iLeague = {
  id?: number
  name: string
  badge?: string | null
  championships: iChampionship[]
  users: iUser[]
  owner: string
  ownerId: number | null
  prizes: iLeaguePrize[]
  pointsStrategy?: 'grouped'
  enablePrizes?: number
  ticketValue: number | null
  resendInvitations?: boolean | null
  private?: number
  status?: iStatus | null
  createdAt?: string | null
  updatedAt?: string | null
}

export type iGuessLeague = Pick<iLeague, 'id' | 'private' | 'name' | 'badge'>
