import { STATUSES } from '.'

export const TEAM_TYPES = {
  NATIONAL_TEAM: 'nationalTeam',
  CLUB: 'club'
}

export const TEAM_TYPES_OPTIONS = [
  {
    id: TEAM_TYPES.NATIONAL_TEAM,
    name: 'admin.teams.nationalTeam'
  },
  {
    id: TEAM_TYPES.CLUB,
    name: 'admin.teams.club'
  }
]

export const TEAM_MODEL = {
  name: '',
  badge: '',
  type: TEAM_TYPES.NATIONAL_TEAM,
  country: '',
  region: '',
  nationalDivision: 0,
  status: STATUSES.ACTIVE
}

export const TEAM_FILTER_MODES = {
  TYPE: 'type',
  COUNTRY_REGION: 'countryRegion'
}
