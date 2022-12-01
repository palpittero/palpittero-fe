import { pickBy, isNil } from 'lodash/fp'

const objectToSearchParams = (params) => {
  const searchParams = new URLSearchParams(
    pickBy((param) => !isNil(param), params)
  ).toString()

  return searchParams ? `?${searchParams}` : ''
}

const validateEmail = (email) =>
  String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )

export { objectToSearchParams, validateEmail }
