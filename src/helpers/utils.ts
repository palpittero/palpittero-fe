import { pickBy, isNil } from 'lodash'

const objectToSearchParams = (params: Record<string, any>): string => {
  // @ts-expect-error - Lodash types
  const searchParams = new URLSearchParams(pickBy((param: any) => !isNil(param), params)).toString()

  return searchParams ? `?${searchParams}` : ''
}

const validateEmail = (email: string): RegExpMatchArray | null =>
  String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )

export { objectToSearchParams, validateEmail }
