import { isArray, isObject } from 'lodash/fp'

const parseMultiPartFormData = (data) => {
  const formData = new FormData()

  for (const key in data) {
    const value =
      isArray(data[key]) || isObject(data[key])
        ? JSON.stringify(data[key])
        : data[key]
    formData.append(key, value)
  }

  return formData
}

export { parseMultiPartFormData }
