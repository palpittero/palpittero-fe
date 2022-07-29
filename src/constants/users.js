import { STATUSES } from './'

export const USER_MODEL = {
  name: '',
  password: '',
  passwordConfirmation: '',
  phone: '',
  role: '',
  status: STATUSES.ACTIVE
}

export const USER_ROLES = {
  ADMIN: 'admin',
  PLAYER: 'player'
}
