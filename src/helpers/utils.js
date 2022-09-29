import { pickBy, isNil } from 'lodash/fp'

const objectToSearchParams = (params) => {
  const searchParams = new URLSearchParams(
    pickBy((param) => !isNil(param), params)
  ).toString()

  return searchParams ? `?${searchParams}` : ''
}

export { objectToSearchParams }
