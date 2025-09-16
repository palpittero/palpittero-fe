import type { iRole, iStatus } from './common'

export type iUser = {
  id?: number
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

export type iUserOption = iOption & { email: string }
