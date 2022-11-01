import { STATUSES } from '.'

export const CHAMPIONSHIPS_ROUNDS = {
  SIMPLE: 'simple',
  DETAILED: 'detailed'
}

export const CHAMPIONSHIP_MODEL = {
  name: '',
  year: null,
  teams: [],
  rounds: 1,
  roundsType: CHAMPIONSHIPS_ROUNDS.SIMPLE,
  status: STATUSES.ACTIVE
}

// export const CHAMPIONSHIP_ROUND_MODEL = {
//   name: 'Rodada #1',
//   type: CHAMPIONSHIPS_ROUND_TYPE.REGULAR_TIME
// }

export const CHAMPIONSHIPS_ROUND_TYPE = {
  // GROUP: 'group',
  // PLAYOFF: 'playoff',
  REGULAR_TIME: 'regularTime',
  EXTRA_TIME: 'extraTime',
  PENALTIES: 'penalties'
}

export const CHAMPIONSHIPS_ROUND_TYPE_OPTIONS = [
  {
    id: CHAMPIONSHIPS_ROUND_TYPE.REGULAR_TIME,
    name: 'admin.championships.regularTime'
  },
  {
    id: CHAMPIONSHIPS_ROUND_TYPE.EXTRA_TIME,
    name: 'admin.championships.extraTime'
  },
  {
    id: CHAMPIONSHIPS_ROUND_TYPE.PENALTIES,
    name: 'admin.championships.penalties'
  }
]

export const CHAMPIONSHIPS_ROUND_TYPE_OPTIONS_HINTS = {
  [CHAMPIONSHIPS_ROUND_TYPE.REGULAR_TIME]:
    'admin.championships.regularTimeHint',
  [CHAMPIONSHIPS_ROUND_TYPE.EXTRA_TIME]: 'admin.championships.extraTimeHint',
  [CHAMPIONSHIPS_ROUND_TYPE.PENALTIES]: 'admin.championships.penaltiesHint'
}
