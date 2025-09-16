import type { iOption } from '@/types'
import { pickBy, isNil } from 'lodash/fp'

const objectToSearchParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams(pickBy((param: any) => !isNil(param), params)).toString()

  return searchParams ? `?${searchParams}` : ''
}

const validateEmail = (email: string): RegExpMatchArray | null =>
  String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )

const parseOptions = (data: any[]): iOption[] =>
  data.map(({ id, name }: { id: number; name: string }) => ({
    id,
    name,
  }))

export { objectToSearchParams, validateEmail, parseOptions }
