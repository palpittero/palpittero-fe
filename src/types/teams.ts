import type { iStatus } from './common'
import type { iCountry } from './misc'

export type iTeamType = 'club' | 'nationalTeam'

export type iTeam = {
  id?: number
  name: string
  badge?: string | null
  type: iTeamType
  country?: iCountry | null
  countryId?: string | number | null
  nationalDivision?: string | number | null
  region?: string | null
  status: iStatus
  createdAt?: string | null
  updatedAt?: string | null

  // UI
  selected?: boolean
}
