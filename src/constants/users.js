import { STATUSES } from './'

export const USER_ROLES = {
  ADMIN: 'admin',
  PLAYER: 'player'
}

export const USER_ROLES_OPTIONS = [
  {
    id: USER_ROLES.ADMIN,
    name: 'common.administrator'
  },
  {
    id: USER_ROLES.PLAYER,
    name: 'common.player'
  }
]

export const USER_MODEL = {
  name: '',
  password: '',
  passwordConfirmation: '',
  phone: '',
  role: USER_ROLES.PLAYER,
  status: STATUSES.ACTIVE
}
