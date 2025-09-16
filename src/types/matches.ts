import type { iChampionship, iChampionshipGroup, iChampionshipRoundTime } from './championships'
import type { iStatus } from './common'
import type { iTeam } from './teams'

export type iMatchResult =
  | 'homeTeamRegularTimeWin'
  | 'awayTeamRegularTimeWin'
  | 'homeTeamExtraTimeWin'
  | 'awayTeamExtraTimeWin'
  | 'homeTeamPenaltiesWin'
  | 'awayTeamPenaltiesWin'
  | 'draw'

export type iMatchRound = {
  id: number
  name: string
  code: number
  ignoreGroups: boolean
  championship: {
    id: number
    name: 'Copa do Mundo'
    year: number
    status: iStatus
    hasGroups: boolean
  }
  type: iChampionshipRoundTime
}

export type iMatchStatus =
  | 'scheduled'
  | 'preparation'
  | 'in_progress'
  | 'finished'
  | 'cancelled'
  | 'postponed'
  | 'deleted'

export type iMatchDetail = {
  uuid?: string | null
  id?: number | string | null
  homeTeam?: iTeam | null
  homeTeamId?: number | null
  awayTeam?: iTeam | null
  awayTeamId?: number | null
  groupId?: number | null
  group: iChampionshipGroup | null
  date?: string | null
}

export type iMatch = {
  id?: number | null
  homeTeamId?: number | null
  awayTeamId?: number | null
  roundId: number | null

  regularTimeHomeTeamGoals?: number | null
  regularTimeAwayTeamGoals?: number | null
  extraTimeHomeTeamGoals?: number | null
  extraTimeAwayTeamGoals?: null
  penaltiesTimeHomeTeamGoals?: number | null
  penaltiesTimeAwayTeamGoals?: number | null
  result?: iMatchResult
  date?: string | null
  status: iMatchStatus | null
  createdAt?: string | null
  updatedAt?: string | null
  group?: iChampionshipGroup | null
  homeTeam?: iTeam | null
  awayTeam?: iTeam | null
  round?: iMatchRound | null
  groupId: number | null
  details?: iMatchDetail[]
  championship?: iChampionship | null

  // UI
  championshipId: number | null
  resetStatus: boolean
}
