import type { iChampionship } from './championships'
import type { iStatus } from './common'

export type iLeaguePrize = {
  id?: number
  leagueId?: number
  league?: iLeague
  position: number
  amount: number | null
  createdAt?: string | null
  updatedAt?: string | null
}

export type iLeagueUserStatus = 'approved' | 'pending' | 'invited'

export type iLeagueUser = {
  email: string
  id: number
  leagueId: number
  name: string
  owner: boolean
  points: number
  status: iLeagueUserStatus
  usersLeaguesId: number
}

export type iLeague = {
  id?: number
  name: string
  badge?: string | null
  championships: iChampionship[]
  users: iLeagueUser[]
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
