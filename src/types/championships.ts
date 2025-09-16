import type { iStatus } from './common'
import type { iGuess } from './guesses'
import type { iTeam } from './teams'

export type iChampionshipRoundTime = 'regularTime' | 'extraTime' | 'penalties'

export type iChampionshipRoundType = 'simple' | 'detailed'

export type iChampionship = {
  id?: number
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

  // UI
  selected?: boolean
}

export type iChampionshipRound = {
  id?: number
  uuid?: string
  name: string
  type: iChampionshipRoundTime
  ignoreGroups: boolean
}

export type iChampionshipGroup = {
  id?: number
  uuid?: string
  name: string
  teams: iTeam[]
}
