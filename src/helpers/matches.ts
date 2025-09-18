import { isNil, orderBy, pick } from 'lodash/fp'
import { MATCH_STATUSES } from '@/constants/matches'
import type { iMatch, iMatchDetail } from '@/types'
import { uniqueId } from 'lodash'
import { parseUTCDate } from '@/utils'

const isMatchScheduled = (match: iMatch) => match.status === MATCH_STATUSES.SCHEDULED

const isMatchFinished = (match: iMatch) => match.status === MATCH_STATUSES.FINISHED

const matchHasNoResult = ({
  regularTimeHomeTeamGoals,
  regularTimeAwayTeamGoals,
  ...match
}: iMatch) =>
  isMatchFinished(match) && isNil(regularTimeHomeTeamGoals) && isNil(regularTimeAwayTeamGoals)

const createMatchDetail = (): iMatchDetail => ({
  uuid: uniqueId(),
  homeTeamId: null,
  awayTeamId: null,
  date: null,
  group: null,
})

const parseMatch = (match: iMatch): iMatch => {
  return {
    ...pick(
      [
        'id',
        'homeTeamId',
        'awayTeamId',
        'homeTeam',
        'awayTeam',
        'penaltiesTimeAwayTeamGoals',
        'penaltiesTimeHomeTeamGoals',
        'regularTimeAwayTeamGoals',
        'regularTimeHomeTeamGoals',
        'result',
        'round',
        'roundId',
        'resetStatus',
        'status',
      ],
      match,
    ),
    championshipId: match.round?.championship.id ?? null,
    groupId: match.group?.id ?? null,
    date: parseUTCDate(match.date!),
  }
}

const orderMatchesByStatusAndDate = (matches: iMatch[]) =>
  orderBy(
    (match: iMatch) => (match.status === 'scheduled' ? match.status : match.date),
    'desc',
    matches,
  )

export {
  isMatchScheduled,
  isMatchFinished,
  matchHasNoResult,
  createMatchDetail,
  parseMatch,
  orderMatchesByStatusAndDate,
}
