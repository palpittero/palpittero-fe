import type { iRole, iUser } from '@/types'

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
  avatar: '',
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  phone: '',
  role: 'player',
  status: 'active',
}
