import type { iChampionship } from './championships'
import type { iStatus } from './common'
import type { iLeague } from './leagues'
import type { iMatch } from './matches'
import type { iUser } from './user'

export type iGuess = {
  id: number
  points: number | null
  homeTeamRegularTimeGoals: number
  awayTeamRegularTimeGoals: number
  homeTeamExtraTimeGoals: number | null
  awayTeamExtraTimeGoals: number | null
  homeTeamPenaltiesTimeGoals: number | null
  awayTeamPenaltiesTimeGoals: number | null
  leagueStatus: iStatus
  championshipStatus: iStatus
  championship: iChampionship
  groupName: string
  user: Pick<iUser, 'id' | 'name' | 'avatar'>
  league: Pick<iLeague, 'id' | 'name' | 'badge' | 'private'>
  match: iMatch
  // match: {
  //   id: 1
  //   date: '2022-05-30T17:00:00.000Z'
  //   regularTimeHomeTeamGoals: 4
  //   regularTimeAwayTeamGoals: 3
  //   extraTimeHomeTeamGoals: null
  //   extraTimeAwayTeamGoals: null
  //   penaltiesTimeHomeTeamGoals: null
  //   penaltiesTimeAwayTeamGoals: null
  //   homeTeam: {
  //     name: 'Brasil'
  //     badge: 'https://cdn.countryflags.com/thumbs/brazil/flag-square-250.png'
  //   }
  //   awayTeam: {
  //     name: 'Argentina'
  //     badge: 'https://cdn.countryflags.com/thumbs/argentina/flag-square-250.png'
  //   }
  //   round: {
  //     id: 1
  //     name: 'Rodada 1 - Fase de Grupos'
  //     type: 'regularTime'
  //     championship: {
  //       id: 1
  //       name: 'Copa do Mundo'
  //       year: 2022
  //     }
  //   }
  //   status: 'finished'
  //   group: {
  //     id: 3
  //     name: 'Grupo 1'
  //   }
  // }
}

export type iUnprocessedGuess = {
  matchesGuesses: iGuess[]
  championshipsGuesses: iGuess[]
}
