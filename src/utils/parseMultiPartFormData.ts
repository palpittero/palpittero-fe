import { isArray, isObject } from 'lodash/fp'

type iParseMultiPartFormData = {
  data: any
  ignore: string[]
}

export const parseMultiPartFormData = ({
  data,
  ignore = [],
}: iParseMultiPartFormData): FormData => {
  const formData = new FormData()

  for (const key in data) {
    const value =
      !ignore.includes(key) && (isArray(data[key]) || isObject(data[key]))
        ? JSON.stringify(data[key])
        : data[key]

    formData.append(key, value)
  }

  return formData
}
