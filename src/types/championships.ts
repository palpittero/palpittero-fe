import type { iStatus } from './common'
import type { iGuess } from './guesses'
import type { iTeam } from './teams'
import type { iUser } from './user'

export type iChampionshipRoundTime = 'regularTime' | 'extraTime' | 'penalties'

export type iChampionshipRoundType = 'simple' | 'detailed'

export type iChampionship = {
  id: number
  name: string
  year: number | null
  status: iStatus
  enableGuesses?: boolean
  rounds: any[] | number
  roundsType: iChampionshipRoundType
  groups: any[]
  hasGroups: boolean
  teams: iTeam[]
  createdAt?: string
  updatedAt?: string
  guesses: iGuess[]
  positions?: any[]

  // UI
  selected?: boolean
  users?: iUser[]
}

export type iChampionshipRound = {
  id?: number
  uuid?: string
  name: string
  type: iChampionshipRoundTime
  ignoreGroups: boolean
  championshipId: number

  // UI
  current?: boolean
}

export type iChampionshipGroup = {
  id?: number
  uuid?: string
  name: string
  teams: iTeam[]
}
