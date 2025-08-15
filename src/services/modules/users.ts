import { HTTP_MULTIPART_CONFIG } from '@/constants'
import { parseMultiPartFormData } from '@/helpers/form'
import api from '@/services/api'

const RESOURCE_URI = '/users'

const fetchUsers = () => api.get(RESOURCE_URI)

const fetchUserById = (id: number) => api.get(`${RESOURCE_URI}/${id}`)

const createUser = (user: any) => api.post(`${RESOURCE_URI}`, user)

const updateUser = (user: any) => {
  const formData = parseMultiPartFormData({ data: user, ignore: ['avatar'] })
  // @ts-expect-error - HTTP_MULTIPART_CONFIG is not a valid AxiosRequestConfig
  api.put(`${RESOURCE_URI}/${user.id}`, formData, HTTP_MULTIPART_CONFIG)
}

const deleteUser = (user: any) => api.delete(`${RESOURCE_URI}/${user.id}`)

const deleteUsers = (ids: number[]) => api.post(`${RESOURCE_URI}/delete-many`, { ids })

export default {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  deleteUsers,
}
