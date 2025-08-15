import type { iRole, iUser } from '@/types'
import { STATUSES } from '.'

export const USER_ROLES: Record<string, iRole> = {
  ADMIN: 'admin',
  PLAYER: 'player',
}

export const USER_ROLES_OPTIONS: { id: iRole; name: string }[] = [
  {
    id: USER_ROLES.ADMIN,
    name: 'common.administrator',
  },
  {
    id: USER_ROLES.PLAYER,
    name: 'common.player',
  },
]

export const USER_MODEL: iUser = {
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  phone: '',
  role: USER_ROLES.PLAYER,
  status: STATUSES.ACTIVE,
}
