export type iStatus = 'active' | 'inactive' | 'deleted'

export type iRole = 'system' | 'admin' | 'player'

export type iState<T> = {
  loading: boolean
  error: Error | string | null
  data: T
}

export type iOption = Record<string, any> & {
  id: string | number
  name: string
}
