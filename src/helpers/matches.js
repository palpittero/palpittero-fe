import { isNil } from 'lodash/fp'
import { MATCH_STATUSES } from '@/constants/matches'

const isMatchScheduled = (match) => match.status === MATCH_STATUSES.SCHEDULED

const isMatchFinished = (match) => match.status === MATCH_STATUSES.FINISHED

const matchHasNoResult = ({
  regularTimeHomeTeamGoals,
  regularTimeAwayTeamGoals,
  ...match
}) =>
  isMatchFinished(match) &&
  isNil(regularTimeHomeTeamGoals) &&
  isNil(regularTimeAwayTeamGoals)

const parseMatchGoals = (goals) => (isNil(goals) ? '-' : goals)

export { isMatchScheduled, isMatchFinished, matchHasNoResult, parseMatchGoals }
