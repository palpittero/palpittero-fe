import type { iUser, iUserOption } from '@/types'

type iParseUserForm = { user: iUser; changePassword: boolean }

export const parseUserForm = ({ user, changePassword }: iParseUserForm) => {
  const { password, ...rest } = user

  return changePassword ? { ...rest, password } : rest
}

export const parseUser = (users: iUser[]): iUserOption[] =>
  users.map(({ id, name, email }) => ({ id: Number(id), name, email }))
