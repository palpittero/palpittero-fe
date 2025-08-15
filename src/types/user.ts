import type { iRole, iStatus } from './common'

export type iUser = {
  id?: string
  name: string
  email: string
  password: string
  passwordConfirmation?: string | null
  phone?: string | null
  avatar?: string | null
  token?: string | null
  role: iRole
  status: iStatus
  createdAt?: string | null
  updatedAt?: string | null
}
