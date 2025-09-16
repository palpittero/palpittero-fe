import type { iChampionshipGroup, iChampionshipRound } from '@/types'
import { uniqueId } from 'lodash'

const getChampionshipPositionsInitialValues = (championshipId: number) => ({
  1: {
    championshipId,
    team: null,
    teamId: null,
    position: 1,
  },
  2: {
    championshipId,
    team: null,
    teamId: null,
    position: 2,
  },
})

const parseChampionshipPositions = (positions: any) =>
  positions.reduce(
    (acc: any, championshipPosition: any) => ({
      ...acc,
      [championshipPosition.position]: championshipPosition,
    }),
    {},
  )

const parseChampionshipInput = (championship: any) => ({
  ...championship,
  positions: Object.values(championship?.positions || {}),
})

const createRound = (name: string): iChampionshipRound => ({
  uuid: uniqueId(),
  name: name || '',
  type: 'regularTime',
  ignoreGroups: false,
})

const createGroup = (name: string): iChampionshipGroup => ({
  uuid: uniqueId(),
  name: name || '',
  teams: [],
})

export {
  getChampionshipPositionsInitialValues,
  parseChampionshipPositions,
  parseChampionshipInput,
  createRound,
  createGroup,
}
