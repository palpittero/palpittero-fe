import type { iChampionship, iChampionshipGroup, iChampionshipRound } from '@/types'
import { uniqueId } from 'lodash'

const initializeChampionshipPositions = (championship: iChampionship) =>
  [
    {
      championshipId: championship.id,
      team: null,
      teamId: null,
      position: 1,
    },
    {
      championshipId: championship.id,
      team: null,
      teamId: null,
      position: 2,
    },
  ].map((position) => ({
    ...position,
    ...championship.positions?.find((p) => p.position === position.position),
  }))

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
  championshipId: 0,
})

const createGroup = (name: string): iChampionshipGroup => ({
  uuid: uniqueId(),
  name: name || '',
  teams: [],
})

export {
  initializeChampionshipPositions,
  parseChampionshipPositions,
  parseChampionshipInput,
  createRound,
  createGroup,
}
