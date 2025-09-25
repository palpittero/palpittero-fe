import type { iOption, iRole, iStatus } from './common'
import type { iChampionshipGuess } from './guesses'

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

  // UI
  guesses?: iChampionshipGuess[]
}

export type iUserOption = iOption & { email: string }
